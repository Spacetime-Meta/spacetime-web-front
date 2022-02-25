import React, { useState } from "react";
import styled from "styled-components";

const ChunkDisplay = styled.div`
    width: 150px;
    height: 200px;
    justify-self: center;
    text-align: center;
    margin: 5px;
    padding: 5px;
    border-radius: 8px;
    border: 5px solid ${({ theme, isActive }) => (isActive ? "#00ff00" : theme.colors.lightGrayHover)};
    cursor: pointer;
    background: ${({ isActive }) => (isActive ? "rgba(11, 64, 7, 0.43)" : "")};
`

const ChunkGif = styled.img`
    width: 150px;
    border-radius: 8px;
    margin-top: 5px;
`

function ChunkCard ({ nft, updateSelection }) {
    
    const [isActive, setIsActive] = useState(false)

    function handleOnClick () {
        setIsActive(!isActive)
        updateSelection({unit: nft.policy+"."+nft.name, quantity: "1"})
    }

    return (
        <ChunkDisplay 
            isActive={isActive}
            onClick={handleOnClick}
        >
            <p>{nft.metadata.onchain_metadata.name}</p>
            <ChunkGif src={"https://ipfs.io/ipfs/"+nft.metadata.onchain_metadata.image.substring(7)} />
        </ChunkDisplay>
    )
}
export default ChunkCard