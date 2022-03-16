import React from 'react'

import styled from "styled-components";

import { PanelTitle } from "../../../components/sharedComponents/TitleComponents"
import { Panel } from "../../../components/sharedComponents/Panels"

export const GovernanceProposalsPanel = () => {
    return (
        <Panel>
            <PanelTitle>Proposals</PanelTitle>
            <div style={{height: "100px", width: "100%", textAlign: "center", marginTop: "100px"}}>
                There is no active proposal
            </div>
        </Panel>
    )
}
