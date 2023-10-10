import { scope$$ } from '../scope';

function batch(callback: () => void) {
  const scope$ = scope$$();

  scope$.setIsBatchZone(true);
  callback();
  scope$.setIsBatchZone(false);
  scope$.applyBatch();
}

export { batch };
