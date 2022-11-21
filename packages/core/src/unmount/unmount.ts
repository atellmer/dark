import { type Fiber } from '../fiber';
import { platform } from '../platform';
import { detectIsComponentFactory } from '../component';
import { dropEffects } from '../use-effect';
import { dropLayoutEffects } from '../use-layout-effect';
import { walkFiber } from '../walk';
import { detectIsUndefined } from '../helpers';
import { currentRootHelper, eventsHelper, effectStoreHelper } from '../scope';

function unmountFiber(fiber: Fiber) {
  if (!fiber.effectHost && !fiber.layoutEffectHost && !fiber.portalHost) return;

  walkFiber({
    fiber,
    onLoop: ({ nextFiber, isReturn, stop }) => {
      if (nextFiber === fiber.nextSibling || fiber.transposition) return stop();

      if (!isReturn && detectIsComponentFactory(nextFiber.instance)) {
        nextFiber.layoutEffectHost && dropLayoutEffects(nextFiber.hook);
        nextFiber.effectHost && dropEffects(nextFiber.hook);
        nextFiber.portalHost && platform.unmountPortal(nextFiber);
      }
    },
  });
}

function unmountRoot(rootId: number, onComplete: () => void) {
  if (detectIsUndefined(rootId)) return;

  unmountFiber(currentRootHelper.get(rootId));
  eventsHelper.mapUnsubscribers(rootId);
  effectStoreHelper.remove(rootId);
  onComplete();
}

export { unmountFiber, unmountRoot };
