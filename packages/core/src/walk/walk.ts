import { type Fiber, EffectTag } from '../fiber';
import { platform } from '../platform';
import { getElementKey, hasChildrenProp } from '../view';
import { type Scope } from '../scope';
import { type Component } from '../component';
import { detectIsMemo } from '../memo/utils';

function walkFiber<T = unknown>(
  fiber: Fiber<T>,
  onLoop: (nextFiber: Fiber<T>, isReturn: boolean, resetIsDeepWalking: () => void, stop: () => void) => void,
) {
  let nextFiber = fiber;
  let isDeepWalking = true;
  let isReturn = false;
  let isStopped = false;
  const visits: Record<number, boolean> = {};
  const detectCanVisit = (id: number) => !visits[id];
  const resetIsDeepWalking = () => (isDeepWalking = false);
  const stop = () => (isStopped = true);

  while (nextFiber) {
    onLoop(nextFiber, isReturn, resetIsDeepWalking, stop);
    if (isStopped) break;
    if (nextFiber.child && isDeepWalking && detectCanVisit(nextFiber.child.id)) {
      isReturn = false;
      nextFiber = nextFiber.child; // !
      visits[nextFiber.id] = true;
    } else if (nextFiber.next && detectCanVisit(nextFiber.next.id)) {
      isDeepWalking = true;
      isReturn = false;
      nextFiber = nextFiber.next; // !
      visits[nextFiber.id] = true;
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

function createFiberSign(fiber: Fiber, hook?: number) {
  let fiber$ = fiber;
  let sign = fiber.idx + (hook ? `:${hook}` : '');

  while (fiber$) {
    fiber$ = fiber$.parent;
    fiber$ && (sign = `${fiber$.idx}.${sign}`);
  }

  return sign;
}

function detectIsStableMemoChildren(fiber: Fiber, scope$: Scope) {
  if (!hasChildrenProp(fiber.inst)) return;
  const actions = scope$.getActionsById(fiber.id);

  for (let i = 0; i < fiber.inst.children.length; i++) {
    const inst = fiber.inst.children[i];
    const key = getElementKey(inst);
    if (key === null) return false;
    const alt = actions.map[key];
    if (!alt) return false;
    const pc = alt.inst as Component;
    const nc = inst as Component;
    const isStable = detectIsMemo(nc) && detectIsMemo(pc) && nc.type === pc.type && !nc.su(pc.props, nc.props);

    if (!isStable) return false;
  }

  return true;
}

function tryOptimizeRemoves(fiber: Fiber, alt: Fiber, scope$: Scope) {
  const actions = scope$.getActionsById(fiber.id);
  const keys = Object.keys(actions.remove);
  const canOptimize =
    alt.cc > 1 && keys.length < alt.cc / 2 && actions.remove && !actions.move && !actions.replace && !actions.insert;
  if (!canOptimize) return;
  const isStable = detectIsStableMemoChildren(fiber, scope$);
  if (!isStable) return;

  for (const key of keys) {
    const fibers: Array<Fiber> = [];
    const removed = actions.map[key];
    const { idx, cec } = removed;
    let fiber$ = alt.child;

    while (fiber$) {
      fibers.push(fiber$);
      fiber$.tag = EffectTag.S;
      if (idx < fiber$.idx) {
        fiber$.idx = fiber$.idx - 1;
        fiber$.eidx = fiber$.eidx - cec;
      }
      fiber$ = fiber$.next;
    }

    if (idx === 0) {
      alt.child = fibers[1];
    } else if (fibers[idx + 1]) {
      fibers[idx - 1].next = fibers[idx + 1];
    } else {
      delete fibers[idx - 1].next;
    }

    removed.tag = EffectTag.D;
  }

  fiber.child = alt.child;
  fiber.child.parent = fiber;
  scope$.setMountDeep(false);
}

// if (moves.length > 0) {
//   const [nextKey, prevKey] = moves[0];
//   const fiberOne = keyedFibersMap[nextKey];
//   const fiberTwo = keyedFibersMap[prevKey];
//   const fibers = [];
//   let nextFiber = alt.child;

//   while (nextFiber) {
//     fibers.push(nextFiber);
//     nextFiber.tag = EffectTag.S;
//     nextFiber = nextFiber.next;
//   }

//   const idx1 = fiberOne.idx;
//   const idx2 = fiberTwo.idx;
//   const eidx1 = fiberOne.eidx;
//   const eidx2 = fiberTwo.eidx;

//   if (idx1 === 0) {
//     alt.child = fiberTwo;
//   } else {
//     fibers[idx1 - 1].next = fiberTwo;
//   }

//   fiberTwo.next = fibers[idx1 + 1];

//   fibers[idx2 - 1].next = fiberOne;
//   fiberOne.next = fibers[idx2 + 1];

//   fiberOne.idx = idx2;
//   fiberTwo.idx = idx1;
//   fiberOne.eidx = eidx2;
//   fiberTwo.eidx = eidx1;
//   fiberOne.move = true;
//   fiberTwo.move = true;
//   fiberOne.tag = EffectTag.U;
//   fiberTwo.tag = EffectTag.U;

//   scope$.addCandidate(fiberOne);
//   scope$.addCandidate(fiberTwo);

//   //console.log('---moves---', alt.child);
//   fiber.child = alt.child;
//   fiber.child.parent = fiber;
//   scope$.setMountDeep(false);
// }

function tryOptimizeMoves(fiber: Fiber, alt: Fiber, scope$: Scope) {}

export {
  walkFiber,
  collectElements,
  getFiberWithElement,
  detectIsFiberAlive,
  createFiberSign,
  tryOptimizeRemoves,
  tryOptimizeMoves,
};
