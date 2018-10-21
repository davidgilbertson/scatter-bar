import styled from 'styled-components';
import { COLORS } from '../global.styles';

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 30px;
  background: ${COLORS.BLUE__900};
`;

export const Title = styled.h1`
  font-size: 30px;
  font-weight: 300;
  color: white;
`;

export const Select = styled.select`
  padding: 8px 16px;
  background: ${COLORS.BLUE__100};
  border: none;
  border-radius: 4px;
`;

export const Option = styled.option`
  opacity: 0.5;
  background: white;
  padding: 5px;
`;

export const Page = styled.div`
  padding: 40px 10px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (min-width: 900px) {
    padding-left: 20px;
    padding-right: 20px;
  }
  
  @media (min-width: 1200px) {
    padding-left: 40px;
    padding-right: 40px;
  }
`;
