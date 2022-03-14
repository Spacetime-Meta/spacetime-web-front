import React, { useState } from 'react'
import styled from "styled-components";

import { PageTitle } from "../../components/sharedComponents/TitleComponents"
import { Panel, Tabs, Tab } from "../../components/sharedComponents/Panels"

import { GovernanceInfoPanel } from "./GovernancePageComponents/GovernanceInfoPanel"
import { GovernanceProposalsPanel } from "./GovernancePageComponents/GovernanceProposalsPanel"
import { GovernanceVotePanel } from "./GovernancePageComponents/GovernanceVotePanel"

const PageWrapper = styled.div`
    padding: 25px;
`

function GovernancePage () {

    const [activeTab, setActiveTab] = useState("info");

    function handleTabClick (tab) {
        if(tab != activeTab){
            setActiveTab(tab)
        }
    }

    return (
        <PageWrapper>
            <PageTitle>Governance</PageTitle>
            <Tabs>
                <Tab 
                    active={activeTab === "info"}
                    onClick={() => {handleTabClick("info")}}
                >
                    Info
                </Tab>
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
            <Panel>
                {activeTab === "info" && (
                    <GovernanceInfoPanel />
                )}
                {activeTab === "proposals" && (
                    <GovernanceProposalsPanel />
                )}
                {activeTab === "vote" && (
                    <GovernanceVotePanel />
                )}
            </Panel>
        </PageWrapper>
    )
}
export default GovernancePage;
