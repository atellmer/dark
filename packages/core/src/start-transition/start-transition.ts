import { isTransitionZone } from '../scope';

function startTransition(callback: () => void) {
  isTransitionZone.set(true);
  callback();
  isTransitionZone.set(false);
}

export { startTransition };
