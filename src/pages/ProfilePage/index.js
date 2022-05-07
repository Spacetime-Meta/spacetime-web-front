import React, { useEffect, useState } from "react";
import styled from "styled-components";

import HandleCard from "../../components/HandleCard"
import { PageTitle, PanelTitle } from "../../components/sharedComponents/TitleComponents"
import { Panel } from "../../components/sharedComponents/Panels"
import { AiOutlineSetting } from "react-icons/ai"

const PageWrapper = styled.div`
    padding: 25px;
`

const GridRow = styled.div`
    display: ${({ isCustomActive }) => isCustomActive ? "grid" : "block"};
    grid-template-areas: 'col1 col2';
    grid-template-columns: repeat(2, 1fr);
    column-gap: 1.25em;

    @media screen and (max-width: 768px) {
        grid-template-columns: repeat(1, 1fr);
        grid-template-areas: 'col1' 'col2';
    }
`

const Column1 = styled.div`
    grid-area: col1;
    padding: 50px 0px;
`;

const Column2 = styled.div`
    grid-area: col2;
    padding: 50px 0px;
`;

const CardDisplay = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);

    @media screen and (max-width: 1550px) {
        grid-template-columns: repeat(3, 1fr);
    }

    @media screen and (max-width: 1400px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media screen and (max-width: 768px) {
        grid-template-columns: repeat(3, 1fr);
    }

    @media screen and (max-width: 650px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media screen and (max-width: 468px) {
        grid-template-columns: repeat(1, 1fr);
    }
`

const FormField = styled.input`
    margin-bottom: 10px;
`

const ImageWrapper = styled.div`
    margin-top: 25px;
    display: flex;
    justify-content: center;
`

const ProfileImage = styled.img`
    border-radius: 50%;
    width: 150px;
    height: 150px;
    border: 2px solid grey;
    object-fit: cover;
`

const ProfileName = styled.div`
    margin-top: 25px;
    width: 100%;
    text-align: center;
`

const Button = styled.button`
    width: 150px;
    background: ${({ theme }) => theme.colors.hover};
    border: none;
    border-radius: 5px;
    padding: 3px;
    margin-bottom: 5px;
    cursor: pointer;

    &:hover {
        background: #046666;
    }
`

function ProfilePage ({ nfts, writeToBlockchain, doAlert }) {

    const [isCustomActive, setIsCustomActive] = useState(false);
    const toggleCustom = () => {setIsCustomActive(!isCustomActive)}
    let metadata = {};

    const [isLoaded, setIsLoaded] = useState(false)
    useEffect(() => {
        if(nfts.length > 0){ setIsLoaded(true) }
    },[nfts])

    const [selectedProfile, setSelectedProfile] = useState({unit:"."})
    const [selectedHandle, setSelectedHandle] = useState("")
    const [profileName, setProfileName] = useState("Default Name")
    const [imgSrc, setImgSrc] = useState("./images/Default_pfp.jpg")
    const [imgHash, setImgHash] = useState("QmYBiVERgNwLUEbnmaBGWqLvXiZS2EQiVEseJdnM2466yK")

    function updateSelection (nft) {
        setSelectedProfile(nft);   
    }
    useEffect(() => {
        setProfileName("Default Name")
        setImgSrc("./images/Default_pfp.jpg")
        
        if(selectedProfile.unit !== "."){
            setSelectedHandle('$'+selectedProfile.unit.substring(selectedProfile.unit.indexOf('.')+1))

            // load the profile here

        }
    },[selectedProfile])

    function preview() {
        const picSrc = document.getElementById("profile-pic-input").value
        const name = document.getElementById("profile-name-input").value
        if(picSrc !== ""){ 
            setImgSrc("https://ipfs.io/ipfs/"+picSrc) 
            setImgHash(picSrc)
        }
        if(name !== ""){ setProfileName(name) }
    }
    
    function handleSubmit(){
        preview();

        // check that at least one handle is selected
        if (selectedProfile.unit !== ".") {
            
            metadata = { 
                handle: '$'+selectedProfile.unit.substring(57),
                name: profileName,
                image: imgHash
            }
            
            writeToBlockchain([selectedProfile], {"77223003": metadata})

        }
        else {doAlert(1, "Must select at least one $handle to customize", 10)}
    }

    return (
        <PageWrapper>
            <PageTitle>Profiles</PageTitle>
            <Panel>
                <PanelTitle>Your metaverse profiles</PanelTitle>
                <CardDisplay>
                    {isLoaded ? nfts.map((nft) => {
                        if(nft.policy === "f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a") {
                            return (
                                <HandleCard 
                                    key={nft.name}
                                    nft={nft}
                                    updateSelection={updateSelection}
                                    isActive={nft.name === selectedProfile.unit.substring(selectedProfile.unit.indexOf('.')+1)}
                                />
                            )
                        }
                    }) :
                        <p>loading wallet ...</p>
                    }
                </CardDisplay>
            </Panel>
            <GridRow isCustomActive={isCustomActive}>
                <Column1>
                    <Panel>
                        <div style={{display: "flex", flexDirection:"row", justifyContent:"space-between"}}>
                            <PanelTitle style={{display: "flex", flexDirection:"row", alignItems: "end"}}>
                                Selected Profile:
                                <div style={{color: "#078A8C", fontSize: "small", paddingLeft: "5px"}}> 
                                    {selectedHandle}
                                </div>
                            </PanelTitle>
                            <div onClick={toggleCustom} style={{cursor: "pointer"}}>
                                <AiOutlineSetting />
                            </div>
                        </div>
                        <ImageWrapper>
                            <ProfileImage id="profile-pic" src={imgSrc}/>
                        </ImageWrapper>
                        <ProfileName id="profile-name">
                            {profileName}
                        </ProfileName>
                    </Panel>
                </Column1>
                {isCustomActive && 
                    <Column2>
                        <Panel>
                            <PanelTitle>Customize your profile</PanelTitle>
                            <h5>Name</h5>
                            <FormField id="profile-name-input" />

                            <h5>Profile Picture</h5>
                            <small>This should be an IPFS hash starting with Qm..</small>
                            <FormField id="profile-pic-input" />
                            <Button onClick={preview}>
                                preview
                            </Button>
                            <Button onClick={handleSubmit}>
                                submit
                            </Button>
                        </Panel>
                    </Column2>
                }
            </GridRow>
        </PageWrapper>
    )
}
export default ProfilePage;