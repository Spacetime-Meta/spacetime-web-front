import React, { useEffect, useState } from "react";
import styled from "styled-components";

import ChunkCard from "../../components/ChunkCard"

const PageWrapper = styled.div`
    padding: 25px;
`

const CustomPageTitle = styled.h1`
    padding-bottom: 25px;
    font-size: 48px;
    text-align: center;
    color: white;

    @media screen and (max-width: 768px) {
        font-size: 40px;
    }

    @media screen and (max-witdh: 480px) {
        font-size: 32px
    }
`

const GridRow = styled.div`
    display: grid;
    grid-template-areas: 'col1 col2';
    grid-template-columns: repeat(2, 1fr);
    column-gap: 1.25em;

    @media screen and (max-width: 768px) {
        grid-template-columns: repeat(1, 1fr);
        grid-template-areas: 'col1' 'col2';
    }
`

const Column1 = styled.div`
    grid-area: col1;
    padding: 50px 0px;
`;

const Column2 = styled.div`
    grid-area: col2;
    padding: 50px 0px;
`;

const PlanetiFrame = styled.iframe`
    width: 100%;
    height: 600px;
    border-radius: 50px;
`

const Panel = styled.div`
    position: relative;
    background-color: rgba(0,0,0,0.1);
    padding: 1.25rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.lightGrayHover};
`;

const PanelTitle = styled.h3`
    margin-bottom: 10px;
`

const FormField = styled.input`
    margin-bottom: 10px;
`
const MetadataButton = styled.button`
    width: 150px;
`

const CardDisplay = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);

    @media screen and (max-width: 1550px) {
        grid-template-columns: repeat(3, 1fr);
    }

    @media screen and (max-width: 1400px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media screen and (max-width: 768px) {
        grid-template-columns: repeat(3, 1fr);
    }

    @media screen and (max-width: 650px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media screen and (max-width: 468px) {
        grid-template-columns: repeat(1, 1fr);
    }
`

function CustomChunkPage ({ getBalance, nfts, handleCustomizeChunks, doAlert }) {
    
    const [isLoaded, setIsLoaded] = useState(false)
    let selectedNfts = [];
    let metadata = {};

    const s = window.location.href
    const windowLocation = s.substring(0, s.indexOf('#'));

    function sendData () {
        metadata = {
            name: document.getElementById("display-name").value,
            logo: document.getElementById("display-logo").value,
            image: document.getElementById("portal-image").value,
            portal: document.getElementById("portal-link").value,
            planet: document.getElementById("planet-model").value
        }

        document.getElementById("planetDisplay").contentWindow.postMessage(
            JSON.stringify({
                error: false,
                message: metadata
            }),
            '*'
        );
    }

    function updateSelection (nftName) {
        if(selectedNfts.indexOf(nftName) !== -1){
            selectedNfts.splice(selectedNfts.indexOf(nftName),1)
        }
        else {
            selectedNfts.push(nftName)
        }
    }
    
    function handleGetBalance () {
        setIsLoaded(true)
        getBalance();
    }

    function submitChanges () {
        if (selectedNfts.length !== 0) {
            
            metadata = {
                chunks: selectedNfts.map(nft => { return nft.unit.substring(57) })
            }
            
            if(document.getElementById("display-name").value !== "") {
                metadata.name = document.getElementById("display-name").value;
            }
            if(document.getElementById("display-logo").value !== "") {
                metadata.logo = document.getElementById("display-logo").value;
            }
            if(document.getElementById("portal-image").value !== "") {
                metadata.image = document.getElementById("portal-image").value;
            }
            if(document.getElementById("portal-link").value !== "") {
                metadata.portal = document.getElementById("portal-link").value
            }
            if(document.getElementById("portal-link").value !== "") {
                metadata.planet = document.getElementById("planet-model").value
            }
            if (Object.keys(metadata).length !== 0) {
                handleCustomizeChunks(selectedNfts, metadata)
            }
            else { doAlert(1, "Metadata is empty, customize at least one field", 10) }
        } 
        else {doAlert(1, "Must select at least one chunk to customize", 10)}
    }

    return (
        <PageWrapper>
            <CustomPageTitle>Customize Chunks</CustomPageTitle>
            <PlanetiFrame id={"planetDisplay"} src={windowLocation+"/map/planet_display.html"} frameBorder="0" />
            <GridRow>    
                <Column1>
                    <Panel>
                        <PanelTitle>Fill the fields</PanelTitle>
                        
                        <h5>Name To display On Hover</h5>
                        <FormField id="display-name" placeholder="Cool Planet" />

                        <h5>Logo To Display On Hover</h5>
                        <small>This should be an IPFS hash starting with Qm..</small>
                        <FormField id="display-logo" placeholder="QmfD8B3U5pzKDxV5XC2SbmysVWUwDvQ4eVLrZuUfJMBGEt" />
                        
                        <h5>Portal Image</h5>
                        <small>This should be an IPFS hash starting with Qm..</small>
                        <FormField id="portal-image" placeholder="QmQ52o7KZJ6kGKt9cjuzJd1KtJ64pYQrUsPKKb52JM17hp"/>

                        <h5>Portal Link</h5>
                        <small>This is the link to enter your world</small>
                        <FormField id="portal-link" placeholder="https://spacetime-meta.github.io/spawn-planet/" />

                        <h5>Glb File Of Your Planet (Optional)</h5>
                        <small>This should be an IPFS hash starting with Qm..</small>
                        <FormField id="planet-model" />

                        <MetadataButton onClick={sendData}>Preview Planet</MetadataButton>
                        
                    </Panel>             
                </Column1>
                <Column2>
                    <Panel>
                        <PanelTitle>Select the chunks</PanelTitle>
                        <CardDisplay>
                            {isLoaded ? nfts.map((nft) => {
                                if(nft.policy === "7652a254a5691f32203c093fcbd74193447c8724cadaf5e7402cf33b"){
                                    return (
                                        <ChunkCard 
                                            key={nft.name}
                                            nft={nft}
                                            updateSelection={updateSelection}
                                        />
                                    )
                                }
                            }) : 
                                <button onClick={handleGetBalance}>Load your chunks</button>
                            }
                        </CardDisplay>
                    </Panel>
                </Column2>
            </GridRow>
            <div style={{height: "50px"}}/>
            <Panel>
                <PanelTitle>Submit Changes</PanelTitle>
                <button id="submit" onClick={submitChanges}>customize chunks</button>
                
            </Panel>
        </PageWrapper>
    )
}
export default CustomChunkPage