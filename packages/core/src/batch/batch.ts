import { type Fiber } from '../fiber';
import { isBatchZone } from '../scope';

function batch(callback: () => void) {
  isBatchZone.set(true);
  callback();
}

function runBatch(fiber: Fiber, callback: () => void) {
  fiber.batch && clearTimeout(fiber.batch as number);
  fiber.batch = setTimeout(() => {
    isBatchZone.set(false);
    fiber.batch = null;
    callback();
  });
}

export { batch, runBatch };
