import styled from 'styled-components';
import Panel from '../Panel/Panel.styles';
import { COLORS } from '../global.styles';

export const TablePanel = styled(Panel)`
  margin-bottom: 40px;
  background: white;
`;

export const Header = styled.div`
  display: flex;
  padding: 10px;
  align-items: center;
  justify-content: space-between;
`;

export const Title = styled.div`
  position: relative;
  padding: 10px;
  font-size: 20px;
`;

export const DeleteButton = styled.button`
  border: none;
  background: none;
  font-size: 20px;
  color: ${COLORS.GREY__600};
  cursor: pointer;
  transition: 200ms;

  &:hover {
    transform: rotate(90deg);
  }
`;

export const Sets = styled.div`
  display: grid;
  grid: auto / 1fr 120px 2fr 50px;

  & > * {
    border-top: 1px solid ${COLORS.GREY__200};
    min-height: 100%;
    padding: 10px;
  }
`;


export const AddSetWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-top: 1px solid ${COLORS.GREY__200};
`;
