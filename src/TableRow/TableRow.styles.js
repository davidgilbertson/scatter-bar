import styled from 'styled-components';
import { COLORS } from '../global.styles';

export const SetNameWrapper = styled.div`
  position: relative; /* for the edit button */
  display: flex;
  align-items: center;
`;

export const SetName = styled.div`
  flex: auto; /* fill the width for bigger click target */
`;

export const Inputs = styled.form`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
`;

export const Input = styled.input`
  padding: 7px 0;
  font-size: 16px;
  margin-bottom: 8px;
  text-align: center;
  
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const Values = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

export const DeleteValueButton = styled.button`
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${COLORS.RED__500};
  color: white;
  font-size: 14px;
  line-height: 1;
  border: none;
  cursor: pointer;
  transition: 200ms;
`;

export const Value = styled.span`
  position: relative;
  padding: 2px 10px;
  background: ${COLORS.GREY__050};
  border-radius: 3px;
  margin-right: 6px;
  margin-bottom: 3px;
  font-size: 14px;
  
  &:hover ${DeleteValueButton} {
    opacity: 0.9;
  }
`;

export const DeleteWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${COLORS.GREY__600};
  transition: 200ms;
  
  &:hover {
    background: ${COLORS.RED__500};
    color: white;
  }
`;

export const DeleteButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: inherit;
`;
