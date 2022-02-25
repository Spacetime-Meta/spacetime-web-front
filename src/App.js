import React, { useEffect, useState } from 'react';
import styled from 'styled-components'
import { Switch, Route, Redirect } from 'react-router-dom';
import './App.css';

import Nav from "./components/Nav"

import Homepage from './pages/Homepage';
import CustomChunkPage from './pages/CustomChunkPage';

import AlertBar from './components/AlertBar';

import NamiWalletApi, { Cardano } from './nami-js';
import blockfrostApiKey from '../config.js'; 
let nami;

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

const LayoutWrapper = ({ children, connected, connect, getBalance }) => {
    return (
        <ContentWrapper>
            <Nav 
                connected={connected}
                connect={connect}
                getBalance={getBalance}
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

    useEffect( () => { async function detect() {
            const Chain = await Cardano();
            nami = new NamiWalletApi(Chain, window.cardano, blockfrostApiKey)

            if (await nami.isInstalled()) {
                await nami.isEnabled().then(result => { 
                    setConnected(result)
                })       
            }
        }
        detect()
    }, [])

    const connect = async () => {
        // Connects nami wallet to current website 
        if(!connected){
            await nami.enable()
                .then(result => setConnected(result))
                .catch(e => console.log(e))
        }
    }

    const getAddress = async () => {
        // retrieve address of nami wallet
        if (!connected) {
            await connect()
        }
        await nami.getAddress().then((newAddress) => { console.log(newAddress); setAddress(newAddress) })
    }

    const getBalance = async () => {
        if (!connected) {
            await connect()
        }
        await nami.getBalance().then(result => { 
            setNfts(result.assets); 
            setBalance(result.lovelace) 
        })
    }

    const handleCustomizeChunks = async (selectedChunks, metadata) => {

        console.log(metadata)

        let utxos = await nami.getUtxosHex();
        const myAddress = await nami.getAddress();
        const recipients = [{ 
            "address": myAddress, 
            "amount": "0",
            "assets":  selectedChunks
        }]

        let netId = await nami.getNetworkId();
        const t = await nami.transaction({
            PaymentAddress: myAddress,
            recipients: recipients,
            metadata: {"77223001": metadata},
            utxosRaw: utxos,
            networkId: netId.id,
            ttl: 3600,
            multiSig: null
        })
        const signature = await nami.signTx(t)
        const txHash = await nami.submitTx({
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
                    >
                        <Homepage />
                    </LayoutWrapper>
                </Route>
                <Route path="/upload">
                    <LayoutWrapper
                        connected={connected}
                        connect={connect}
                    >
                        <CustomChunkPage 
                            nfts={nfts}
                            getBalance={getBalance}
                            handleCustomizeChunks={handleCustomizeChunks}
                            doAlert={doAlert}
                        />
                    </LayoutWrapper>
                </Route>
                <Route path="/map">
                    <LayoutWrapper
                        connected={connected}
                        connect={connect}
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



    