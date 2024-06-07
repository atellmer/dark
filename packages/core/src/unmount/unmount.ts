import { EFFECT_HOST_MASK, SIGNAL_HOST_MASK } from '../constants';
import { type Fiber, type Hook, type HookValue } from '../fiber';
import { removeScope, $$scope } from '../scope';
import { detectIsUndefined } from '../utils';
import { dropEffects } from '../use-effect';
import { type Callback } from '../shared';
import { walk } from '../walk';

const mask = EFFECT_HOST_MASK | SIGNAL_HOST_MASK;

function unmountFiber(fiber: Fiber) {
  if (!(fiber.mask & mask)) return;
  walk(fiber, onWalk);
}

function onWalk(fiber: Fiber, skip: Callback) {
  if (!(fiber.mask & mask)) return skip();
  const hook = fiber.hook as Hook<HookValue>;
  const values = hook?.values;
  const signals = hook?.getSignals();

  values && values.length > 0 && fiber.mask & EFFECT_HOST_MASK && dropEffects(hook);

  if (signals) {
    for (const [_, dropSignal] of signals) dropSignal();
    hook.resetSignals();
  }
}

function unmountRoot(rootId: number, onCompleted: () => void) {
  if (detectIsUndefined(rootId)) return;
  const $scope = $$scope(rootId);

  unmountFiber($scope.getRoot());
  $scope.off();
  removeScope(rootId);
  onCompleted();
}

export { unmountFiber, unmountRoot };
