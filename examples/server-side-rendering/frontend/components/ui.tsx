import { component } from '@dark-engine/core';
import { createGlobalStyle, styled, keyframes, css } from '@dark-engine/styled';
import { type DarkJSX } from '@dark-engine/platform-browser';

const GlobalStyle = createGlobalStyle`
  :root {
    --light-color: #fff;
    --dark-color: #000;
    --accent-color: #fdd835;
    --bg-color-1: #1A237E;
    --bg-color-2: #1a237e;
    --bg-color-3: #283593;
    --bg-color-4: #3F51B5;
    --elevation-1: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  }

  @font-face {
    font-family: 'Roboto';
    font-weight: 400;
    font-display: swap;
    src: url('/static/assets/fonts/Roboto-Regular.ttf');
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
    font-family: 'Roboto', sans-serif;
    line-height: 1.4;
    background-color: var(--bg-color-1);
    overflow-y: scroll;
    color: var(--light-color);
  }

  input, textarea, button {
    font-family: 'Roboto';
  }

  input, textarea {
    font-size: 1rem;
  }

  label {
    text-transform: uppercase;
    font-size: 0.9rem;
  }

  a {
    margin: 4px;
    color: var(--accent-color);
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  .active-link, .active-link:hover {
    text-decoration: underline;
  }
`;

const fade = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`;

const AnimationFade = styled.div`
  animation-name: ${fade};
  animation-iteration-count: 1;
  animation-duration: 300ms;
  animation-fill-mode: both;
  animation-timing-function: ease-in-out;
`;

const Root = styled.div`
  height: 100vh;
  width: 1200px;
  max-width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 64px minmax(max-content, 1fr);
`;

const Header = styled.header`
  display: flex;
`;

const Menu = styled.nav<{ $isSecondary?: boolean } & DarkJSX.Elements['nav']>`
  width: 100%;
  display: flex;
  align-items: center;
  flex-grow: 1;
  box-shadow: var(--elevation-1);
  font-weight: 700;

  & a {
    text-transform: uppercase;
    font-size: 0.9rem;
  }

  & a:hover {
    text-decoration: underline;
  }

  ${p => css`
    background-color: ${p.$isSecondary ? 'var(--bg-color-4)' : 'var(--accent-color)'};
    padding: ${p.$isSecondary ? '8px' : '16px'};
    border-radius: ${p.$isSecondary ? '6px' : '0'};

    & a {
      color: ${p.$isSecondary ? 'var(--light-color)' : 'var(--dark-color)'};
    }
  `};
`;

const Content = styled.main`
  padding: 0 16px 16px;
  background-color: var(--bg-color-3);
  box-shadow: var(--elevation-1);
`;

const cardFragment = css`
  width: 100%;
  background-color: var(--bg-color-4);
  box-shadow: var(--elevation-1);
  border-radius: 6px;
  padding: 16px;
`;

const Card = styled.article<{ $isFetching?: boolean } & DarkJSX.Elements['article']>`
  ${() => cardFragment}
  opacity: ${p => (p.$isFetching ? 0.2 : 1)};
  transition: opacity 0.2s ease-in-out;
`;

const inputFragment = css`
  border: none;
  padding: 6px;
  border-radius: 6px;
  background-color: var(--bg-color-2);
  color: var(--light-color);
`;

const Input = styled.input`
  ${() => inputFragment}
  height: 30px;
`;

const Textarea = styled.textarea`
  ${() => inputFragment}
  resize: none;
  min-height: 30px;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(5, auto);
  grid-gap: 8px;
  margin-bottom: 10px;
`;

const Button = styled.button`
  padding: 6px 8px;
  background-color: var(--accent-color);
  color: var(--dark-color);
  text-transform: uppercase;
  text-align: center;
  border: none;
  border-radius: 6px;
  display: inline-block;
  text-decoration: none;
  line-height: 1.7;
  font-size: 0.9rem;
  font-weight: 700;
  margin: 0;
  cursor: pointer;

  &:hover {
    text-decoration: none;
  }

  ${Card} &:not(:last-child) {
    margin-right: 6px;
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  ${() => cardFragment}
  margin: 6px 0;

  &:first-child {
    margin-top: 0;
  }
`;

const Sticky = styled.div`
  position: sticky;
  top: 0;
  background-color: var(--bg-color-3);
  padding: 16px;
  box-shadow: var(--elevation-1);
  margin: 0 -16px;
  z-index: 2;

  & h1 {
    margin: 0;
    margin-bottom: 10px;
  }
`;

const Error = component<{ value: string }>(({ value }) => <div>{value} 🤷‍♂️</div>);

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`;

const SpinnerRoot = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const SpinnerHydrogen = styled.div`
  width: 64px;
  height: 64px;
  clear: both;
  margin: 20px auto;
  position: relative;
  border: 4px var(--accent-color) solid;
  border-radius: 50%;
  animation: ${rotate} 0.6s infinite linear;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: var(--accent-color);
    border-radius: 50%;
  }

  &::before {
    top: calc(50% - 5px);
    left: calc(50% - 5px);
  }

  &::after {
    top: -1px;
    left: -1px;
  }
`;

const Spinner = component(() => (
  <SpinnerRoot>
    <SpinnerHydrogen />
  </SpinnerRoot>
));

export {
  GlobalStyle,
  AnimationFade,
  Root,
  Header,
  Menu,
  Content,
  Card,
  Input,
  Textarea,
  Form,
  Button,
  List,
  ListItem,
  Sticky,
  Error,
  Spinner,
};
