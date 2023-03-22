import { type Fiber } from '../fiber';

type OnLoopOptions<T> = {
  nextFiber: Fiber<T>;
  isReturn: boolean;
  resetIsDeepWalking: () => void;
  stop: () => void;
};

const options: OnLoopOptions<any> = {
  nextFiber: null,
  isReturn: null,
  resetIsDeepWalking: null,
  stop: null,
};

function walkFiber<T = unknown>(fiber: Fiber<T>, onLoop: (options: OnLoopOptions<T>) => void) {
  let nextFiber = fiber;
  let isDeepWalking = true;
  let isReturn = false;
  let isStopped = false;
  const visitedMap: Record<number, boolean> = {};
  const detectCanVisit = (id: number) => !visitedMap[id];
  const resetIsDeepWalking = () => (isDeepWalking = false);
  const stop = () => (isStopped = true);

  while (nextFiber) {
    options.nextFiber = nextFiber;
    options.isReturn = isReturn;
    options.resetIsDeepWalking = resetIsDeepWalking;
    options.stop = stop;

    onLoop(options);

    if (isStopped) {
      break;
    }

    if (nextFiber.child && isDeepWalking && detectCanVisit(nextFiber.child.id)) {
      const newFiber = nextFiber.child;

      isReturn = false;
      nextFiber = newFiber;
      visitedMap[newFiber.id] = true;
    } else if (nextFiber.nextSibling && detectCanVisit(nextFiber.nextSibling.id)) {
      const newFiber = nextFiber.nextSibling;

      isDeepWalking = true;
      isReturn = false;
      nextFiber = newFiber;
      visitedMap[newFiber.id] = true;
    } else if (
      nextFiber.parent &&
      nextFiber.parent === fiber &&
      nextFiber.parent.nextSibling &&
      detectCanVisit(nextFiber.parent.nextSibling.id)
    ) {
      const newFiber = nextFiber.parent.nextSibling;

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

export { walkFiber };
