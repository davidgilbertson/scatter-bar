import styled from 'styled-components';
import { COLORS } from '../global.styles';

const Button = styled.button`
  background: ${COLORS.BLUE__500};
  border: none;
  padding: 10px 20px;
  color: white;
  text-transform: uppercase;
  line-height: 1;
  
  &[disabled] {
    background: ${COLORS.GREY__200};
    color: ${COLORS.GREY__050};
  }
`;

export default Button;
