import { type Fiber, EffectTag } from '../fiber';
import { platform } from '../platform';

function walkFiber<T = unknown>(
  fiber: Fiber<T>,
  onLoop: (nextFiber: Fiber<T>, isReturn: boolean, resetIsDeepWalking: () => void, stop: () => void) => void,
) {
  let nextFiber = fiber;
  let isDeepWalking = true;
  let isReturn = false;
  let isStopped = false;
  const visitedMap: Record<number, boolean> = {};
  const detectCanVisit = (id: number) => !visitedMap[id];
  const resetIsDeepWalking = () => (isDeepWalking = false);
  const stop = () => (isStopped = true);

  while (nextFiber) {
    onLoop(nextFiber, isReturn, resetIsDeepWalking, stop);

    if (isStopped) {
      break;
    }

    if (nextFiber.child && isDeepWalking && detectCanVisit(nextFiber.child.id)) {
      const newFiber = nextFiber.child;

      isReturn = false;
      nextFiber = newFiber;
      visitedMap[newFiber.id] = true;
    } else if (nextFiber.next && detectCanVisit(nextFiber.next.id)) {
      const newFiber = nextFiber.next;

      isDeepWalking = true;
      isReturn = false;
      nextFiber = newFiber;
      visitedMap[newFiber.id] = true;
    } else if (
      nextFiber.parent &&
      nextFiber.parent === fiber &&
      nextFiber.parent.next &&
      detectCanVisit(nextFiber.parent.next.id)
    ) {
      const newFiber = nextFiber.parent.next;

      isDeepWalking = true;
      isReturn = false;
      nextFiber = newFiber;
      visitedMap[newFiber.id] = true;
    } else if (nextFiber.parent && nextFiber.parent !== fiber) {
      isDeepWalking = false;
      isReturn = true;
      nextFiber = nextFiber.parent;
    } else {
      nextFiber = null;
    }
  }
}

function collectElements<T>(fiber: Fiber<T>): Array<T> {
  const elements: Array<T> = [];

  walkFiber<T>(fiber, (nextFiber, isReturn, resetIsDeepWalking, stop) => {
    if (nextFiber === fiber.next || nextFiber === fiber.parent) return stop();
    if (!isReturn && nextFiber.element) {
      !platform.detectIsPortal(nextFiber.inst) && elements.push(nextFiber.element);

      return resetIsDeepWalking();
    }
  });

  return elements;
}

function getFiberWithElement<T1, T2 = T1>(fiber: Fiber<T1>): Fiber<T2> {
  let fiber$ = fiber as unknown as Fiber<T2>;

  while (fiber$) {
    if (fiber$.element) return fiber$;
    fiber$ = fiber$.parent;
  }

  return fiber$;
}

function detectIsFiberAlive(fiber: Fiber) {
  let fiber$ = fiber;

  while (fiber$) {
    if (fiber$.tag === EffectTag.D) return false;
    fiber$ = fiber$.parent;
  }

  return Boolean(fiber);
}

export { walkFiber, collectElements, getFiberWithElement, detectIsFiberAlive };
