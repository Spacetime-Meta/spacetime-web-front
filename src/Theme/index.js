// react basic imports
import React from "react";
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components";

// instanciate the theme provider
export default function ThemeProvider({ children }) {
    return (
        <StyledComponentsThemeProvider theme={theme()}>
            {children}
        </StyledComponentsThemeProvider>
    );
}

const theme = () => {
    return {
        backgrounds:{
            app: 'linear-gradient(116.82deg, #2C2C2C 18.54%, #000000 63.86%, #2B2B2B 100%);',
            nav: 'rgba(112, 112, 112, 0.51)'
        },
        dimentions:{
            nav: {
                width: "250px",
                height: "50px"
            }
        },
        colors: {
            main: "white",
            hover: "#078A8C",

            lightGray: "#919191",
            lightGrayHover: "#616161",
        }
    }
}