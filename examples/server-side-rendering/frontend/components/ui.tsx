import { h, component } from '@dark-engine/core';
import { createGlobalStyle, styled, keyframes, css } from '@dark-engine/styled';
import { type DarkJSX } from '@dark-engine/platform-browser';

const BOX_SHADOW = '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)';

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
    line-height: 1.4;
    background-color: #001d36;
    overflow-y: scroll;
  }

  a {
    margin: 4px;
    color: blue;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  .router-link-active, .router-link-active:hover {
    color: #FFEB3B;
    text-decoration: underline;
  }

  .router-back-link, .router-back-link:hover {
    color: #fff;
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
  border: 1px #000 solid;
  border-radius: 50%;
  animation: ${rotate} 0.6s infinite linear;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: #000;
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
  grid-template-rows: 64px minmax(max-content, 1fr) 64px;
`;

const Header = styled.header`
  display: flex;
`;

const Menu = styled.nav<{ $secondary?: boolean } & DarkJSX.HTMLTags['nav']>`
  width: 100%;
  box-shadow: ${BOX_SHADOW};
  display: flex;
  align-items: center;
  flex-grow: 1;

  & a {
    text-transform: uppercase;
    font-size: 0.9rem;
  }

  & a:hover {
    text-decoration: underline;
  }

  ${p => css`
    background-color: ${p.$secondary ? 'transparent' : '#0061a4'};
    padding: ${p.$secondary ? '8px' : '16px'};
    border-radius: ${p.$secondary ? '2px' : '0'};

    & a {
      color: ${p.$secondary ? '#000' : '#fff'};
    }
  `};
`;

const Content = styled.main`
  padding: 0 16px 16px;
  background-color: #fdfcff;
`;

const Footer = styled.footer`
  padding: 16px;
  background-color: #410002;
  color: #fff;
`;

const Card = styled.article<{ $loading?: boolean } & DarkJSX.HTMLTags['article']>`
  padding: 16px;
  opacity: ${p => (p.$loading ? 0.2 : 1)};
  transition: opacity 0.2s ease-in-out;
  background-color: #fff;
  box-shadow: ${BOX_SHADOW};
`;

const Input = styled.input.attrs(p => ({ ...p, placeholder: 'Enter the text...' }))`
  border: 1px solid #251431;
  height: 30px;
  padding: 6px;
  border-radius: 2px;
`;

const Textarea = styled.textarea.attrs(p => ({ ...p, placeholder: 'Enter the text...' }))`
  border: 1px solid #251431;
  resize: none;
  min-height: 30px;
  padding: 6px;
  border-radius: 2px;
  font-family: sans-serif;
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
  background-color: #251431;
  color: #fff;
  text-transform: uppercase;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  display: inline-block;
  text-decoration: none;
  line-height: 1.7;
  font-size: 0.9rem;
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
  background-color: #fff;
  margin: 6px 0;
  padding: 16px;
  box-shadow: ${BOX_SHADOW};

  &:first-child {
    margin-top: 0;
  }
`;

const Sticky = styled.div`
  position: sticky;
  top: 0;
  background-color: #fdfcff;
  padding: 16px;
  box-shadow: ${BOX_SHADOW};
  margin: 0 -16px;

  & h1 {
    margin: 0;
  }
`;

export {
  GlobalStyle,
  Error,
  Spinner,
  AnimationFade,
  Root,
  Header,
  Menu,
  Content,
  Footer,
  Card,
  Input,
  Textarea,
  Form,
  Button,
  List,
  ListItem,
  Sticky,
};
