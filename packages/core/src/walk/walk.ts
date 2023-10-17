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

function tryOptimizeMemoTree(fiber: Fiber, alt: Fiber, scope$: Scope) {
  const actions = scope$.getActionsById(fiber.id);
  const canOptimize = (actions.move || actions.remove) && !actions.replace && !actions.insert;
  if (!canOptimize || !detectIsStableMemoTree(fiber, scope$)) return;
  const inst = fiber.inst as Component | TagVirtualNode;
  const startEidx = fiber.eidx;

  for (let i = 0; i < inst.children.length; i++) {
    const children = inst.children;
    const key = getKey(children[i], i);
    const fiber = actions.map[key];

    buildChildTree(children, alt, actions.map, i, startEidx);

    if (actions.move && actions.move[key]) {
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

function buildChildTree(children: Array<Inst>, alt: Fiber, map: Record<string, Fiber>, idx: number, startEidx: number) {
  const key = getKey(children[idx], idx);
  const prevKey = getKey(children[idx - 1], idx);
  const nextKey = getKey(children[idx + 1], idx);
  const fiber = map[key];
  const left = map[prevKey];
  const right = map[nextKey];
  const isFirst = idx === 0;
  const isLast = idx === children.length - 1;

  isFirst && (alt.child = fiber);
  fiber.tag = EffectTag.S;
  fiber.idx = idx;
  left ? (fiber.eidx = left.eidx + left.cec) : (fiber.eidx = startEidx);
  right && (fiber.next = right);
  isLast && delete fiber.next;
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

export { walkFiber, collectElements, getFiberWithElement, detectIsFiberAlive, createFiberSign, tryOptimizeMemoTree };
