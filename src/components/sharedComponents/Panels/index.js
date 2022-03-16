import styled from "styled-components";

export const Panel = styled.div`
    position: relative;
    background-color: rgba(0,0,0,0.1);
    padding: 1.25rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.lightGrayHover};
`;

export const Tabs = styled.div`
    display: flex;
    flex-direction: row;
    padding-left: 0.75rem;
`

export const Tab = styled.div`
    background-color: rgba(0,0,0,0.1);
    padding: 0.75rem;
    border: 1px solid ${({ theme, active }) => active ? theme.colors.hover : theme.colors.lightGrayHover};
    border-bottom: none;
    border-radius: 10px 10px 0 0;
    cursor: pointer;
    color: ${({ theme, active }) => active ? theme.colors.hover : "white" };

    :hover {
        color: ${({ theme }) => theme.colors.hover};
        border: 1px solid ${({ theme }) => theme.colors.hover};
        border-bottom: none;
    }
`