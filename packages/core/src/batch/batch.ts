import { type Fiber } from '../fiber';
import { isBatchZone } from '../scope';

function batch(callback: () => void) {
  isBatchZone.set(true);
  callback();
}

function runBatch(fiber: Fiber, callback: () => void) {
  fiber.batched && window.clearTimeout(fiber.batched);
  fiber.batched = window.setTimeout(() => {
    isBatchZone.set(false);
    fiber.batched = null;
    callback();
  });
}

export { batch, runBatch };
