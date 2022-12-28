import { h, createComponent, type DarkElement } from '@dark-engine/core';

type AnimatedRouteProps = {
  slot: DarkElement;
};

const AnimatedRoute = createComponent<AnimatedRouteProps>(({ slot }) => {
  return <article class='fade animated-route'>{slot}</article>;
});

export { AnimatedRoute };
