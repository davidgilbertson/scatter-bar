import { createGlobalStyle } from 'styled-components';

export const COLORS = {
  GREY__800: '#37474f',
  GREY__600: '#546e7a',
  GREY__300: '#90a4ae',
  GREY__200: '#b0bec5',
  GREY__100: '#cfd8dc',
  GREY__050: '#eceff1',

  BLUE__900: '#0d47a1',
  BLUE__500: '#2196f3',
  BLUE__100: '#bbdefb',
  RED__500: '#f44336',
};

export const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
  }
  
  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }
  
  body,
  h1,
  h2,
  h3,
  button,
  textarea,
  select,
  option,
  p {
    margin: 0;
    font-size: inherit;
    font-weight: inherit;
    font-family: inherit;
  }
  
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
    color: ${COLORS.GREY__800};
    min-height: 100%;
    background: linear-gradient(150deg, ${COLORS.GREY__050}, ${COLORS.GREY__100}) fixed;
    overflow-y: scroll;
  }
`;
