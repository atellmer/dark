import { DELETE_EFFECT_TAG, EFFECT_HOST_MASK, CLEANUP_HOST_MASK, HOOK_DELIMETER } from '../constants';
import { type Hook, Fiber } from '../fiber';
import { type Callback } from '../shared';

function walk<T = unknown>(fiber: Fiber<T>, onWalk: (fiber: Fiber<T>, skip: () => void, stop: () => void) => void) {
  let shouldDeep = true;
  let shouldStop = false;
  const skip = () => (shouldDeep = false);
  const stop = () => (shouldStop = true);
  const stack: Array<Fiber<T>> = [fiber];

  while (stack.length !== 0) {
    const unit = stack.pop();

    onWalk(unit, skip, stop);
    if (shouldStop) break;
    unit !== fiber && unit.next && stack.push(unit.next);
    shouldDeep && unit.child && stack.push(unit.child);
    shouldDeep = true;
  }
}

function collectElements<T, P = T>(fiber: Fiber<T>, transform: (fiber: Fiber<T>) => P): Array<P> {
  const elements: Array<P> = [];

  walk<T>(fiber, onWalkInCollectElements(elements, transform));

  return elements;
}

function onWalkInCollectElements<T, P = T>(elements: Array<P>, transform: (fiber: Fiber<T>) => P) {
  return (fiber: Fiber<T>, skip: Callback) => {
    if (fiber.el) {
      !fiber.hook?.getIsPortal() && elements.push(transform(fiber));
      return skip();
    }
  };
}

function getFiberWithElement<T1, T2 = T1>(fiber: Fiber<T1>): Fiber<T2> {
  let $fiber = fiber as unknown as Fiber<T2>;

  while ($fiber) {
    if ($fiber.el) return $fiber;
    $fiber = $fiber.parent;
  }

  return $fiber;
}

function detectIsFiberAlive(fiber: Fiber) {
  let $fiber = fiber;

  while ($fiber) {
    if ($fiber.tag === DELETE_EFFECT_TAG) return false;
    $fiber = $fiber.parent;
  }

  return Boolean(fiber);
}

function getSuspense(fiber: Fiber, isPending: boolean) {
  let suspense = fiber;

  while (suspense) {
    if (suspense.hook?.getIsSuspense() && (isPending ? suspense.hook.getIsPending() : true)) return suspense;
    suspense = suspense.parent;
  }

  return null;
}

function resolveSuspense(fiber: Fiber): Fiber {
  return getSuspense(fiber, true) || getSuspense(fiber, false) || null;
}

function resolveBoundary(fiber: Fiber): Fiber {
  let boundary = fiber;

  while (boundary) {
    if (boundary.hook?.getIsBoundary()) return boundary;
    boundary = boundary.parent;
  }

  return null;
}

function createHookLoc(rootId: number, idx: number, hook: Hook) {
  const fiber = hook.owner;
  let $fiber = fiber;
  let loc = `${fiber.idx}${HOOK_DELIMETER}${idx}`;

  while ($fiber) {
    $fiber = $fiber.parent;
    $fiber && (loc = `${$fiber.idx}.${loc}`);
  }

  loc = `[${rootId}]${loc}`;

  return loc;
}

const createLoc = (rootId: number, idx: number, hook: Hook) => () => createHookLoc(rootId, idx, hook);

function notifyParents(fiber: Fiber, alt: Fiber = fiber) {
  fiber.increment(alt.el ? 1 : alt.cec);
  alt.mask & EFFECT_HOST_MASK && fiber.markHost(EFFECT_HOST_MASK);
  alt.mask & CLEANUP_HOST_MASK && fiber.markHost(CLEANUP_HOST_MASK);
}

export {
  walk,
  collectElements,
  getFiberWithElement,
  detectIsFiberAlive,
  resolveSuspense,
  resolveBoundary,
  createHookLoc,
  createLoc,
  notifyParents,
};
