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