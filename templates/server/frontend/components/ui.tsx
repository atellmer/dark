import { h, component } from '@dark-engine/core';
import { createGlobalStyle, styled } from '@dark-engine/styled';

const GlobalStyle = createGlobalStyle`
  :root {
    --text-color: #000;
    --text-contrast-color: #fff;
    --accent-color: #311B92;
    --bg-color-1: #fafafa;
    --bg-color-2: #F5F5F5;
    --bg-color-3: #fff;
    --elevation-1: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
  }

  html, body {
    margin: 0;
    padding: 0;
  }

  body {
    font-family: sans-serif;
    line-height: 1.4;
    background-color: var(--bg-color-1);
    overflow-y: scroll;
    color: var(--text-color);
  }

  a {
    margin: 4px;
    color: var(--accent-color);
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  .router-link-active, .router-link-active:hover {
    text-decoration: underline;
  }
`;

const Root = styled.div`
  width: 1200px;
  max-width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 64px minmax(max-content, 1fr);
`;

const Header = styled.header`
  position: sticky;
  top: 0px;
  display: flex;
  border-radius: 0 0 10px 10px;
  background-color: var(--accent-color);
  box-shadow: var(--elevation-1);
  height: 64px;
`;

const Menu = styled.nav`
  width: 100%;
  display: flex;
  align-items: center;
  flex-grow: 1;
  font-weight: 700;
  padding: 16px;

  & a {
    color: var(--text-contrast-color);
    text-transform: uppercase;
    font-size: 0.9rem;
  }

  & a:hover {
    text-decoration: underline;
  }
`;

const Content = styled.main`
  padding: 0 16px 16px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  width: 100%;
  background-color: var(--bg-color-3);
  box-shadow: var(--elevation-1);
  border-radius: 6px;
  padding: 16px;
  margin: 6px 0;

  &:first-child {
    margin-top: 0;
  }
`;

const SpinnerRoot = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
`;

const Spinner = component(() => <SpinnerRoot>LOADING...</SpinnerRoot>);

export { GlobalStyle, Root, Header, Menu, Content, List, ListItem, Spinner };
