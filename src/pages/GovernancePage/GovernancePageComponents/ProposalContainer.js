import React, { useState, useEffect } from 'react'
import styled from "styled-components";
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

import ChunkCard from "../../../components/ChunkCard"
import { Panel } from "../../../components/sharedComponents/Panels"

const PanelRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`

const Arrowwrapper = styled.div`
    font-size: 2em;
    padding-right: 15px;
`

const VoteForm = styled.div`
    border-top: 2px solid ${({ theme }) => theme.colors.lightGrayHover};
    padding-top: 25px;
    margin-top: 25px;
`

const Status = styled.p`
    color: ${({ status }) => status === "Awaiting vote" ? "#ffd400" : "white"};
`

const Option = styled.div`
    border: 1px solid black;
    border-radius: 15px;
    padding: 15px;
    margin: 15px;
    background: ${({ isActive }) => isActive ? "#e900ff" : ""};
`

const CardDisplay = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);

    @media screen and (max-width: 1550px) {
        grid-template-columns: repeat(6, 1fr);
    }

    @media screen and (max-width: 1400px) {
        grid-template-columns: repeat(4, 1fr);
    }

    @media screen and (max-width: 1165px) {
        grid-template-columns: repeat(3, 1fr);
    }

    @media screen and (max-width: 1080px) {
        grid-template-columns: repeat(4, 1fr);
    }

    @media screen and (max-width: 915px) {
        grid-template-columns: repeat(3, 1fr);
    }

    @media screen and (max-width: 745px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media screen and (max-width: 560px) {
        grid-template-columns: repeat(1, 1fr);
    }
`

function ProposalContainer({ proposal, nfts }) {
    
    const [isActive, setIsActive] = useState(false)
    const [selectChunksOption, setSelectChunksOption] = useState("none")
    const [isLoaded, setIsLoaded] = useState(false)
    const [selectedNfts, setSelectedNfts] = useState([])    
    
    function toggleProposal() {
        setIsActive(!isActive)
    }

    function handleChoseOption(option) {
        setSelectedNfts([])
        if(option === "all") {
            selectAllChunks()
        }
        setSelectChunksOption(option)
    }

    function selectAllChunks() {
        nfts.forEach(nft => {
            if(nft.policy === "7652a254a5691f32203c093fcbd74193447c8724cadaf5e7402cf33b"){
                setSelectedNfts(selectedNfts => [...selectedNfts, nft])
            }
        })
    }

    useEffect(() => {
        if(nfts.length > 0){ 
            setIsLoaded(true)
        }
    },[nfts])

    function updateSelection (nft) {
        console.log("selectedNfts: "+selectedNfts)
        let isSelected = false;
        selectedNfts.forEach(selectedNft => {
            if(selectedNft.unit === nft.unit){
                isSelected = true
            }
        })
        
        if(isSelected){
            setSelectedNfts(selectedNfts.filter(selectedNft => selectedNft.unit !== nft.unit))
        }
        else {
            setSelectedNfts(selectedNfts => [...selectedNfts, nft])
        }
    }

    return (
        <Panel style={{background: "#033f3f"}}>
            <PanelRow style={{justifyContent: "space-between"}}>
                <PanelRow>
                    <Arrowwrapper onClick={toggleProposal} style={{cursor: "pointer"}}>
                        {isActive ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </Arrowwrapper>
                    <h4>{proposal.id+" - "+proposal.title}</h4>
                </PanelRow>
                <Status status={proposal.status}>{proposal.status}</Status>
            </PanelRow>
            <i>{proposal.subtitle}</i>
            {isActive && 
                <div style={{paddingTop: "25px"}}>
                    {proposal.desc.map((p) => {
                        return (
                            <div key={Math.random()}>
                                <p >{p}</p><br />
                            </div>
                        )
                    })}
                    
                    <div>
                        <h4>Result</h4>
                        <PanelRow style={{justifyContent: "space-between", width: "300px"}}>
                            <div>
                                <p>Option 1</p>
                                <p>Option 2</p>
                                <p>Did not vote</p>
                            </div>
                            <div>
                                <p>5300</p>
                                <p>1234</p>
                                <p>450</p>
                            </div>
                            <div>
                                <p>34%</p>
                                <p>25%</p>
                                <p>12%</p>
                            </div>
                        </PanelRow>
                    </div>

                    {//proposal.status === "voting" 
                    true && 
                            <VoteForm>
                                <h4>Vote</h4>
                                <p>1. select Chunks (one chunk = one vote)</p>
                                <PanelRow>
                                    <Option isActive={selectChunksOption === "all"} onClick={() => {handleChoseOption("all")}}>All Chunks</Option>
                                    <Option isActive={selectChunksOption === "specific"} onClick={() => {handleChoseOption("specific")}}>Specific Chunks</Option>
                                    <p>{selectedNfts.length+" chunks selected"}</p>
                                </PanelRow>
                                {selectChunksOption === "specific" && 
                                    <Panel>
                                        <CardDisplay>
                                            {isLoaded ? 
                                                nfts.map((nft) => {
                                                    if(nft.policy === "7652a254a5691f32203c093fcbd74193447c8724cadaf5e7402cf33b"){
                                                        return (
                                                            <ChunkCard 
                                                                key={nft.name}
                                                                nft={nft}
                                                                updateSelection={updateSelection}
                                                            />
                                                        )
                                                    }
                                                }) 
                                            : 
                                                <p>Load your voting power first</p>
                                            }
                                        </CardDisplay>
                                    </Panel>
                                }
                                <PanelRow>
                                    <Option>Option 1</Option>
                                    <Option>Option 2</Option>
                                </PanelRow>
                                <button>Submit</button>
                            </VoteForm>
                    }
                </div>
            }
        </Panel>
    )
}
export default ProposalContainer
