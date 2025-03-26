import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    font-family: ${theme.fonts.body};
    background-color: ${theme.colors.background};
    color: ${theme.colors.text};
    line-height: 1.6;
    min-height: 100vh;
    scroll-behavior: smooth;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.fonts.heading};
    margin-bottom: ${theme.space.md};
    font-weight: 600;
    line-height: 1.2;
  }

  p {
    margin-bottom: ${theme.space.md};
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: ${theme.transitions.default};
    
    &:hover {
      color: ${theme.colors.primaryLight};
      text-decoration: underline;
    }
  }

  button {
    cursor: pointer;
    font-family: ${theme.fonts.body};
    border: none;
    background: none;
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  ul, ol {
    margin-left: ${theme.space.lg};
    margin-bottom: ${theme.space.md};
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.backgroundLight};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.secondary};
    border-radius: ${theme.borderRadius.full};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.secondaryLight};
  }
`;

export default GlobalStyles;
