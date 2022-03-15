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
                            <PanelTitle>Space Chunks</PanelTitle>
                            <div style={{height:"1em", width: "1em", borderRadius: "50%", background: "lime"}} />
                            <IsOpen>OPEN</IsOpen>
                        </PanelRow>
                        <small>Policy ID: 7652a254a5691f32203c093fcbd74193447c8724cadaf5e7402cf33b</small>
                    </div>
                    <MintPrice>10 ₳</MintPrice>
                </PanelRow>
                <PanelRow>
                    <Addr onClick={() => handleCopy('$stm')}>
                        $stm
                    </Addr>
                    <div style={{width:"10px"}} />
                    <Addr onClick={() => handleCopy('$spacetimemeta')}>
                        $spacetimemeta
                    </Addr>
                </PanelRow>
                <PanelRow>
                    <Addr onClick={() => handleCopy('addr1q9a4ymzhnwfqarvjaqv6mh63qsw0v7apuy4fylcp5yeg0jmdjsy0uz69l5k9qqmmtanftqkt95qv7ykxusdaak8wqr5sc8p00u')}>
                        addr1q9a4ymzhnwfqarvjaqv6mh63qsw0v7apuy4fylcp5yeg0jmdjsy0uz69l5k9qqmmtanftqkt95qv7ykxusdaak8wqr5sc8p00u
                    </Addr>
                </PanelRow>
                <div style={{height:"10px"}} />
                <small>Each chunk is 10 Ada, you can mint up to 30 chunks per transaction. By minting a chunk you will get a random location in the Spacetime Meta.</small>
            </Panel>
        </PageWrapper>
    )
}
export default MintPage;
