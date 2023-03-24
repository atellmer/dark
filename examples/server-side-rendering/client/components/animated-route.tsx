import { h, component, type DarkElement } from '@dark-engine/core';

type AnimatedRouteProps = {
  slot: DarkElement;
};

const AnimatedRoute = component<AnimatedRouteProps>(({ slot }) => {
  return <article class='fade animated-route'>{slot}</article>;
});

export { AnimatedRoute };
