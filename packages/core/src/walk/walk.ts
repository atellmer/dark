import { Fiber, EffectTag } from '../fiber';
import { platform } from '../platform';
import { type TagVirtualNode, getElementKey, hasChildrenProp } from '../view';
import { type Scope } from '../scope';
import { type Component } from '../component';
import { detectIsMemo } from '../memo/utils';
import { type DarkElementInstance as Inst } from '../shared';
import { createIndexKey } from '../helpers';

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

  walk<T>(fiber, (fiber, skip) => {
    if (fiber.element) {
      !platform.detectIsPortal(fiber.inst) && elements.push(transform(fiber));
      return skip();
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

function tryOptStaticSlot(fiber: Fiber, alt: Fiber, scope$: Scope) {
  const actions = scope$.getActionsById(fiber.id);
  const inst = fiber.inst as Component | TagVirtualNode;

  alt.element && (fiber.element = alt.element); //!

  for (let i = 0; i < inst.children.length; i++) {
    buildChildTree(inst.children, fiber, actions.map, i, fiber.eidx);
  }

  fiber.cc = inst.children.length;
  scope$.setMountDeep(false);
}

function tryOptMemoSlot(fiber: Fiber, alt: Fiber, scope$: Scope) {
  const actions = scope$.getActionsById(fiber.id);
  const canOptimize = (actions.move || actions.remove) && !actions.replace && !actions.insert;
  if (!canOptimize || !detectIsStableMemoTree(fiber, scope$)) return;
  const inst = fiber.inst as Component | TagVirtualNode;

  alt.element && (fiber.element = alt.element); //!

  for (let i = 0; i < inst.children.length; i++) {
    const children = inst.children;
    const key = getKey(children[i], i);
    const fiber$ = actions.map[key];

    buildChildTree(children, fiber, actions.map, i, fiber.eidx);

    if (actions.move && actions.move[key]) {
      fiber.alt = new Fiber().mutate(fiber);
      fiber$.tag = EffectTag.U;
      fiber$.move = true;
      scope$.addCandidate(fiber$);
    }
  }

  fiber.cc = inst.children.length;
  scope$.setMountDeep(false);
}

function buildChildTree(
  children: Array<Inst>,
  parent: Fiber,
  altMap: Record<string, Fiber>,
  idx: number,
  startEidx: number,
) {
  const prevIdx = idx - 1;
  const nextIdx = idx + 1;
  const key = getKey(children[idx], idx);
  const prevKey = getKey(children[prevIdx], prevIdx);
  const nextKey = getKey(children[nextIdx], nextIdx);
  const fiber = altMap[key];
  const left = altMap[prevKey];
  const right = altMap[nextKey];
  const isFirst = idx === 0;
  const isLast = idx === children.length - 1;

  isFirst && (parent.child = fiber);
  fiber.alt = null;
  fiber.parent = parent;
  fiber.tag = EffectTag.S;
  fiber.idx = idx;
  left ? (fiber.eidx = left.eidx + (left.element ? 1 : left.cec)) : (fiber.eidx = startEidx);
  right && (fiber.next = right);
  isLast && delete fiber.next;
  notifyParents(fiber);
}

function getKey(inst: Inst, idx: number) {
  const key = getElementKey(inst);
  return key !== null ? key : createIndexKey(idx);
}

function notifyParents(fiber: Fiber, alt: Fiber = fiber) {
  fiber.incChildElementCount(alt.element ? 1 : alt.cec);
  alt.aefHost && fiber.markAsyncEffectHost();
  alt.lefHost && fiber.markLayoutEffectHost();
  alt.iefHost && fiber.markInsertionEffectHost();
  alt.atomHost && fiber.markAtomHost();
  alt.portalHost && fiber.markPortalHost();
}

export {
  walk,
  collectElements,
  getFiberWithElement,
  detectIsFiberAlive,
  createFiberSign,
  tryOptStaticSlot,
  tryOptMemoSlot,
  notifyParents,
};
