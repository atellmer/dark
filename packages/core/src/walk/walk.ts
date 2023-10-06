import { Fiber, EffectTag } from '../fiber';
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
    } else if (nextFiber.parent && nextFiber.parent !== fiber) {
      isDeepWalking = false;
      isReturn = true;
      nextFiber = nextFiber.parent;
    } else {
      nextFiber = null;
    }
  }
}

function collectElements<T, P = T>(fiber: Fiber<T>, transform: (fiber: Fiber<T>) => P): Array<P> {
  const elements: Array<P> = [];

  walkFiber<T>(fiber, (nextFiber, isReturn, resetIsDeepWalking, stop) => {
    if (nextFiber === fiber.next || nextFiber === fiber.parent) return stop();
    if (!isReturn && nextFiber.element) {
      !platform.detectIsPortal(nextFiber.inst) && elements.push(transform(nextFiber));

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

function copyFiber<T = unknown>(fiber: Fiber<T>) {
  const rootCopyFiber = new Fiber().mutate(fiber, copyExcludeMap);
  let nextFiber = fiber;
  let copyFiber = rootCopyFiber;
  let isDeepWalking = true;
  const visitedMap: Record<number, boolean> = {};
  const detectCanVisit = (id: number) => !visitedMap[id];

  rootCopyFiber.child = null;
  rootCopyFiber.copy = null;

  while (nextFiber) {
    if (nextFiber.child && isDeepWalking && detectCanVisit(nextFiber.child.id)) {
      const newFiber = nextFiber.child;

      copyFiber.child = new Fiber().mutate(newFiber, copyExcludeMap);
      copyFiber.child.parent = copyFiber;
      copyFiber.child.child = null;
      copyFiber.child.next = null;
      copyFiber = copyFiber.child;

      nextFiber = newFiber;
      visitedMap[newFiber.id] = true;
    } else if (nextFiber.next && detectCanVisit(nextFiber.next.id)) {
      const newFiber = nextFiber.next;

      copyFiber.next = new Fiber().mutate(newFiber, copyExcludeMap);
      copyFiber.next.parent = copyFiber.parent;
      copyFiber.next.child = null;
      copyFiber.next.next = null;
      copyFiber = copyFiber.next;

      isDeepWalking = true;
      nextFiber = newFiber;
      visitedMap[newFiber.id] = true;
    } else if (nextFiber.parent && nextFiber.parent !== fiber) {
      isDeepWalking = false;
      nextFiber = nextFiber.parent;
      copyFiber = copyFiber.parent;
    } else {
      nextFiber = null;
    }
  }

  return rootCopyFiber;
}

const copyExcludeMap: Partial<Record<keyof Fiber, boolean>> = { alt: true };

export { walkFiber, collectElements, getFiberWithElement, detectIsFiberAlive, copyFiber };
