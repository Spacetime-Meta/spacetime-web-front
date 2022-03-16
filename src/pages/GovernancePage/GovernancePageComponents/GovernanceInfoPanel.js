import React, { useState, useEffect } from 'react'
import styled from "styled-components";

import { PanelTitle } from "../../../components/sharedComponents/TitleComponents"
import { Panel } from "../../../components/sharedComponents/Panels"

import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const PanelLayout = styled.div`
    display: grid;
    column-gap: 25px;
    row-gap: 100px;
    grid-template-columns: repeat(2, 1fr);

    @media screen and (max-width: 768px) {
        grid-template-columns: repeat(1, 1fr);
    }
`

const InfoList = styled.ul`
    margin-left: 25px;
`

const ListItem = styled.li`
    padding-bottom: 10px;
`

export const GovernanceInfoPanel = ({ nfts, getBalance }) => {

    const [votingPower, setVotingPower] = useState()
    const [isLoaded, setIsLoaded] = useState(false)
    useEffect(() => {
        if(nfts.length > 0){ 
            setIsLoaded(true)
            var vp = 0
            nfts.forEach(nft => {
                if(nft.policy === "7652a254a5691f32203c093fcbd74193447c8724cadaf5e7402cf33b"){
                    vp += 1;
                }
            })
            setVotingPower(vp) 
        }
    },[nfts])

    function loadVotingPower() {
        getBalance()
    }

    return (
        <>
            <PanelLayout>
                <div>
                    <PanelTitle style={{marginLeft: "25px"}}>Info</PanelTitle>
                    <InfoList>
                        <ListItem>Each chunk can vote once. If you submit  chunk more than once, only the last vote will count</ListItem>
                        <ListItem>Sending a chunk does not reset its vote. When buying a chunk, you should update its vote</ListItem>
                        <ListItem>One address can vote with multiple chunks. One chunk equals one voting power.</ListItem>
                    </InfoList>
                </div>
                <div>
                    <PanelTitle style={{textAlign: "center"}}>Voting Power</PanelTitle>
                    <div style={{width: "100%", textAlign: "center"}}>
                        {isLoaded ? 
                            <div style={{fontSize: "6em", fontWeight: "bold"}}>{votingPower}</div>
                        :
                            <button style={{marginTop: "25px"}}
                                    onClick={loadVotingPower}>
                                load voting power
                            </button>
                        }
                    </div>
                    
                </div>
            </PanelLayout>
        </>
    )
}
