import { type Fiber, Mask } from '../fiber';
import { platform } from '../platform';
import { dropEffects } from '../use-effect';
import { dropLayoutEffects } from '../use-layout-effect';
import { dropInsertionEffects } from '../use-insertion-effect';
import { walk } from '../walk';
import { detectIsUndefined } from '../helpers';
import { removeScope, scope$$ } from '../scope';

const combinedMask =
  Mask.INSERTION_EFFECT_HOST | Mask.LAYOUT_EFFECT_HOST | Mask.ASYNC_EFFECT_HOST | Mask.ATOM_HOST | Mask.PORTAL_HOST;

const shouldUnmountFiber = (fiber: Fiber) => fiber.mask & combinedMask;

function unmountFiber(fiber: Fiber) {
  if (!shouldUnmountFiber(fiber)) return;
  walk(fiber, (fiber, skip) => {
    if (!shouldUnmountFiber(fiber)) return skip();

    if (fiber.hook && fiber.hook.values.length > 0) {
      fiber.mask & Mask.INSERTION_EFFECT_HOST && dropInsertionEffects(fiber.hook);
      fiber.mask & Mask.LAYOUT_EFFECT_HOST && dropLayoutEffects(fiber.hook);
      fiber.mask & Mask.ASYNC_EFFECT_HOST && dropEffects(fiber.hook);
    }

    if (fiber.atoms) {
      for (const [_, cleanup] of fiber.atoms) {
        cleanup();
      }
      delete fiber.atoms;
    }

    fiber.mask & Mask.PORTAL_HOST && platform.unmountPortal(fiber);
  });
}

function unmountRoot(rootId: number, onCompleted: () => void) {
  if (detectIsUndefined(rootId)) return;
  const scope$ = scope$$(rootId);

  unmountFiber(scope$.getRoot());
  scope$.unsubscribeEvents();
  removeScope(rootId);
  onCompleted();
}

export { unmountFiber, unmountRoot };
