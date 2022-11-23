import { type Fiber } from '../fiber';
import { isBatchZone } from '../scope';
import { platform } from '../platform';

function batch(callback: () => void) {
  isBatchZone.set(true);
  callback();
}

function runBatch(fiber: Fiber, callback: () => void) {
  fiber.batched.push(callback);

  const update = () => {
    const size = fiber.batched.length;

    platform.requestAnimationFrame(() => {
      if (size === fiber.batched.length) {
        const fn = fiber.batched[fiber.batched.length - 1];

        isBatchZone.set(false);
        fiber.batched = [];
        fn && fn();
      } else {
        update();
      }
    });
  };

  update();
}

export { batch, runBatch };
