import { createGlobalStyle, styled } from '@dark-engine/styled';
import { type DarkJSX } from '@dark-engine/platform-browser';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
  }

  body {
    font-family: sans-serif;
  }

  a {
    margin-right: 8px;
    color: blue;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  .router-link-active, .router-link-active:hover {
    color: #ffeb3b;
    text-decoration: underline;
  }

  .router-back-link, .router-back-link:hover {
    color: #EC407A;
  }
`;

const Root = styled.div`
  height: 100vh;
  width: 1200px;
  max-width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 64px minmax(max-content, 1fr) 64px;
`;

const Header = styled.header<{ $nested?: boolean } & DarkJSX.HTMLTags['header']>`
  width: 100%;
  background-color: ${p => (p.$nested ? '#673ab7' : '#03a9f4')};
  padding: 16px;
  color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  display: flex;
  align-items: center;

  & a {
    text-transform: uppercase;
    font-size: 0.9rem;
  }

  & a:not(.router-link-active) {
    color: #fff;
  }

  & a:hover {
    text-decoration: underline;
  }
`;

const Content = styled.main`
  padding: 0 16px;
  background-color: #fff8e1;
`;

const Footer = styled.footer`
  padding: 16px;
  background-color: #880e4f;
  color: #fff;
`;

export { GlobalStyle, Root, Header, Content, Footer };
