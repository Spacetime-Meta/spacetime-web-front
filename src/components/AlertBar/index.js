import React from "react";
import styled from "styled-components";

const AlertBarWrapper = styled.div`
    width: 100%;
    height: 10vh;
    position: sticky;
    display: flex;
    justify-content: center;
    align-items: center;
    color: black;
    font-size: large;
    top: 0;
    left: 0;
    background: ${({ gravity }) => (gravity === 1 ? "#ff0000" : "#00ff00")};
    z-index: 1000;
`

function AlertBar ({ message, gravity }) {
    return (
        <AlertBarWrapper gravity={gravity}>
            {message}
        </AlertBarWrapper>
    )
}
export default AlertBar