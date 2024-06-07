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
    const batcher = hook.getBatcher() || { timer: null, changes: [] };

    hook.setBatcher(batcher);
    batcher.changes.push(change);
    batcher.timer && clearTimeout(batcher.timer);
    batcher.timer = setTimeout(() => {
      batcher.changes.splice(-1);
      batcher.changes.forEach(x => x());
      hook.setBatcher(null);
      callback();
    });
  }
}

export { batch, addBatch };
