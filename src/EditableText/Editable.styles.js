import styled from 'styled-components';
import { COLORS } from '../global.styles';

export const TextArea = styled.textarea`
  width: 100%;
  font-family: inherit;
  font-size: inherit;
  border: none;
`;

export const EditButton = styled.button`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: ${COLORS.GREY__050};
  opacity: 0;
  border: none;
  cursor: pointer;
  transition: 200ms;
`;

export const StaticText = styled.div`
  white-space: pre-line;
  
  &:hover ${EditButton} {
    opacity: 0.9;
  }
`;
