import { Fiber, EffectTag } from '../fiber';
import { platform } from '../platform';
import { type TagVirtualNode, getElementKey, hasChildrenProp } from '../view';
import { type Scope } from '../scope';
import { type Component } from '../component';
import { detectIsMemo } from '../memo/utils';
import { type DarkElementInstance as Inst } from '../shared';
import { createIndexKey } from '../helpers';

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

function detectIsStableMemoTree(fiber: Fiber, scope$: Scope) {
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
  const isStable = detectIsStableMemoTree(fiber, scope$);
  if (!isStable) return;

  for (const key of keys) {
    const fibers: Array<Fiber> = [];
    const fiber = actions.map[key];
    const { idx, cec } = fiber;
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

    const left = fibers[idx - 1];
    const right = fibers[idx + 1];

    if (idx === 0) {
      alt.child = fibers[1];
    } else if (right) {
      left.next = right;
    } else {
      delete left.next;
    }

    fiber.tag = EffectTag.D;
  }

  stopMounting(fiber, alt, scope$);
}

function tryOptimizeMoves(fiber: Fiber, alt: Fiber, scope$: Scope) {
  const actions = scope$.getActionsById(fiber.id);
  const canOptimize = actions.move && !actions.remove && !actions.replace && !actions.insert;
  if (!canOptimize) return;
  const isStable = detectIsStableMemoTree(fiber, scope$);
  if (!isStable) return;
  const inst = fiber.inst as Component | TagVirtualNode;
  const parentEidx = fiber.eidx;

  for (let i = 0; i < inst.children.length; i++) {
    const children = inst.children;
    const key = getKey(children[i], i);
    const prevKey = getKey(children[i - 1], i);
    const nextKey = getKey(children[i + 1], i);
    const fiber = actions.map[key];
    const left = actions.map[prevKey];
    const right = actions.map[nextKey];

    i === 0 && (alt.child = fiber);
    fiber.tag = EffectTag.S;
    fiber.idx = i;
    left ? (fiber.eidx = left.eidx + left.cec) : (fiber.eidx = parentEidx);
    right && (fiber.next = right);

    if (actions.move[key]) {
      fiber.tag = EffectTag.U;
      fiber.move = true;
      fiber.alt = new Fiber().mutate(fiber);
      scope$.addCandidate(fiber);
    } else {
      fiber.tag = EffectTag.S;
    }
  }

  stopMounting(fiber, alt, scope$);
}

function getKey(inst: Inst, idx: number) {
  const key = getElementKey(inst);
  return key !== null ? key : createIndexKey(idx);
}

function stopMounting(fiber: Fiber, alt: Fiber, scope$: Scope) {
  fiber.child = alt.child;
  fiber.child.parent = fiber;
  scope$.setMountDeep(false);
}

export {
  walkFiber,
  collectElements,
  getFiberWithElement,
  detectIsFiberAlive,
  createFiberSign,
  tryOptimizeRemoves,
  tryOptimizeMoves,
};
