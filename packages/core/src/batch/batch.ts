import { scope$$ } from '../scope';
import { type Fiber } from '../fiber';
import { type Callback } from '../shared';

function batch(callback: () => void) {
  const scope$ = scope$$();

  scope$.setIsBatchZone(true);
  callback();
  scope$.setIsBatchZone(false);
}

function addBatch(fiber: Fiber, callback: Callback, change: Callback) {
  const scope$ = scope$$();

  if (scope$.getIsTransitionZone()) {
    callback();
  } else {
    const batch = fiber.batch || { timer: null, changes: [] };

    fiber.batch = batch;
    batch.changes.push(change);
    batch.timer && clearTimeout(batch.timer);
    batch.timer = setTimeout(() => {
      batch.changes.splice(-1);
      batch.changes.forEach(x => x());
      delete fiber.batch;
      callback();
    });
  }
}

export { batch, addBatch };
