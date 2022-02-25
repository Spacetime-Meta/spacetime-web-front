import React from 'react';
import styled from 'styled-components';

// react-icons at https://react-icons.github.io/react-icons
import { FaDiscord, FaTelegram, FaGithub, FaTwitter } from 'react-icons/fa';
import { GiTwoCoins } from 'react-icons/gi';

const SocialLinksWrapper = styled.div`
    display: flex;
    justify-content: space-around;
    
`;

const Link = styled.a`
    color: ${({ theme }) => theme.colors.main};
    
    :hover {
        color: ${({ theme }) => theme.colors.hover};
    }
`;

const SocialLinks = () => {
    return (
        <SocialLinksWrapper>
            <Link href={'https://discord.gg/wtRMBXw2bd'} target={'_blank'} rel={'noopener noreferrer'}>
                <FaDiscord />
            </Link>
            <Link href={'https://t.me/spacetimemeta'} target={'_blank'} rel={'noopener noreferrer'}>
                <FaTelegram />
            </Link>
            <Link href={'https://twitter.com/Spacetime_Meta'} target={'_blank'} rel={'noopener noreferrer'}>
                <FaTwitter />
            </Link>
            <Link href={'https://github.com/Spacetime-Meta'} target={'_blank'} rel={'noopener noreferrer'}>
                <FaGithub />
            </Link>
        </SocialLinksWrapper>
    )
}

export default SocialLinks
