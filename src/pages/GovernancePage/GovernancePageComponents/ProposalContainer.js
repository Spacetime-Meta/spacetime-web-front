import React, { useState } from 'react'
import styled from "styled-components";

import { Panel } from "../../../components/sharedComponents/Panels"

import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

const PanelRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`

const Arrowwrapper = styled.div`
    font-size: 2em;
    padding-right: 15px;
`

function ProposalContainer() {
    
    const [isActive, setIsActive] = useState(false)

    function handleClick() {
        setIsActive(!isActive)
    }

    return (
        <Panel 
            style={{background: "#033f3f", cursor: "pointer"}}
            onClick={handleClick}
        >
            <PanelRow style={{justifyContent: "space-between"}}>
                <PanelRow>
                    <Arrowwrapper>
                        {isActive ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </Arrowwrapper>
                    <h4>P01 - Change epoch durations and max supply</h4>
                </PanelRow>
                <p>Awaiting vote</p>
            </PanelRow>
            <i>Divide each epoch by 4 and close the mint at the end of epoch 3.</i>
            {isActive && 
                <div style={{paddingTop: "25px"}}>
                    <p>In this proposal, we take care of the length of each epoch and the max supply.</p>
                    <br />
                    <p>The first part is to cut the length of each epoch by 4. We do this by reducing the trigger for the next epoch. For example, the second epoch was supposed to end after reaching 400 new gold chunks instead we stop after reaching 100 new gold chunks. The biggest consequence of this change is to reduce the maximum amount of gold chunks from 1200 to 600.</p>
                    <br />
                    <p>The second part is to stop the mint after the end of epoch 3. This will create a limited maximum supply increasing trading opportunities. We propose the end of epoch 3 because at this point, the Uncommun (gray) chunks will be distributed in a way to give Commun (green) chunks their deserved value, thus rewarding all the green chunks holders.</p>
                </div>
            }
        </Panel>
    )
}
export default ProposalContainer
