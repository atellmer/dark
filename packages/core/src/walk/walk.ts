import { type Fiber } from '../fiber';

type OnLoopOptions<T> = {
  nextFiber: Fiber<T>;
  isReturn: boolean;
  resetIsDeepWalking: () => void;
  stop: () => void;
};

function walkFiber<T = unknown>(fiber: Fiber<T>, onLoop: (options: OnLoopOptions<T>) => void) {
  let nextFiber = fiber;
  let isDeepWalking = true;
  let isReturn = false;
  let isStopped = false;
  const visitedMap = new Map<Fiber, true>();
  const detectCanVisit = (fiber: Fiber) => !visitedMap.get(fiber);

  while (nextFiber) {
    onLoop({
      nextFiber: nextFiber as Fiber<T>,
      isReturn,
      resetIsDeepWalking: () => (isDeepWalking = false),
      stop: () => (isStopped = true),
    });

    if (isStopped) {
      break;
    }

    if (nextFiber.child && isDeepWalking && detectCanVisit(nextFiber.child)) {
      const newFiber = nextFiber.child;

      isReturn = false;
      nextFiber = newFiber;
      visitedMap.set(newFiber, true);
    } else if (nextFiber.nextSibling && detectCanVisit(nextFiber.nextSibling)) {
      const newFiber = nextFiber.nextSibling;

      isDeepWalking = true;
      isReturn = false;
      nextFiber = newFiber;
      visitedMap.set(newFiber, true);
    } else if (
      nextFiber.parent &&
      nextFiber.parent === fiber &&
      nextFiber.parent.nextSibling &&
      detectCanVisit(nextFiber.parent.nextSibling)
    ) {
      const newFiber = nextFiber.parent.nextSibling;

      isDeepWalking = true;
      isReturn = false;
      nextFiber = newFiber;
      visitedMap.set(newFiber, true);
    } else if (nextFiber.parent && nextFiber.parent !== fiber) {
      isDeepWalking = false;
      isReturn = true;
      nextFiber = nextFiber.parent;
    } else {
      nextFiber = null;
    }
  }
}

export { walkFiber };
