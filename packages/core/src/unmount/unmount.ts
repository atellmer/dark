import { type Fiber } from '../fiber';
import { platform } from '../global';
import { detectIsComponentFactory } from '../component';
import { cleanupEffects } from '../use-effect';
import { cleanupLayoutEffects } from '../use-layout-effect';
import { walkFiber } from '../walk';
import { detectIsUndefined } from '../helpers';
import { currentRootHelper, eventsHelper, effectStoreHelper } from '../scope';

function unmountFiber(fiber: Fiber) {
  if (fiber.effectHost || fiber.layoutEffectHost) {
    walkFiber({
      fiber,
      onLoop: ({ nextFiber, isReturn, stop }) => {
        if (nextFiber === fiber.nextSibling || fiber.transposition) return stop();

        if (!isReturn && detectIsComponentFactory(nextFiber.instance)) {
          cleanupLayoutEffects(nextFiber.hook);
          cleanupEffects(nextFiber.hook);
        }
      },
    });
  }

  fiber.portalHost && platform.unmountPortal(fiber);
}

function unmountRoot(rootId: number, onComplete: () => void) {
  if (detectIsUndefined(rootId)) return;

  unmountFiber(currentRootHelper.get(rootId));
  eventsHelper.mapUnsubscribers(rootId);
  effectStoreHelper.remove(rootId);
  onComplete();
}

export { unmountFiber, unmountRoot };
