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
    color: ${({ status }) => status === "Awaiting vote" ? "#ffd400" : status === "voting" ? "#00ad31" : status === "approved" ? "#00ad31" : "white"};
`

const Option = styled.div`
    cursor: pointer;
    border: 1px solid black;
    border-radius: 15px;
    padding: 10px;
    margin: 15px;
    background: ${({ isActive }) => isActive ? "#0a8484" : ""};

    :hover {
        background: #045b5b;
    }
`

const CardDisplay = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);

    @media screen and (max-width: 1700px) {
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

const TableHeader = styled.p`
    margin-top: 15px;    
    margin-bottom: 5px;
`

function ProposalContainer({ proposal, nfts, writeToBlockchain, doAlert }) {
    
    const [isActive, setIsActive] = useState(false)
    const [selectChunksOption, setSelectChunksOption] = useState("none")
    const [isLoaded, setIsLoaded] = useState(false)
    const [selectedNfts, setSelectedNfts] = useState([]) 
    const [selectedOption, setSelectedOption] = useState('none')

    function toggleProposal() {
        setIsActive(!isActive)
    }

    function handleChoseOption(option) {
        if(selectChunksOption !== option) {
            setSelectedNfts([])
            if(option === "all") {
                selectAllChunks()
            }
            setSelectChunksOption(option)
        }
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

    function submitVote(){
        // check that at least one chunk is selected
        if (selectedNfts.length !== 0) {

            // check that at least one feild is selected
            if (selectedOption !== "none") {
                let metadata = {
                    chunks: selectedNfts.map(nft => { return nft.unit.substring(57) }),
                    proposalID: proposal.id,
                    option: selectedOption
                }
                console.log({"77223002":metadata})
                writeToBlockchain(selectedNfts, {"77223002":metadata})
            }
            else { doAlert(1, "Must Chose an option", 10) }
        } 
        else {doAlert(1, "Must select at least one chunk to vote", 10)}
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
                    
                    <VoteForm>
                        <h4>Result</h4>
                        <PanelRow style={{justifyContent: "space-between", width: "400px"}}>
                            <div>
                                <TableHeader>Option</TableHeader>
                                <p>Approved</p>
                                <p>Declined</p>
                            </div>
                            <div>
                                <TableHeader>Power</TableHeader>
                                <p>{proposal.result.approved}</p>
                                <p>0</p>
                            </div>
                        </PanelRow>
                    </VoteForm>
                    

                    {proposal.status === "voting" && 
                        <VoteForm>
                            <h4>Vote</h4>
                            <p>1. select Chunks (one chunk = one voting power)</p>
                            {/* <PanelRow>
                                <Option isActive={selectChunksOption === "all"} onClick={() => {handleChoseOption("all")}}>All Chunks</Option>
                                <Option isActive={selectChunksOption === "specific"} onClick={() => {handleChoseOption("specific")}}>Specific Chunks</Option> */}
                                <p>{selectedNfts.length+" chunks selected"}</p>
                            {/* </PanelRow> */}
                            {/* {selectChunksOption === "specific" &&  */}
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
                            {/* } */}
                            <p>2. Chose an option</p>
                            <PanelRow>
                                <Option isActive={selectedOption === "approve"} onClick={() => {setSelectedOption('approve')}}>Approve</Option>
                                <Option isActive={selectedOption === "refuse"} onClick={() => {setSelectedOption('refuse')}}>Decline</Option>
                            </PanelRow>
                            <p>3. Submit the vote</p>
                            <Option style={{textAlign: "center"}} onClick={submitVote}>Submit</Option>
                        </VoteForm>
                    }
                </div>
            }
        </Panel>
    )
}
export default ProposalContainer
