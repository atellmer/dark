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
  walk(fiber, (fiber, skipDeep) => {
    if (!canUnmountFiber(fiber)) return skipDeep();
    if (!detectIsComponent(fiber.inst)) return;
    const hasValues = fiber.hook.values.length > 0;
    // !
    fiber.iefHost && hasValues && dropInsertionEffects(fiber.hook);
    fiber.lefHost && hasValues && dropLayoutEffects(fiber.hook);
    fiber.aefHost && hasValues && dropEffects(fiber.hook);
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
