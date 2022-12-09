import { type Fiber } from '../fiber';
import { platform } from '../platform';
import { detectIsComponentFactory } from '../component';
import { dropEffects } from '../use-effect';
import { dropLayoutEffects } from '../use-layout-effect';
import { dropInsertionEffects } from '../use-insertion-effect';
import { walkFiber } from '../walk';
import { detectIsUndefined } from '../helpers';
import { currentRootStore, eventsStore, rootStore } from '../scope';

function unmountFiber(fiber: Fiber) {
  if (!fiber.insertionEffectHost && !fiber.layoutEffectHost && !fiber.effectHost && !fiber.portalHost) return;

  walkFiber(fiber, ({ nextFiber, isReturn, stop }) => {
    if (nextFiber === fiber.nextSibling) return stop();
    if (!isReturn && detectIsComponentFactory(nextFiber.instance)) {
      // important order
      nextFiber.insertionEffectHost && dropInsertionEffects(nextFiber.hook);
      nextFiber.layoutEffectHost && dropLayoutEffects(nextFiber.hook);
      nextFiber.effectHost && dropEffects(nextFiber.hook);
      nextFiber.portalHost && platform.unmountPortal(nextFiber);
    }
  });
}

function unmountRoot(rootId: number, onComplete: () => void) {
  if (detectIsUndefined(rootId)) return;

  unmountFiber(currentRootStore.get(rootId));
  eventsStore.unsubscribe(rootId);
  rootStore.remove(rootId);
  onComplete();
}

export { unmountFiber, unmountRoot };
