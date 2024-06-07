import { EFFECT_HOST_MASK, SIGNAL_HOST_MASK } from '../constants';
import { removeScope, $$scope } from '../scope';
import { detectIsUndefined } from '../utils';
import { type Callback } from '../shared';
import { type Fiber } from '../fiber';
import { walk } from '../walk';

const unmountFiber = (fiber: Fiber) => walk(fiber, onWalk);

function onWalk(fiber: Fiber, skip: Callback) {
  if (!(fiber.mask & (EFFECT_HOST_MASK | SIGNAL_HOST_MASK))) {
    skip();
  } else {
    fiber.drop();
  }
}

function unmountRoot(rootId: number, onCompleted: Callback) {
  if (detectIsUndefined(rootId)) return;
  const $scope = $$scope(rootId);

  unmountFiber($scope.getRoot());
  $scope.off();
  removeScope(rootId);
  onCompleted();
}

export { unmountFiber, unmountRoot };
