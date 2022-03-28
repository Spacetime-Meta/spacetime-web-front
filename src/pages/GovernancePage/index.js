import React, { useState, useEffect } from 'react'
import styled from "styled-components";

import { PageTitle } from "../../components/sharedComponents/TitleComponents"

import { GovernanceInfoPanel } from "./GovernancePageComponents/GovernanceInfoPanel"
import { GovernanceProposalsPanel } from "./GovernancePageComponents/GovernanceProposalsPanel"

const PageWrapper = styled.div`
    padding: 25px;
`

function GovernancePage ({ nfts, getBalance, writeToBlockchain, doAlert }) {

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
                setTimeout(() => {
                    setProposals(tempProposals)
                }, 1000);
            })  
    }, [])

    return (
        <PageWrapper>
            <PageTitle>Governance</PageTitle>
            <GovernanceInfoPanel 
                nfts={nfts}
                getBalance={getBalance}
            />
            <div style={{height: "25px"}} />
            <GovernanceProposalsPanel 
                proposals={proposals} 
                nfts={nfts}
                writeToBlockchain={writeToBlockchain}
                doAlert={doAlert}
            />
            
        </PageWrapper>
    )
}
export default GovernancePage;
