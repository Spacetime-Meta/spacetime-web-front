import React from 'react'
import styled from "styled-components";

import { PanelTitle } from "../../../components/sharedComponents/TitleComponents"
import { Panel } from "../../../components/sharedComponents/Panels"
import ProposalContainer from "./ProposalContainer.js"

export const GovernanceProposalsPanel = () => {
    return (
        <Panel>
            <PanelTitle>Proposals</PanelTitle>
            <ProposalContainer />
        </Panel>
    )
}
