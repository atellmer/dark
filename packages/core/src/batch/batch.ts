import { type Callback } from '../shared';
import { type Hook } from '../fiber';
import { $$scope } from '../scope';

function batch(callback: () => void) {
  const $scope = $$scope();

  $scope.setIsBatch(true);
  callback();
  $scope.setIsBatch(false);
}

function addBatch(hook: Hook, callback: Callback, change: Callback) {
  const $scope = $$scope();

  if ($scope.getIsTransition()) {
    callback();
  } else {
    const batch = hook.getBatch() || { timer: null, changes: [] };

    hook.setBatch(batch);
    batch.changes.push(change);
    batch.timer && clearTimeout(batch.timer);
    batch.timer = setTimeout(() => {
      batch.changes.splice(-1);
      batch.changes.forEach(x => x());
      hook.setBatch(null);
      callback();
    });
  }
}

export { batch, addBatch };
