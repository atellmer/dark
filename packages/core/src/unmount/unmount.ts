import { type Fiber } from '../fiber';
import { platform } from '../platform';
import { detectIsComponent } from '../component';
import { dropEffects } from '../use-effect';
import { dropLayoutEffects } from '../use-layout-effect';
import { dropInsertionEffects } from '../use-insertion-effect';
import { walkFiber } from '../walk';
import { detectIsUndefined } from '../helpers';
import { currentRootStore, eventsStore, rootStore } from '../scope';

function unmountFiber(fiber: Fiber) {
  if (!fiber.iefHost && !fiber.lefHost && !fiber.efHost && !fiber.clHost && !fiber.pHost) return;

  walkFiber(fiber, (nextFiber, isReturn, resetIsDeepWalking, stop) => {
    if (nextFiber === fiber.next) return stop();
    if (!nextFiber.iefHost && !nextFiber.lefHost && !nextFiber.efHost && !nextFiber.clHost && !nextFiber.pHost)
      return resetIsDeepWalking();

    if (!isReturn && detectIsComponent(nextFiber.inst)) {
      const hasValues = nextFiber.hook.values.length > 0;
      // important order
      nextFiber.iefHost && hasValues && dropInsertionEffects(nextFiber.hook);
      nextFiber.lefHost && hasValues && dropLayoutEffects(nextFiber.hook);
      nextFiber.efHost && hasValues && dropEffects(nextFiber.hook);
      nextFiber.cleanup && nextFiber.cleanup();
      nextFiber.pHost && platform.unmountPortal(nextFiber);
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
