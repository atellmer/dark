import { dropInsertionEffects } from '../use-insertion-effect';
import { dropLayoutEffects } from '../use-layout-effect';
import { removeScope, $$scope } from '../scope';
import { detectIsUndefined } from '../utils';
import { dropEffects } from '../use-effect';
import { platform } from '../platform';
import { type Fiber } from '../fiber';
import { walk } from '../walk';
import {
  INSERTION_EFFECT_HOST_MASK,
  LAYOUT_EFFECT_HOST_MASK,
  ASYNC_EFFECT_HOST_MASK,
  ATOM_HOST_MASK,
  PORTAL_HOST_MASK,
} from '../constants';

const combinedMask =
  INSERTION_EFFECT_HOST_MASK | LAYOUT_EFFECT_HOST_MASK | ASYNC_EFFECT_HOST_MASK | ATOM_HOST_MASK | PORTAL_HOST_MASK;

const shouldUnmountFiber = (fiber: Fiber) => fiber.mask & combinedMask;

function unmountFiber(fiber: Fiber) {
  if (!shouldUnmountFiber(fiber)) return;
  walk(fiber, (fiber, skip) => {
    if (!shouldUnmountFiber(fiber)) return skip();
    if (fiber.hook && fiber.hook.values.length > 0) {
      fiber.mask & INSERTION_EFFECT_HOST_MASK && dropInsertionEffects(fiber.hook);
      fiber.mask & LAYOUT_EFFECT_HOST_MASK && dropLayoutEffects(fiber.hook);
      fiber.mask & ASYNC_EFFECT_HOST_MASK && dropEffects(fiber.hook);
    }

    if (fiber.atoms) {
      for (const [_, cleanup] of fiber.atoms) {
        cleanup();
      }
      fiber.atoms = null;
    }

    fiber.mask & PORTAL_HOST_MASK && platform.unmountPortal(fiber);
  });
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
