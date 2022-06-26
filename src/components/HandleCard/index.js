import React, { useState } from "react";
import styled from "styled-components";

const HandleDisplay = styled.div`
    width: 170px;
    height: 170px;
    justify-self: center;
    text-align: center;
    margin: 5px;
    padding: 5px;
    border-radius: 8px;
    border: 5px solid ${({ theme, isActive }) => (isActive ? "#00ff00" : theme.colors.lightGrayHover)};
    cursor: pointer;
    background: ${({ isActive }) => (isActive ? "rgba(11, 64, 7, 0.43)" : "")};
`

const HandleGif = styled.img`
    width: 150px;
    border-radius: 8px;
    margin: 5px;
`

function HandleCard ({ nft, updateSelection, isActive }) {

    function handleOnClick () {
        updateSelection({unit: nft.policy+"."+nft.name, quantity: "1"})
    }

    return (
        <HandleDisplay 
            isActive={isActive}
            onClick={handleOnClick}
        >
            <HandleGif src={"https://ipfs.io/ipfs/"+nft.metadata.onchain_metadata.image.substring(7)} />
        </HandleDisplay>
    )
}
export default HandleCard