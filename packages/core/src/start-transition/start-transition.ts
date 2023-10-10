import { scope$$ } from '../scope';

function startTransition(callback: () => void) {
  const scope$ = scope$$();

  scope$.setIsTransitionZone(true);
  callback();
  scope$.setIsTransitionZone(false);
}

export { startTransition };
