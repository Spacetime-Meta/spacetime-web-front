import React from 'react';
import styled from 'styled-components';

const ConnectWrapper = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: ${({ theme }) => theme.colors.main};
    font-size: 12px;
`;

const ConnectButton = styled.div`
    width: 50%;
    max-width: 150px;
    margin: auto;
    text-align: center;
    padding: 10px;
    border: 1px solid ${({ theme }) => theme.colors.main};
    cursor: pointer;

    :hover {
        border: 3px solid ${({ theme }) => theme.colors.hover};
        color: ${({ theme }) => theme.colors.hover};
    }
`;

const ConnectNami = ({ connected, connect }) => {

    function handleClick () {
        if(connected){ console.log('already connected to nami') }
        else { connect() }
    }

    return (
        <ConnectWrapper>
            <ConnectButton onClick={handleClick}>
                {connected ? 'Connected' : 'Connect Nami'}
            </ConnectButton>
        </ConnectWrapper>
    )
}

export default ConnectNami
