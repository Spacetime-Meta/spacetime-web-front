import React from "react";
import styled from "styled-components";

const Wrapper = styled.a`
    padding: 10px;
    margin: 10px;
    background: rgba(255,255,255, 0.1);
    text-decoration: none;
    color: white;
    width: 100px;
    height: 150px;
    border-radius: 10px;

    :hover {
        background: rgba(255,255,255, 0.3);
    }
`

const NameDisplay = styled.div`
    text-align: center;
`

const Logo = styled.img`
    width: 90px;
    height: 90px;
    margin: 5px;
`

function PartnerCard ({ name, website, logo }) {
    return (
        <Wrapper href={website}>
            <Logo src={logo} />
            <NameDisplay>{name}</NameDisplay>
        </Wrapper>
    )
}

export default PartnerCard;