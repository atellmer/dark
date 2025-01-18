import { type Fiber, type Hook, type HookValue } from '../fiber';
import { type UseEffectValue, dropEffects } from '../use-effect';
import { EFFECT_HOST_MASK, ATOM_HOST_MASK } from '../constants';
import { removeScope, $$scope } from '../scope';
import { detectIsUndefined } from '../utils';
import { type Callback } from '../shared';
import { walk } from '../walk';

const mask = EFFECT_HOST_MASK | ATOM_HOST_MASK;

function unmountFiber(fiber: Fiber) {
  if (!(fiber.mask & mask)) return;
  walk(fiber, onWalk);
}

function onWalk(fiber: Fiber, skip: Callback) {
  const { hook } = fiber;

  if (!(fiber.mask & mask)) return skip();
  if (hook?.values.length > 0) {
    const $hook = hook as Hook<HookValue<UseEffectValue>>;

    fiber.mask & EFFECT_HOST_MASK && dropEffects($hook);
  }

  if (hook?.atoms) {
    for (const [_, cleanup] of hook.atoms) {
      cleanup();
    }

    hook.atoms = null;
  }
}

function unmountRoot(rootId: number, onCompleted: () => void) {
  if (detectIsUndefined(rootId)) return;
  const $scope = $$scope(rootId);

  unmountFiber($scope.getRoot());
  $scope.unsubscribeEvents();
  removeScope(rootId);
  onCompleted();
}

export { unmountFiber, unmountRoot };
