import React, { useState, useEffect } from 'react'
import styled from "styled-components";

import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { PageTitle } from "../../components/sharedComponents/TitleComponents"
import { Panel } from "../../components/sharedComponents/Panels"

import { default as Logo } from '../../assets/logoChunk.png';

const PageWrapper = styled.div`
    padding: 25px;
`

const PageLayout = styled.div`
    display: grid;
    column-gap: 25px;
    row-gap: 100px;
    grid-template-columns: repeat(2, 1fr);

    @media screen and (max-width: 768px) {
        grid-template-columns: repeat(1, 1fr);
    }
`

const EpochWrapper = styled.div`
    justify-self: center;
    width: 75%;
`

const InforRow = styled.tr`
    width: 100%;
    height: 20%;
`

const ChunkImg = styled.img`
    height: 50px;
    width: 50px;
    border-radius: 50%;
`

function SupplyInfoPage () {
    
    const [tiers, setTiers] = useState();
    const [percentage, setPercentage] = useState(0);

    useEffect(() => { 
        async function loadTierCount () {
            async function fetchGraphQL(operationsDoc, operationName) {
                console.log('getting data')
                const result = await fetch(
                "https://balanced-bulldog-49.hasura.app/v1/graphql",
                {
                    method: "POST",
                    body: JSON.stringify({
                        query: operationsDoc,
                        variables: {},
                        operationName: operationName
                    })
                }
                );
                return await result.json();
            }
            
            const operationsDoc = `
                query MyQuery {
                    tierCount (order_by: {id: asc}) {
                        amount
                        tier
                        src
                    }
                }
            `;
            
            function fetchMyQuery() {
                
                return fetchGraphQL(
                    operationsDoc,
                    "MyQuery"
                );
            }
            
            async function startFetchMyQuery() {
                
                const { errors, data } = await fetchMyQuery();
            
                if (errors) {
                    // handle those errors like a pro
                    console.error(errors);
                }
            
                // do something great with this precious data
                console.log(data);
                setTiers(data.tierCount)
                setPercentage((data.tierCount[0].amount - 400) / 100 * 100)
            }
            startFetchMyQuery();
        }
        loadTierCount()
    }, [])



    return (
        <PageWrapper>
            <PageTitle>Supply Info</PageTitle>
            <PageLayout>
                <Panel>
                    <table style={{height: "100%"}}>
                        <tbody>
                            {tiers ? tiers.map(tier => {
                                return (
                                    <InforRow key={Math.random()}>
                                        <td>
                                            <ChunkImg src={"https://ipfs.io/ipfs/"+tier.src} alt={tier.tier} />
                                        </td>
                                        <td>{tier.tier}</td>
                                        <td style={{textAlign: "right", fontSize: "150%"}}>{tier.amount}</td>
                                    </InforRow>
                                )
                            }):<></>}
                        </tbody>
                    </table>
                </Panel>
                <EpochWrapper>
                    <CircularProgressbarWithChildren 
                        value={percentage}
                        strokeWidth={2}
                        styles={{
                            path: {
                                stroke:  "#078A8C"
                              }
                        }}
                    >
                        <img style={{ width: "50%", paddingBottom: "10px" }} src={Logo} alt="Spacetime" />
                        <div style={{ fontSize: 24}}>Epoch 2</div>
                        <div style={{ fontSize: 12 }}>
                            <strong>{`${percentage}%`}</strong> complete
                        </div>
                    </CircularProgressbarWithChildren>
                </EpochWrapper>
            </PageLayout>
        </PageWrapper>
    )
}
export default SupplyInfoPage;