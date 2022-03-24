import React from 'react'
import styled from "styled-components";

import { PanelTitle } from "../../../components/sharedComponents/TitleComponents"
import { Panel } from "../../../components/sharedComponents/Panels"
import ProposalContainer from "./ProposalContainer.js"

export const GovernanceProposalsPanel = ({ proposals, nfts }) => {

    return (
        <Panel>
            <PanelTitle>Proposals</PanelTitle>
            {proposals.map((proposal) => {
                return (
                    <ProposalContainer 
                        proposal={proposal}
                        nfts={nfts} 
                        key={Math.random()}
                    />
                )
            })}
        </Panel>
    )
}
