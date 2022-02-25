import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';

export const ServiceRouterLink = styled(RouterLink)`
    padding-left: 22%;
    text-decoration: none;
    font-size: 18px;
    line-height: 36px;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.lightGray};

    :hover {
        color: ${({ theme }) => theme.colors.lightGrayHover};
    }
`;