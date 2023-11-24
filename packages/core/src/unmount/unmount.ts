import { type Fiber } from '../fiber';
import { platform } from '../platform';
import { dropEffects } from '../use-effect';
import { dropLayoutEffects } from '../use-layout-effect';
import { dropInsertionEffects } from '../use-insertion-effect';
import { walk } from '../walk';
import { detectIsUndefined } from '../helpers';
import { removeScope, scope$$ } from '../scope';

const shouldUnmountFiber = (fiber: Fiber) =>
  fiber.iefHost || fiber.lefHost || fiber.aefHost || fiber.atomHost || fiber.portalHost;

function unmountFiber(fiber: Fiber) {
  if (!shouldUnmountFiber(fiber)) return;
  walk(fiber, (fiber, skip) => {
    if (!shouldUnmountFiber(fiber)) return skip();

    if (fiber.hook && fiber.hook.values.length > 0) {
      fiber.iefHost && dropInsertionEffects(fiber.hook);
      fiber.lefHost && dropLayoutEffects(fiber.hook);
      fiber.aefHost && dropEffects(fiber.hook);
    }

    if (fiber.atoms) {
      for (const [_, cleanup] of fiber.atoms) {
        cleanup();
      }
      delete fiber.atoms;
    }

    fiber.portalHost && platform.unmountPortal(fiber);
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
