import { styled, keyframes } from '@dark-engine/styled';

const fade = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`;

const AnimatedRoute = styled.div`
  animation-name: ${fade};
  animation-iteration-count: 1;
  animation-duration: 600ms;
  animation-fill-mode: both;
  animation-timing-function: ease-in-out;
`;

export { AnimatedRoute };
