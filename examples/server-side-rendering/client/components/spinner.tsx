import { h, component } from '@dark-engine/core';
import { styled, keyframes } from '@dark-engine/styled';

const opacity = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`;

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`;

const Root = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  & .opacity {
    animation: ${opacity} 0.6s 1 ease-in-out;
  }
`;

const Content = styled.div`
  width: 64px;
  height: 64px;
  clear: both;
  margin: 20px auto;

  &.hydrogen {
    position: relative;
    border: 1px #000 solid;
    border-radius: 50%;
    animation: ${rotate} 0.6s infinite linear;
  }

  &.hydrogen::before,
  &.hydrogen::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: #000;
    border-radius: 50%;
  }

  &.hydrogen::before {
    top: calc(50% - 5px);
    left: calc(50% - 5px);
  }

  &.hydrogen::after {
    top: -1px;
    left: -1px;
  }
`;

const Spinner = component(() => (
  <Root>
    <div class='opacity'>
      <Content class='hydrogen' />
    </div>
  </Root>
));

export { Spinner };
