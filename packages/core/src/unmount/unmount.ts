import { EFFECT_HOST_MASK, ATOM_HOST_MASK } from '../constants';
import { removeScope, $$scope } from '../scope';
import { detectIsUndefined } from '../utils';
import { type Callback } from '../shared';
import { platform } from '../platform';
import { type Fiber } from '../fiber';
import { walk } from '../walk';

const mask = EFFECT_HOST_MASK | ATOM_HOST_MASK;

function unmountFiber(fiber: Fiber) {
  if (!(fiber.mask & mask)) return;
  walk(fiber, onWalk);
}

function onWalk(fiber: Fiber, skip: Callback) {
  const { hook } = fiber;

  if (!(fiber.mask & mask)) return skip();
  hook?.drop();
}

function unmountRoot(rootId: number) {
  if (detectIsUndefined(rootId)) return;
  const $scope = $$scope(rootId);

  if (platform.detectIsDynamic()) {
    unmountFiber($scope.getRoot());
    $scope.off();
  }

  removeScope(rootId);
}

export { unmountFiber, unmountRoot };
