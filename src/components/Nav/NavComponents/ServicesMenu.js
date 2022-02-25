import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

// react icons
import { AiOutlineHome } from 'react-icons/ai';
import { GiSwapBag } from 'react-icons/gi';
import { BiPlanet } from 'react-icons/bi';
import { BsPinMap } from 'react-icons/bs'

// Components
import { ServiceRouterLink } from '../../Links'

const ServicesMenuWrapper = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const ServicesMenu = ({ toggleIsMobileNavActive }) => {
    return (
        <ServicesMenuWrapper>
            <ServiceRouterLink 
                to={'/home'}
                onClick={toggleIsMobileNavActive}
            >
                <AiOutlineHome /> HOME
            </ServiceRouterLink>
            <ServiceRouterLink 
                to={'/upload'}
                onClick={toggleIsMobileNavActive}
            >
                <BiPlanet /> CUSTOMIZE
            </ServiceRouterLink>
            <ServiceRouterLink
                to={'/map'}
                onClick={toggleIsMobileNavActive}
            >
                <BsPinMap /> MAP
            </ServiceRouterLink>
        </ServicesMenuWrapper>
    )
}

export default withRouter(ServicesMenu);
