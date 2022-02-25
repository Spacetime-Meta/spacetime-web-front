import { Box as RebassBox } from 'rebass'
import styled from 'styled-components'

const Panel = styled.div`
    position: relative;
    background-color: rgba(0,0,0,0.1);
    padding: 1.25rem;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.lightGray};
    
`;

export default Panel