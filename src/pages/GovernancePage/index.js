import React, { useState, useEffect } from 'react'
import styled from "styled-components";

import { PageTitle } from "../../components/sharedComponents/TitleComponents"
import { Tabs, Tab } from "../../components/sharedComponents/Panels"

import { GovernanceInfoPanel } from "./GovernancePageComponents/GovernanceInfoPanel"
import { GovernanceProposalsPanel } from "./GovernancePageComponents/GovernanceProposalsPanel"
import { GovernanceVotePanel } from "./GovernancePageComponents/GovernanceVotePanel"

const PageWrapper = styled.div`
    padding: 25px;
`

function GovernancePage ({ nfts, getBalance }) {

    const [activeTab, setActiveTab] = useState("proposals");
    const [proposals, setProposals] = useState([])

    useEffect(() => {
        var tempProposals = []
        fetch("https://raw.githubusercontent.com/Spacetime-Meta/spacetime-proposals/main/proposalsData.json")
            .then(response => { return response.json() })
            .then(jsondata => { 
                
                for(var i=0; i<jsondata.amount; i++){
                    fetch("https://raw.githubusercontent.com/Spacetime-Meta/spacetime-proposals/main/P"+(i+1)+".json")
                        .then(response => { return response.json() })
                        .then(proposaldata => { tempProposals.push(proposaldata) })
                }

                setProposals(tempProposals)
            })
    }, [])
    

    function handleTabClick (tab) {
        if(tab != activeTab){
            setActiveTab(tab)
        }
    }

    return (
        <PageWrapper>
            <PageTitle>Governance</PageTitle>
            <GovernanceInfoPanel 
                nfts={nfts}
                getBalance={getBalance}
            />
            <div style={{height: "25px"}} />
            <Tabs>
                <Tab 
                    active={activeTab === "proposals"}
                    onClick={() => {handleTabClick("proposals")}}
                >
                    Proposals
                </Tab>
                <Tab 
                    active={activeTab === "vote"}
                    onClick={() => {handleTabClick("vote")}}
                >
                    Vote
                </Tab>
            </Tabs>
            {activeTab === "proposals" && (
                <GovernanceProposalsPanel proposals={proposals}/>
            )}
            {activeTab === "vote" && (
                <GovernanceVotePanel />
            )}
            
        </PageWrapper>
    )
}
export default GovernancePage;
