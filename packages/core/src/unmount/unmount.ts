import { type Fiber } from '../fiber';
import { platform } from '../platform';
import { dropEffects } from '../use-effect';
import { dropLayoutEffects } from '../use-layout-effect';
import { dropInsertionEffects } from '../use-insertion-effect';
import { walk } from '../walk';
import { detectIsUndefined } from '../utils';
import { removeScope, $$scope } from '../scope';
import {
  MASK_INSERTION_EFFECT_HOST,
  MASK_LAYOUT_EFFECT_HOST,
  MASK_ASYNC_EFFECT_HOST,
  MASK_ATOM_HOST,
  MASK_PORTAL_HOST,
} from '../constants';

const combinedMask =
  MASK_INSERTION_EFFECT_HOST | MASK_LAYOUT_EFFECT_HOST | MASK_ASYNC_EFFECT_HOST | MASK_ATOM_HOST | MASK_PORTAL_HOST;

const shouldUnmountFiber = (fiber: Fiber) => fiber.mask & combinedMask;

function unmountFiber(fiber: Fiber) {
  if (!shouldUnmountFiber(fiber)) return;
  walk(fiber, (fiber, skip) => {
    if (!shouldUnmountFiber(fiber)) return skip();

    if (fiber.hook && fiber.hook.values.length > 0) {
      fiber.mask & MASK_INSERTION_EFFECT_HOST && dropInsertionEffects(fiber.hook);
      fiber.mask & MASK_LAYOUT_EFFECT_HOST && dropLayoutEffects(fiber.hook);
      fiber.mask & MASK_ASYNC_EFFECT_HOST && dropEffects(fiber.hook);
    }

    if (fiber.atoms) {
      for (const [_, cleanup] of fiber.atoms) {
        cleanup();
      }
      fiber.atoms = null;
    }

    fiber.mask & MASK_PORTAL_HOST && platform.unmountPortal(fiber);
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
