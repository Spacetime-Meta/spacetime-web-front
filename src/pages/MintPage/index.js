import React from 'react'
import styled from "styled-components";

import { PageTitle } from "../../components/sharedComponents/TitleComponents"
import { Panel } from "../../components/sharedComponents/Panels"

const PageWrapper = styled.div`
    padding: 25px;
`

const PanelTitle = styled.h3`
    margin-right: 10px;
`

const PanelRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`

const IsOpen = styled.div`
    color: lime;
    margin-left: 3px;
`

const IsClosed = styled.div`
    color: red;
    margin-left: 3px;
`

const IsHalted = styled.div`
    color: yellow;
    margin-left: 3px;
`

const Addr = styled.small`
    margin-top: 10px;
    border: 1px solid ${({ theme }) => theme.colors.hover};
    border-radius: 10px;
    padding: 10px;
    cursor: pointer;

    :hover {
        background: #033f3f;
    }

    @media screen and (max-width: 1080px) {
        font-size: 75%;
    }
`

const MintPrice = styled.div`
    font-weight: bold;
    font-size: 2em;
`

function MintPage({ doAlert }) {

    async function handleCopy(text) {
        navigator.clipboard.writeText(text)
        doAlert(2, text+" - Copied to clipboard", 5)
    }

    return (
        <PageWrapper>
            <PageTitle>Mint</PageTitle>

            <Panel>
                <PanelRow style={{justifyContent: "space-between"}}>
                    <div>
                        <PanelRow>
                            <PanelTitle>Space Doods</PanelTitle>
                            <div style={{height:"1em", width: "1em", borderRadius: "50%", background: "red"}} />
                            <IsClosed>SOLD OUT</IsClosed>
                            
                        </PanelRow>
                        <div style={{height:"10px"}} />
                        <small 
                            style={{cursor: "pointer"}}
                            onClick={() => handleCopy('97e72e5296224499ca1911e52960a56426b0eebfbc875263547ce240')}>
                                Policy ID: 97e72e5296224499ca1911e52960a56426b0eebfbc875263547ce240
                        </small>
                        <div style={{height:"10px"}} />
                        <div style={{fontSize: "large"}}><b>Supply: 200</b></div>
                    </div>
                    <div>
                        <MintPrice>75 ₳</MintPrice>
                        {/* <small><b>60 ₳</b> If you own a Chunk</small><br/>
                        <small><b>50 ₳</b> If you own a Gold Chunk</small><br/>
                        <small>Join our <b><a href="https://discord.gg/wtRMBXw2bd">Discord</a></b> to learn more</small> */}
                    </div>
                </PanelRow>
                {/* <PanelRow>
                    <Addr onClick={() => handleCopy('$spacedoods')}>
                        $spacedoods
                    </Addr>
                </PanelRow> */}
                {/* <PanelRow>
                    <Addr onClick={() => handleCopy('addr1qx2s3cvdn22hf4yg2fse5m60dwfkz2tv3kjprxclc4cp4qcmq459sd0quqk2wvls07cmszwzzw5evsce7knfewx9gkmsuvfwg4')}>
                        addr1qx2s3cvdn22hf4yg2fse5m60dwfkz2tv3kjprxclc4cp4qcmq459sd0quqk2wvls07cmszwzzw5evsce7knfewx9gkmsuvfwg4
                    </Addr>
                </PanelRow> */}
                <div style={{height:"10px"}} />
                <small>Thank you everyone for your participation! Join our <b><a href="https://discord.gg/wtRMBXw2bd">Discord</a></b> For Space Doods updates.</small>
            </Panel>

            <div style={{height:"25px"}}/>

            <Panel>
                <PanelRow style={{justifyContent: "space-between"}}>
                    <div>
                        <PanelRow>
                            <PanelTitle>Space Chunks</PanelTitle>
                            <div style={{height:"1em", width: "1em", borderRadius: "50%", background: "yellow"}} />
                            <IsHalted>HALTED</IsHalted>
                        </PanelRow>
                        <small>Policy ID: 7652a254a5691f32203c093fcbd74193447c8724cadaf5e7402cf33b</small>
                    </div>
                    <MintPrice>10 ₳</MintPrice>
                </PanelRow>
                <div style={{height:"25px"}}/>
                {/* <PanelRow> */}
                    {/* <Addr onClick={() => handleCopy('$stm')}> */}
                        {/* $stm */}
                    {/* </Addr> */}
                    {/* <div style={{width:"10px"}} /> */}
                    {/* <Addr onClick={() => handleCopy('$spacetimemeta')}> */}
                        {/* $spacetimemeta */}
                    {/* </Addr> */}
                {/* </PanelRow> */}
                <PanelRow>
                    {/* <Addr onClick={() => handleCopy('addr1q9a4ymzhnwfqarvjaqv6mh63qsw0v7apuy4fylcp5yeg0jmdjsy0uz69l5k9qqmmtanftqkt95qv7ykxusdaak8wqr5sc8p00u')}> */}
                        {/* addr1q9a4ymzhnwfqarvjaqv6mh63qsw0v7apuy4fylcp5yeg0jmdjsy0uz69l5k9qqmmtanftqkt95qv7ykxusdaak8wqr5sc8p00u */}
                    {/* </Addr> */}
                    <Addr onClick={() => handleCopy('*******************************************************************************************************')}>
                        ********************************************************
                    </Addr>
                </PanelRow>
                <div style={{height:"25px"}}/>
                {/* <div style={{height:"10px"}} /> */}
                {/* <small>Each chunk is 10 Ada, you can mint up to 30 chunks per transaction. By minting a chunk you will get a random location in the Spacetime Meta.</small> */}
                <small>Space Chunk mint was halted after the <a href={`${window.location.origin}/#/governance`}>community vote #3</a>.</small>
            </Panel>

        </PageWrapper>
    )
}
export default MintPage;
