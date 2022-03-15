import React, { useState } from "react";
import styled from "styled-components";
import { default as pageTop } from '../../assets/pageTop.svg';

import { MdKeyboardArrowRight, MdArrowForward } from 'react-icons/md';

const HeroWrapper = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 30px;
    min-height: calc(100vh - ${({ theme }) => theme.dimentions.nav.height});
    color: white;
    z-index: 1;
`
const HeroBg = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;

    :before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: 
        linear-gradient(
            180deg,
            rgba( 0, 0, 0, 0.2) 0%,
            rgba( 0, 0, 0, 0.6) 100%
        ),
        linear-gradient(
            180deg,
            rgba( 0, 0, 0, 0.2) 0%,
            transparent 100%
        );
    }
`;

const ImgBg = styled.img`
    width: 100%;
    height: 100%;
    -o-object-fix: cover;
    object-fit: cover;
`;

const HeroH1 = styled.h1`
    font-size: 48px;
    text-align: center;

    @media screen and (max-width: 768px) {
        font-size: 40px;
    }

    @media screen and (max-witdh: 480px) {
        font-size: 32px
    }
`;

const HeroP = styled.p`
    margin-top: 24px;
    font-size: 24px;
    text-align: center;
    max-width: 800px;

    @media screen and (max-width: 768px) {
        font-size: 24px;
    }

    @media screen and (max-width: 480px) {
        font-size: 18px;
    }
`;

const HeroContent = styled.div`
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const HeroSmall = styled.small`
    margin-top: 25px;

    @media screen and (max-width: 768px) {
        font-size: 50%;
    }
`;

const HeroAddr = styled.small`
    margin-top: 10px;
    border: 1px solid ${({ theme }) => theme.colors.hover};
    border-radius: 10px;
    padding: 10px;

    @media screen and (max-width: 1080px) {
        font-size: 75%;
    }
`

const HeroBtnWraper = styled.div`
    margin-top: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const HeroBtn = styled.a`
    border-radius: 50px;
    background: ${({ theme }) => theme.colors.hover};
    padding: 10px 32px;
    font-size: 16px;
    text-decoration: none;
    color: black;
    display: flex;
    justify-content: center;
    align-items: center;

    :hover {
        background: #fff;
    }
`;

const ArrowForward = styled(MdArrowForward)`
    margin-left: 8px;
    font-size: 20px;
`;

const ArrowRight = styled(MdKeyboardArrowRight)`
    margin-left: 8px;
    font-size: 20px;
`;

function HeroSection () {

    const [hover, setHover] = useState(false);
    const onHover = () => { setHover(!hover) };

    return (
        <>
            <HeroBg> 
                <ImgBg src={pageTop} type='img/svg' />
            </HeroBg>
            <HeroWrapper>
                <HeroContent>
                    <HeroH1>Spacetime Metaverse</HeroH1>
                    <HeroP>Why limit our metaverse to a single city or planet? Let's take an empty space and create a whole universe!</HeroP>
                    <HeroBtnWraper>
                        <HeroBtn 
                            href={'https://discord.gg/wtRMBXw2bd'} 
                            target={'_blank'}
                            onMouseEnter={onHover}
                            onMouseLeave={onHover}
                        >
                            Join Community {hover ? <ArrowForward /> : <ArrowRight />}
                        </HeroBtn>
                    </HeroBtnWraper>
                </HeroContent>
            </HeroWrapper>
        </>
    )
}

export default HeroSection