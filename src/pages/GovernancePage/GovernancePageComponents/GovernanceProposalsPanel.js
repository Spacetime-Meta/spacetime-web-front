import React from 'react'
import styled from "styled-components";

import { PanelTitle } from "../../../components/sharedComponents/TitleComponents"
import { Panel } from "../../../components/sharedComponents/Panels"
import ProposalContainer from "./ProposalContainer.js"

export const GovernanceProposalsPanel = ({ proposals, nfts, writeToBlockchain, doAlert }) => {

    return (
        <Panel>
            <PanelTitle>Proposals</PanelTitle>
            {proposals.map((proposal) => {
                return (
                    <ProposalContainer 
                        proposal={proposal}
                        nfts={nfts}
                        writeToBlockchain={writeToBlockchain}
                        doAlert={doAlert}
                        key={Math.random()}
                    />
                )
            })}
        </Panel>
    )
}
