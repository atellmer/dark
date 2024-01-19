import { h, component } from '@dark-engine/core';
import { createGlobalStyle, styled, keyframes, css } from '@dark-engine/styled';
import { type DarkJSX } from '@dark-engine/platform-browser';

const BOX_SHADOW = '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Roboto';
    font-weight: 400;
    font-display: swap;
    src: url('/static/assets/fonts/Roboto-Regular.ttf');
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Roboto', sans-serif;
    line-height: 1.4;
    background-color: #1A237E;
    overflow-y: scroll;
    color: #fff;
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
    color: #FFEB3B;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  .router-link-active, .router-link-active:hover {
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

const Menu = styled.nav<{ $secondary?: boolean } & DarkJSX.HTMLTags['nav']>`
  width: 100%;
  display: flex;
  align-items: center;
  flex-grow: 1;
  box-shadow: ${BOX_SHADOW};
  font-weight: 700;

  & a {
    text-transform: uppercase;
    font-size: 0.9rem;
  }

  & a:hover {
    text-decoration: underline;
  }

  ${p => css`
    background-color: ${p.$secondary ? '#3F51B5' : '#fdd835'};
    padding: ${p.$secondary ? '8px' : '16px'};
    border-radius: ${p.$secondary ? '6px' : '0'};

    & a {
      color: ${p.$secondary ? '#fff' : '#000'};
    }
  `};
`;

const Content = styled.main`
  padding: 0 16px 16px;
  background-color: #283593;
  box-shadow: ${BOX_SHADOW};
`;

const Card = styled.article<{ $loading?: boolean } & DarkJSX.HTMLTags['article']>`
  padding: 16px;
  opacity: ${p => (p.$loading ? 0.2 : 1)};
  transition: opacity 0.2s ease-in-out;
  background-color: #3f51b5;
  box-shadow: ${BOX_SHADOW};
  border-radius: 6px;
`;

const Input = styled.input`
  border: 1px solid #1a237e;
  height: 30px;
  padding: 6px;
  border-radius: 6px;
  background-color: #1a237e;
  color: #fff;
`;

const Textarea = styled.textarea`
  border: 1px solid #1a237e;
  resize: none;
  min-height: 30px;
  padding: 6px;
  border-radius: 6px;
  background-color: #1a237e;
  color: #fff;
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
  background-color: #fdd835;
  color: #000;
  text-transform: uppercase;
  text-align: center;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: inline-block;
  text-decoration: none;
  line-height: 1.7;
  font-size: 0.9rem;
  font-weight: 700;
  margin: 0;

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
  width: 100%;
  background-color: #3f51b5;
  margin: 6px 0;
  padding: 16px;
  box-shadow: ${BOX_SHADOW};
  border-radius: 6px;

  &:first-child {
    margin-top: 0;
  }
`;

const Sticky = styled.div`
  position: sticky;
  top: 0;
  background-color: #283593;
  padding: 16px;
  box-shadow: ${BOX_SHADOW};
  margin: 0 -16px;

  & h1 {
    margin: 0;
    margin-bottom: 10px;
  }
`;

const Error = component<{ value: string }>(({ value }) => <div>{value} 🫠</div>);

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
  border: 4px #fdd835 solid;
  border-radius: 50%;
  animation: ${rotate} 0.6s infinite linear;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: #fdd835;
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
