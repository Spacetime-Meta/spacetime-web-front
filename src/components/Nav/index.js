import React, { useState } from "react";
import styled from 'styled-components'
import { useMedia } from 'react-use';

//assets and react-icons 
import { default as FullLogo } from '../../assets/logoName.png';
import { default as SmallLogo } from '../../assets/logoChunk.png';
import { BiMenu } from 'react-icons/bi';

import SocialLinks from './NavComponents/SocialLinks';
import ServicesMenu from './NavComponents/ServicesMenu';
import ConnectNami from './NavComponents/ConnectNami';

// Always displays on the top left corner
const SpacetimeLogo = styled.img`
    position: absolute;
    top: 10px;
    left: 10px;
    width: calc(${({ theme }) => theme.dimentions.nav.width} - 10px);
    height: auto;
`;

// position all the Navs in top corner
const NavWrapper = styled.div`
    position: sticky;
    top: 0px;
    left: 0px;
    z-index: 10;
    background: ${({ theme }) => theme.backgrounds.nav};
`;

// To display when the user is on desktop (screen > 1080px)
const SideNavWrapper = styled.div`
    padding-top: 60px;
    display: grid;
    grid-template-rows: 20px calc(100vh - ${({ theme }) => theme.dimentions.nav.height} - 225px) 60px 25px 80px;
`;

// to display when the user in on mobile (screen < 1080px)
const NavBarWrapper = styled.div`
    height: ${({ theme }) => theme.dimentions.nav.height};
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    content-align: center;
`;

// when (screen < 1080px) always display on top right
const MobileHamburgerMenuWrapper = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    padding: 5px;
    cursor: pointer;
    :hover { color: ${({ theme }) => theme.colors.hover}; }
`;

// display when user on mobile opens the main menu on top right
const MobileNavWrapper = styled.div`
    position: absolute;
    top: ${({ theme }) => theme.dimentions.nav.height};
    right: 0;
    width: 100vw;
    height: calc(100vh - ${({ theme }) => theme.dimentions.nav.height});
    background: rgba(196, 196, 196, 0.01);
    backdrop-filter: blur(100px);
    z-index: 5;
    display: ${({ isActive }) => (isActive ? 'flex' : 'none')};
    justify-content: center;
`;

const MobileNavCenter = styled.div`
    padding-top: 20px;
    display: grid;
    grid-template-rows: 20px calc(100vh - 270px) 60px 25px 80px;
    width: ${({ theme }) => theme.dimentions.nav.width};
`;

function Nav ({ connected, connect }) {
    const below1080 = useMedia("(max-width: 1080px)");

    // for the mobile nav
    const [isMobileNavActive, setIsMobileNavActive] = useState(false);
    const toggleIsMobileNavActive = () => { setIsMobileNavActive(!isMobileNavActive); }

    return (
        <NavWrapper>
            <SpacetimeLogo src={FullLogo} alt={''} type={'img/png'} />
            {below1080 ? (
                <NavBarWrapper>
                    <MobileHamburgerMenuWrapper onClick={toggleIsMobileNavActive}>
                        <BiMenu size={40} />
                    </MobileHamburgerMenuWrapper>
                </NavBarWrapper>
            ):(
                <SideNavWrapper>
                    <SocialLinks />
                    <ServicesMenu 
                        toggleIsMobileNavActive={toggleIsMobileNavActive}
                    />
                    <ConnectNami
                        connected={connected}
                        connect={connect}
                    />
                </SideNavWrapper>
            )}
            {isMobileNavActive && below1080 && (
                <MobileNavWrapper isActive={isMobileNavActive} >
                    <MobileNavCenter>
                        <SocialLinks />
                        <ServicesMenu 
                            toggleIsMobileNavActive={toggleIsMobileNavActive}
                        />
                        <ConnectNami
                            connected={connected}
                            connect={connect}
                        />
                    </MobileNavCenter>
                </MobileNavWrapper>
            )}
        </NavWrapper>
    )

}
export default Nav 