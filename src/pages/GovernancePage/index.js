import React, { useState } from 'react'
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
                <GovernanceProposalsPanel />
            )}
            {activeTab === "vote" && (
                <GovernanceVotePanel />
            )}
            
        </PageWrapper>
    )
}
export default GovernancePage;
