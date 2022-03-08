import React, { useEffect, useState } from 'react';
import styled from 'styled-components'
import { Switch, Route, Redirect } from 'react-router-dom';
import './App.css';

import Nav from "./components/Nav"

import Homepage from './pages/Homepage';
import CustomChunkPage from './pages/CustomChunkPage';

import AlertBar from './components/AlertBar';

import WalletApi, { Cardano, Wallet } from './nami-js';
import blockfrostApiKey from '../config.js'; 
let nami;
let wallet;
let walletAPI;

const AppWrapper = styled.div`
    background: ${({ theme }) => theme.backgrounds.app };
    color: ${({ theme }) => theme.colors.main};
`

const ContentWrapper = styled.div`
    display: grid;
    grid-template-columns: ${({ theme }) => theme.dimentions.nav.width} 1fr; 

    @media screen and (max-width: 1080px) {
        grid-template-columns: 1fr;
        max-width: 100vw;
        overflow: hidden;
        grid-gap: 0;
    }
`;

const AppDisplay = styled.div`
    height: 100%;
    width: 100%;
    min-height: 100vh;
    transition: width 0.25s ease;
    background: ${({ theme }) => theme.backgrounds.app};

    @media screen and (max-width: 1080px) {
        min-height: calc(100vh - ${({ theme }) => theme.dimentions.nav.height});
    }
`

const MapDisplay = styled.iframe`
    width: 100%;
    height: 100%;
    overflow: hidden;
`

const LayoutWrapper = ({ children, connected, connect, getBalance, connectedWallet }) => {
    return (
        <ContentWrapper>
            <Nav 
                connected={connected}
                connect={connect}
                getBalance={getBalance}
                connectedWallet={connectedWallet}
            />
            <AppDisplay>{children}</AppDisplay>
        </ContentWrapper>
    ); 
};

const App = () => {
    const [connected, setConnected] = useState()
    const [address, setAddress] = useState()
    const [nfts, setNfts] = useState([])
    const [balance, setBalance] = useState()
    const [isAlert, setIsAlert] = useState(false)
    const [message, setMessage] = useState("Default message")
    const [gravity, setGravity] = useState(1) //1=red, 2=green
    const [connectedWallet, setConnecedWallet] = useState()

    useEffect( () => { 
        async function detect() {
            const cardano_serialization_lib = await Cardano();

            // check if the user has a pre selected wallet
            const walletName = localStorage.getItem('wallet_name')
            if(walletName){

                // timout required because ccvault takes a few seconds to inject api
                setTimeout(async () => {
                    if(typeof window.cardano[walletName] !== undefined){
                        console.log("Found predefined wallet: "+walletName)
                        wallet = new Wallet(window.cardano[walletName])
                        await wallet.isEnabled().then(async result => {
                            setConnected(result)
                            setConnecedWallet(walletName)

                            if(result) {
                                let walletInnerApi = await wallet.enable()

                                walletAPI = new WalletApi(
                                    cardano_serialization_lib,
                                    wallet,
                                    walletInnerApi,
                                    blockfrostApiKey
                                )
                            }
                            else { 
                                console.log("No spaming user")
                                localStorage.removeItem('wallet_name')
                            }
                        })
                    }
                }, 3000)
            }
            else { console.log("No preselected wallet") }
        }
        detect()
    }, [])

    const connect = async (walletName) => {
        // Connects nami wallet to current website 
        const  cardano_serialization_lib = await Cardano();

        if(typeof window.cardano[walletName] !== undefined) {
            wallet = new Wallet(window.cardano[walletName])
            let walletInnerApi = await wallet.enable()

            setConnected(true)
            setConnecedWallet(walletName)

            walletAPI = new WalletApi(
                cardano_serialization_lib,
                wallet,
                walletInnerApi,
                blockfrostApiKey
            )
            localStorage.setItem('wallet_name', walletName)
        } 
        else {
            doAlert(1, "You do not have "+walletName+" wallet installed.", 5)
        }

    }

    const getBalance = async () => {
        if (!connected) {
            const walletName = localStorage.getItem('wallet_name')
            if(walletName) { 
                await connect(walletName)
            }
            else { doAlert(1, `Connect with a wallet on the sidebar`, 5) }
        }
        await walletAPI.getBalance().then(result => {
            setNfts(result.assets); 
            setBalance(result.lovelace) 
        })
    }

    const handleCustomizeChunks = async (selectedChunks, metadata) => {

        let utxos = await walletAPI.getUtxosHex();
        const myAddress = await walletAPI.getAddress();
        const recipients = [{ 
            "address": myAddress, 
            "amount": "0",
            "assets":  selectedChunks
        }]

        let netId = await walletAPI.getNetworkId();
        const t = await walletAPI.transaction({
            PaymentAddress: myAddress,
            recipients: recipients,
            metadata: {"77223001": metadata},
            utxosRaw: utxos,
            networkId: netId.id,
            ttl: 3600,
            multiSig: null
        })
        // console.log(t)
        const signature = await walletAPI.signTx(t)
        const txHash = await walletAPI.submitTx({
            transactionRaw: t,
            witnesses: [signature],
            networkId: netId.id
        })      
        if(txHash) { doAlert(2, "Transaction successfuly submited.\nTxHash: "+txHash, 10) }
        else { doAlert(1, "An Error occured, try again", 10) }           
    }

    window.addEventListener("message", (event) => {
        try {
           const data = JSON.parse(event.data)
           window.location.href = data.message.link
        } catch (e) { }
    })

    function doAlert (gravity, message, time) {
        setGravity(gravity)
        setMessage(message)
        setIsAlert(true)
        setTimeout(() => {
            setIsAlert(false)
        }, time * 1000)
    }

    const s = window.location.href
    const windowLocation =  s.substring(0, s.indexOf('#'));

    return (
        <AppWrapper>
            {isAlert ? 
                <AlertBar 
                    message={message}
                    gravity={gravity}
                /> 
            : <></> }
            <Switch>
                <Route path="/home">
                    <LayoutWrapper 
                        connected={connected}
                        connect={connect}
                        connectedWallet={connectedWallet}
                    >
                        <Homepage />
                    </LayoutWrapper>
                </Route>
                <Route path="/upload">
                    <LayoutWrapper
                        connected={connected}
                        connect={connect}
                        connectedWallet={connectedWallet}
                    >
                        <CustomChunkPage 
                            nfts={nfts}
                            getBalance={getBalance}
                            handleCustomizeChunks={handleCustomizeChunks}
                            doAlert={doAlert}
                        />
                    </LayoutWrapper>
                </Route>
                <Route path="/supply">
                    <LayoutWrapper
                        connected={connected}
                        connect={connect}
                        connectedWallet={connectedWallet}
                    >

                        <div>this is supply info</div>
                    </LayoutWrapper>
                </Route>
                <Route path="/map">
                    <LayoutWrapper
                        connected={connected}
                        connect={connect}
                        connectedWallet={connectedWallet}
                    >
                        <MapDisplay id={"map"} src={windowLocation+"/map/map.html"} frameBorder="0"/>
                    </LayoutWrapper>
                </Route>
                <Redirect to="/home" />
            </Switch>
        </AppWrapper>
    )
}
export default App;



    