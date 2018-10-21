import styled from 'styled-components';
import Panel from '../Panel/Panel.styles';
import { COLORS } from '../global.styles';

export const ChartPanel = styled(Panel)`
  padding: 30px 35px 20px 30px;
`;

export const Title = styled.h1`
  font-size: 45px;
  font-weight: 300;
  margin-bottom: 50px;
  text-align: center;
  white-space: pre-line;
`;

export const Body = styled.div`
  display: grid;
  grid: auto / auto 1fr;
`;

export const SetLabel = styled.div`
  grid-column: 1 / 2;
  text-align: right;
  padding: 0 10px;
  align-self: center;
  white-space: pre-line;
`;

export const Bar = styled.div`
  grid-column: 2 / 3;
  position: relative;
  height: 50px;
  border-top: 1px solid ${COLORS.GREY__050};
  overflow: hidden;
`;

export const Scale = styled.div`
  grid-column: 2 / 3;
  height: 20px;
  text-align: center;
  border-top: 2px solid ${COLORS.GREY__100};
  font-size: 20px;
`;

export const ScaleLabelWrapper = styled.div`
  position: relative;
`;

export const ScaleLabel = styled.div`
  position: absolute;
  padding: 5px 0;
  font-size: 12px;
  color: ${COLORS.GREY__600};
  transform: translateX(-50%);
  left: ${props => `${props.left * 100}%`};
  
  &:before {
    content: '';
    position: absolute;
    width: 1px;
    height: 8px;
    top: -2px;
    left: 50%;
    background: ${COLORS.GREY__100};
  }
`;

export const Mark = styled.div`
  position: absolute;
  top: 5px;
  left: ${props => `${props.left * 100}%`};
  bottom: 5px;
  width: 2px;
  background: ${COLORS.BLUE__500};
  filter: blur(1px);
`;
