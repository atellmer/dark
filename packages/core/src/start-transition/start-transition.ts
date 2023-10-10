import { scope$$ } from '../scope';

function startTransition(callback: () => void) {
  scope$$().setIsTransitionZone(true);
  callback();
  scope$$().setIsTransitionZone(false);
}

export { startTransition };
