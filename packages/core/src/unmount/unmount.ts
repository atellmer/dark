import { type Fiber } from '../fiber';
import { platform } from '../platform';
import { detectIsComponent } from '../component';
import { dropEffects } from '../use-effect';
import { dropLayoutEffects } from '../use-layout-effect';
import { dropInsertionEffects } from '../use-insertion-effect';
import { walk } from '../walk';
import { detectIsUndefined } from '../helpers';
import { removeScope, scope$$ } from '../scope';

const canUnmountFiber = (fiber: Fiber) =>
  fiber.iefHost || fiber.lefHost || fiber.aefHost || fiber.atomHost || fiber.portalHost;

function unmountFiber(fiber: Fiber) {
  if (!canUnmountFiber(fiber)) return;
  walk(fiber, (fiber, skip) => {
    if (!canUnmountFiber(fiber)) return skip();
    if (!detectIsComponent(fiber.inst)) return;

    if (fiber.hook.values.length > 0) {
      fiber.iefHost && dropInsertionEffects(fiber.hook);
      fiber.lefHost && dropLayoutEffects(fiber.hook);
      fiber.aefHost && dropEffects(fiber.hook);
    }

    fiber.cleanup && fiber.cleanup();
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
