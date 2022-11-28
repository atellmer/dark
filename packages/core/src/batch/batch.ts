import { type Fiber } from '../fiber';
import { isBatchZone } from '../scope';
import { platform } from '../platform';

function batch(callback: () => void) {
  isBatchZone.set(true);
  callback();
}

function runBatch(fiber: Fiber, callback: () => void) {
  fiber.batched = callback;

  const update = () => {
    const fn = fiber.batched;

    platform.requestAnimationFrame(() => {
      if (fn === fiber.batched) {
        isBatchZone.set(false);
        fiber.batched = null;
        fn && fn();
      } else {
        update();
      }
    });
  };

  update();
}

export { batch, runBatch };
