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

function ProposalContainer({ proposal }) {
    
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
                    <h4>{proposal.id+" - "+proposal.title}</h4>
                </PanelRow>
                <p>{proposal.status}</p>
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
                </div>
            }
        </Panel>
    )
}
export default ProposalContainer
