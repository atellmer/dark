import { scope$$ } from '../scope';

function batch(callback: () => void) {
  const scope$ = scope$$();

  scope$.setIsBatchZone(true);
  callback();
  scope$.setIsBatchZone(false);
}

export { batch };
