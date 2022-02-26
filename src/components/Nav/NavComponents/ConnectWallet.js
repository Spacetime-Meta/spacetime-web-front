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

const ConnectWallet = ({ connected, connect, connectedWallet }) => {
    function handleClick (walletName) {
        if(connected){ console.log('already connected') }
        else { connect(walletName) }
    }

    return (
        <ConnectWrapper>
            {connected ? 
                <>
                    <ConnectButton>
                        Connected to {connectedWallet}
                    </ConnectButton>
                </>
                :
                <>
                    <ConnectButton onClick={() => handleClick('nami')}>
                        Connect Nami
                    </ConnectButton>
                    <ConnectButton onClick={() => handleClick('ccvault')}>
                        Connect CCVault
                    </ConnectButton>
                </>
            }
            
        </ConnectWrapper>
    )
}

export default ConnectWallet
