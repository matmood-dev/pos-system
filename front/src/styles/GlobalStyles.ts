import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: ${props => props.theme.colors.background};
    min-height: 100vh;
    color: ${props => props.theme.colors.text};
    transition: background 0.3s ease, color 0.3s ease;
  }

  button {
    font-family: inherit;
  }

  input {
    font-family: inherit;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.glass};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.glassBorder};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.accent};
  }
`;