import {
  EFFECT_TAG_DELETE,
  EFFECT_TAG_UPDATE,
  EFFECT_TAG_SKIP,
  MASK_INSERTION_EFFECT_HOST,
  MASK_LAYOUT_EFFECT_HOST,
  MASK_ASYNC_EFFECT_HOST,
  MASK_ATOM_HOST,
  MASK_PORTAL_HOST,
  MASK_MOVE,
} from '../constants';
import { Fiber } from '../fiber';
import { platform } from '../platform';
import { type TagVirtualNode, getElementKey, hasChildrenProp } from '../view';
import { type Scope } from '../scope';
import { type Component } from '../component';
import { detectIsMemo } from '../memo/utils';
import { type Instance, type ElementKey } from '../shared';
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
  let $fiber = fiber as unknown as Fiber<T2>;

  while ($fiber) {
    if ($fiber.element) return $fiber;
    $fiber = $fiber.parent;
  }

  return $fiber;
}

function detectIsFiberAlive(fiber: Fiber) {
  let $fiber = fiber;

  while ($fiber) {
    if ($fiber.tag === EFFECT_TAG_DELETE) return false;
    $fiber = $fiber.parent;
  }

  return Boolean(fiber);
}

function createFiberSign(fiber: Fiber, hook?: number) {
  let $fiber = fiber;
  let sign = fiber.idx + (hook ? `:${hook}` : '');

  while ($fiber) {
    $fiber = $fiber.parent;
    $fiber && (sign = `${$fiber.idx}.${sign}`);
  }

  return sign;
}

function detectIsStableMemoTree(fiber: Fiber, $scope: Scope) {
  if (!hasChildrenProp(fiber.inst)) return;
  const actions = $scope.getActionsById(fiber.id);
  const children = fiber.inst.children;

  for (let i = 0; i < children.length; i++) {
    const inst = children[i];
    const key = getElementKey(inst);
    if (key === null) return false;
    const alt = actions.map[key];
    if (!alt) return false;
    const pc = alt.inst as Component;
    const nc = inst as Component;
    const isStable =
      detectIsMemo(nc) && detectIsMemo(pc) && nc.type === pc.type && !nc.shouldUpdate(pc.props, nc.props);

    if (!isStable) return false;
  }

  return true;
}

function tryOptStaticSlot(fiber: Fiber, alt: Fiber, $scope: Scope) {
  const actions = $scope.getActionsById(fiber.id);
  const inst = fiber.inst as Component | TagVirtualNode;

  alt.element && (fiber.element = alt.element); //!

  for (let i = 0; i < inst.children.length; i++) {
    buildChildNode(inst.children, fiber, actions.map, i, fiber.eidx);
  }

  fiber.cc = inst.children.length;
  $scope.setMountDeep(false);
}

function tryOptMemoSlot(fiber: Fiber, alt: Fiber, $scope: Scope) {
  const actions = $scope.getActionsById(fiber.id);
  const hasMove = Boolean(actions.move);
  const hasRemove = Boolean(actions.remove);
  const hasInsert = Boolean(actions.insert);
  const hasReplace = Boolean(actions.insert);
  const canOptimize = ((hasMove && !hasRemove) || (hasRemove && !hasMove)) && !hasInsert && !hasReplace;

  if (!canOptimize || !detectIsStableMemoTree(fiber, $scope)) return;

  hasMove && tryOptMov(fiber, alt, $scope);
  hasRemove && tryOptRem(fiber, alt, $scope);
}

function tryOptMov(fiber: Fiber, alt: Fiber, $scope: Scope) {
  const actions = $scope.getActionsById(fiber.id);

  buildChildNodes(fiber, alt, $scope, (fiber, key) => {
    if (!actions.move[key]) return;
    fiber.alt = new Fiber().mutate(fiber);
    fiber.tag = EFFECT_TAG_UPDATE;
    fiber.mask |= MASK_MOVE;
    $scope.addCandidate(fiber);
  });
}

function tryOptRem(fiber: Fiber, alt: Fiber, $scope: Scope) {
  buildChildNodes(fiber, alt, $scope);
}

function buildChildNodes(fiber: Fiber, alt: Fiber, $scope: Scope, onNode?: (fiber: Fiber, key: ElementKey) => void) {
  const actions = $scope.getActionsById(fiber.id);
  const inst = fiber.inst as Component | TagVirtualNode;
  const children = inst.children;

  alt.element && (fiber.element = alt.element); //!

  for (let i = 0; i < children.length; i++) {
    const key = getKey(children[i], i);
    const $fiber = actions.map[key];

    buildChildNode(children, fiber, actions.map, i, fiber.eidx);
    onNode && onNode($fiber, key);
  }

  fiber.cc = children.length;
  $scope.setMountDeep(false);
}

function buildChildNode(
  children: Array<Instance>,
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
  fiber.tag = EFFECT_TAG_SKIP;
  fiber.idx = idx;
  left ? (fiber.eidx = left.eidx + (left.element ? 1 : left.cec)) : (fiber.eidx = startEidx);
  right && (fiber.next = right);
  isLast && (fiber.next = null);
  notifyParents(fiber);
}

function getKey(inst: Instance, idx: number) {
  const key = getElementKey(inst);
  return key !== null ? key : createIndexKey(idx);
}

function notifyParents(fiber: Fiber, alt: Fiber = fiber) {
  fiber.increment(alt.element ? 1 : alt.cec);
  alt.mask & MASK_INSERTION_EFFECT_HOST && fiber.markHost(MASK_INSERTION_EFFECT_HOST);
  alt.mask & MASK_LAYOUT_EFFECT_HOST && fiber.markHost(MASK_LAYOUT_EFFECT_HOST);
  alt.mask & MASK_ASYNC_EFFECT_HOST && fiber.markHost(MASK_ASYNC_EFFECT_HOST);
  alt.mask & MASK_ATOM_HOST && fiber.markHost(MASK_ATOM_HOST);
  alt.mask & MASK_PORTAL_HOST && fiber.markHost(MASK_PORTAL_HOST);
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
