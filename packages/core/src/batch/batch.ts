import { $$scope } from '../scope';
import { scheduler } from '../scheduler';
import { Callback } from '../shared';

function batch(callback: Callback) {
  const $scope = $$scope();

  $scope.setIsBatch(true);
  callback();
  $scope.setIsBatch(false);
  scheduler.batch();
}

export { batch };
