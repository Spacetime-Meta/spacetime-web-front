import React, { useEffect } from 'react'
import styled from "styled-components";
import { useLocation } from 'react-router-dom';

const MapDisplay = styled.iframe`
    width: 100%;
    height: 100%;
    overflow: hidden;
`

const MapWrapper = styled.div`
    width: 100%;
    height: 100%;
`

function MapPage() {

    const url = new URL(window.location.href)
    
    useEffect(() => {
        let query = new URLSearchParams(url.hash.substring(5))
        const loc = query.get("x")+","+query.get("y")+","+query.get("z")
        setTimeout(() => {
            document.getElementById("map").contentWindow.postMessage(
                JSON.stringify({
                    error: false,
                    message: loc
                }),
                '*'
            );
        }, 1000);
    }, [])

    window.addEventListener("message", (event) => {
        try {
            const data = JSON.parse(event.data)
            if(typeof data.message.link !== "undefined") {
                window.location.href = data.message.link
            }
        } catch (error) {}
    })

    return (
        <MapWrapper>
            <MapDisplay id={"map"} src={url.origin+"/map/map.html"} frameBorder={"0"}/>
        </MapWrapper>
    )
}
export default MapPage;