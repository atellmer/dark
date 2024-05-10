import { type Callback } from '../shared';
import { type Hook } from '../fiber';
import { $$scope } from '../scope';

function batch(callback: () => void) {
  const $scope = $$scope();

  $scope.setIsBatchZone(true);
  callback();
  $scope.setIsBatchZone(false);
}

function addBatch(hook: Hook, callback: Callback, change: Callback) {
  const $scope = $$scope();

  if ($scope.getIsTransitionZone()) {
    callback();
  } else {
    const fiber = hook.owner;
    const batch = fiber.batch || { timer: null, changes: [] };

    fiber.batch = batch;
    batch.changes.push(change);
    batch.timer && clearTimeout(batch.timer);
    batch.timer = setTimeout(() => {
      batch.changes.splice(-1);
      batch.changes.forEach(x => x());
      fiber.batch = null;
      callback();
    });
  }
}

export { batch, addBatch };
