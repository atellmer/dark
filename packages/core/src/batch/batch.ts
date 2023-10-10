import { isBatchZone, batchStore } from '../scope';

function batch(callback: () => void) {
  isBatchZone.set(true);
  callback();
  isBatchZone.set(false);
  batchStore.apply();
}

export { batch };
