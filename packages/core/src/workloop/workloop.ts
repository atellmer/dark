import { platform } from '../platform';
import {
  CREATE_EFFECT_TAG,
  UPDATE_EFFECT_TAG,
  DELETE_EFFECT_TAG,
  SKIP_EFFECT_TAG,
  INSERTION_EFFECT_HOST_MASK,
  LAYOUT_EFFECT_HOST_MASK,
  ASYNC_EFFECT_HOST_MASK,
  ATOM_HOST_MASK,
  PORTAL_HOST_MASK,
  MOVE_MASK,
  FLUSH_MASK,
  SHADOW_MASK,
  Flag,
} from '../constants';
import {
  flatten,
  error,
  detectIsEmpty,
  detectIsFalsy,
  detectIsArray,
  detectIsFunction,
  detectIsTextBased,
  createIndexKey,
  trueFn,
} from '../utils';
import { type Scope, setRootId, $$scope, replaceScope } from '../scope';
import { type Component, detectIsComponent } from '../component';
import { type ElementKey, type Instance } from '../shared';
import { Fiber, getHook, Hook } from '../fiber';
import {
  Text,
  detectIsVirtualNode,
  detectIsVirtualNodeFactory,
  getElementKey,
  hasElementFlag,
  hasChildrenProp,
  detectIsReplacer,
  createReplacer,
  detectAreSameInstanceTypes,
} from '../view';
import { detectIsMemo } from '../memo';
import {
  walk,
  getFiberWithElement,
  detectIsFiberAlive,
  notifyParents,
  tryOptStaticSlot,
  tryOptMemoSlot,
} from '../walk';
import { type RestoreOptions, scheduler } from '../scheduler';
import { Fragment, detectIsFragment } from '../fragment';
import { unmountFiber } from '../unmount';

let hasPendingPromise = false;
let hasRenderError = false;

export type WorkLoop = (isAsync: boolean) => boolean;

function workLoop(isAsync: boolean): boolean | null {
  if (hasPendingPromise) return null;
  if (hasRenderError) return false;
  const $scope = $$scope();
  const wipFiber = $scope.getWorkInProgress();
  let unit = $scope.getNextUnitOfWork();
  let shouldYield = false;
  let hasMoreWork = Boolean(unit);

  try {
    while (unit && !shouldYield) {
      unit = performUnitOfWork(unit, $scope);
      $scope.setNextUnitOfWork(unit);
      hasMoreWork = Boolean(unit);
      shouldYield = isAsync && scheduler.shouldYield();
      if (shouldYield && scheduler.hasPrimaryTask()) return fork($scope);
    }

    if (!unit && wipFiber) {
      commit($scope);
    }
  } catch (err) {
    if (err instanceof Promise) {
      hasPendingPromise = true;
      err.finally(() => {
        hasPendingPromise = false;
        !isAsync && workLoop(false);
      });
    } else {
      hasRenderError = true;
      throw err;
    }
  }

  return hasMoreWork;
}

function performUnitOfWork(fiber: Fiber, $scope: Scope): Fiber | null {
  const wipFiber = $scope.getWorkInProgress();
  const isDeepWalking = $scope.getMountDeep();
  const isStream = $scope.getIsStreamZone();
  const hasChildren = isDeepWalking && hasChildrenProp(fiber.inst) && fiber.inst.children.length > 0;

  fiber.hook && (fiber.hook.idx = 0);

  if (hasChildren) {
    const child = mountChild(fiber, $scope);

    isStream && platform.chunk(child);

    return child;
  } else {
    while (fiber.parent && fiber !== wipFiber) {
      const next = mountSibling(fiber, $scope);

      isStream && platform.chunk(fiber);

      if (next) {
        isStream && platform.chunk(next);
        return next;
      }

      fiber = fiber.parent;
    }
  }

  return null;
}

function mountChild(parent: Fiber, $scope: Scope) {
  $scope.navToChild();
  const $inst = parent.inst;
  const idx = 0;
  const inst = hasChildrenProp($inst) ? $inst.children[idx] : null;
  const alt = getAlternate(parent, inst, idx, $scope);
  const fiber = createFiber(alt, inst, idx);

  fiber.parent = parent;
  parent.child = fiber;
  fiber.eidx = parent.element ? 0 : parent.eidx;

  share(fiber, parent, inst, $scope);

  return fiber;
}

function mountSibling(left: Fiber, $scope: Scope) {
  $scope.navToSibling();
  const $inst = left.parent.inst;
  const idx = $scope.getMountIndex();
  const inst = hasChildrenProp($inst) && $inst.children ? $inst.children[idx] : null;
  const hasSibling = Boolean(inst);

  if (!hasSibling) {
    $scope.navToParent();
    $scope.setMountDeep(false);

    return null;
  }

  $scope.setMountDeep(true);
  const alt = getAlternate(left, inst, idx, $scope);
  const fiber = createFiber(alt, inst, idx);

  fiber.parent = left.parent;
  left.next = fiber;
  fiber.eidx = left.eidx + (left.element ? 1 : left.cec);

  share(fiber, left, inst, $scope);

  return fiber;
}

function share(fiber: Fiber, prev: Fiber, inst: Instance, $scope: Scope) {
  const { alt } = fiber;
  const shouldMount = alt && detectIsMemo(inst) ? shouldUpdate(fiber, inst, $scope) : true;

  $scope.setCursorFiber(fiber);
  fiber.inst = inst;

  if (alt && alt.mask & MOVE_MASK) {
    fiber.mask |= MOVE_MASK;
    alt.mask &= ~MOVE_MASK;
  }

  fiber.hook && (fiber.hook.owner = fiber); // !

  if (shouldMount) {
    fiber.inst = mount(fiber, prev, $scope);
    alt && reconcile(fiber, alt, $scope);
    setup(fiber, alt);
  } else if (fiber.mask & MOVE_MASK) {
    fiber.tag = UPDATE_EFFECT_TAG;
  }

  $scope.addCandidate(fiber); // !
}

function createFiber(alt: Fiber, inst: Instance, idx: number) {
  const fiber = new Fiber(getHook(alt, alt ? alt.inst : null, inst), alt ? alt.provider : null, idx);

  fiber.alt = alt || null;

  return fiber;
}

function getAlternate(fiber: Fiber, inst: Instance, idx: number, $scope: Scope) {
  const isChild = idx === 0;
  const key = getElementKey(inst);
  const parentId = isChild ? fiber.id : fiber.parent.id;
  const actions = $scope.getActionsById(parentId);
  let alt: Fiber = null;

  if (key !== null && actions) {
    const isMove = actions.move && Boolean(actions.move[key]);
    const isStable = actions.stable && Boolean(actions.stable[key]);

    if (isMove || isStable) {
      alt = actions.map[key];
      isMove && (alt.mask |= MOVE_MASK);
    }
  } else {
    if (fiber.alt) {
      alt = isChild ? fiber.alt.child : fiber.alt.next;
    } else {
      alt = actions ? actions.map[createIndexKey(idx)] || null : null;
    }
  }

  return alt;
}

function reconcile(fiber: Fiber, alt: Fiber, $scope: Scope) {
  const { id, inst } = fiber;
  const areSameTypes = detectAreSameInstanceTypes(alt.inst, inst);

  if (!areSameTypes) {
    $scope.addDeletion(alt);
  } else if (hasChildrenProp(alt.inst) && hasChildrenProp(inst) && alt.cc !== 0) {
    const hasSameCount = alt.cc === inst.children.length;
    const check = hasElementFlag(inst, Flag.SKIP_SCAN_OPT) ? !hasSameCount : true;

    if (check) {
      const { prevKeys, nextKeys, prevKeysMap, nextKeysMap, keyedFibersMap } = extractKeys(alt.child, inst.children);
      const flush = nextKeys.length === 0;
      let size = Math.max(prevKeys.length, nextKeys.length);
      let p = 0;
      let n = 0;

      $scope.addActionMap(id, keyedFibersMap);

      for (let i = 0; i < size; i++) {
        const nextKey = nextKeys[i - n] ?? null;
        const prevKey = prevKeys[i - p] ?? null;
        const prevKeyFiber = keyedFibersMap[prevKey] || null;

        if (nextKey !== prevKey) {
          if (nextKey !== null && !prevKeysMap[nextKey]) {
            if (prevKey !== null && !nextKeysMap[prevKey]) {
              $scope.addReplaceAction(id, nextKey);
              $scope.addDeletion(prevKeyFiber);
            } else {
              $scope.addInsertAction(id, nextKey);
              p++;
              size++;
            }
          } else if (!nextKeysMap[prevKey]) {
            $scope.addRemoveAction(id, prevKey);
            $scope.addDeletion(prevKeyFiber);
            flush && (prevKeyFiber.mask |= FLUSH_MASK);
            n++;
            size++;
          } else if (nextKeysMap[prevKey] && nextKeysMap[nextKey]) {
            $scope.addMoveAction(id, nextKey);
          }
        } else if (nextKey !== null) {
          $scope.addStableAction(id, nextKey);
        }
      }

      hasElementFlag(inst, Flag.STATIC_SLOT_OPT) && tryOptStaticSlot(fiber, alt, $scope);
      hasElementFlag(inst, Flag.MEMO_SLOT_OPT) && tryOptMemoSlot(fiber, alt, $scope);
    }
  }
}

function setup(fiber: Fiber, alt: Fiber) {
  const inst = fiber.inst;
  let isUpdate = false;

  fiber.parent.tag === CREATE_EFFECT_TAG && (fiber.tag = fiber.parent.tag);
  fiber.parent.mask & SHADOW_MASK && !fiber.parent.element && !detectIsReplacer(inst) && (fiber.mask |= SHADOW_MASK);
  isUpdate =
    alt &&
    fiber.tag !== CREATE_EFFECT_TAG &&
    detectAreSameInstanceTypes(alt.inst, inst) &&
    getElementKey(alt.inst) === getElementKey(inst);
  isUpdate && !fiber.element && alt.element && (fiber.element = alt.element);
  fiber.tag = isUpdate ? UPDATE_EFFECT_TAG : CREATE_EFFECT_TAG;
  hasChildrenProp(fiber.inst) && (fiber.cc = fiber.inst.children.length);
  !fiber.element && detectIsVirtualNode(fiber.inst) && (fiber.element = platform.createElement(fiber.inst));
  fiber.element && fiber.increment();
}

function shouldUpdate(fiber: Fiber, inst: Instance, $scope: Scope) {
  if (process.env.NODE_ENV !== 'production') {
    if ($scope.getIsHot()) return true;
  }

  const alt = fiber.alt;
  const pc = alt.inst as Component;
  const nc = inst as Component;

  if (nc.type !== pc.type || nc.shouldUpdate(pc.props, nc.props)) return true;

  $scope.setMountDeep(false);
  fiber.tag = SKIP_EFFECT_TAG;
  fiber.child = alt.child;
  fiber.child.parent = fiber;
  fiber.hook = alt.hook;
  fiber.cc = alt.cc;
  fiber.cec = alt.cec;
  alt.element && (fiber.element = alt.element);
  alt.provider && (fiber.provider = alt.provider);
  alt.catch && (fiber.catch = alt.catch);
  alt.atoms && (fiber.atoms = alt.atoms);

  const diff = fiber.eidx - alt.eidx;
  const deep = diff !== 0;

  if (deep) {
    walk(fiber.child, ($fiber, skip) => {
      $fiber.eidx += diff;
      if ($fiber.element) return skip();
    });
  }

  notifyParents(fiber, alt);

  return false;
}

function mount(fiber: Fiber, prev: Fiber, $scope: Scope) {
  let inst = fiber.inst;
  const isComponent = detectIsComponent(inst);
  const component = inst as Component;

  if (isComponent) {
    try {
      const id = $scope.getResourceId();
      let result = component.type(component.props, component.ref);
      const defers = $scope.getDefers();

      if (defers.length > 0) {
        const promise = Promise.all(defers.map(x => x()));

        $scope.setResourceId(id);
        $scope.resetDefers();
        $scope.navToPrev();
        $scope.setNextUnitOfWork(prev);
        Fiber.setNextId(prev.id);

        throw promise;
      }

      if (detectIsArray(result)) {
        !detectIsFragment(component) && (result = Fragment({ slot: result }));
      } else if (detectIsTextBased(result)) {
        result = Text(result);
      }

      component.children = result as Array<Instance>;
      platform.detectIsPortal(inst) && fiber.markHost(PORTAL_HOST_MASK);
    } catch (err) {
      if (err instanceof Promise) throw err;
      component.children = [];
      fiber.setError(err);
      error(err);
    }
  } else if (detectIsVirtualNodeFactory(inst)) {
    inst = inst();
  }

  if (hasChildrenProp(inst)) {
    inst.children = flatten(inst.children, x => (detectIsTextBased(x) ? Text(x) : x || supportConditional(x)));
    isComponent && component.children.length === 0 && component.children.push(createReplacer());
  }

  return inst;
}

function extractKeys(alt: Fiber, children: Array<Instance>) {
  let nextFiber = alt;
  let idx = 0;
  const prevKeys: Array<ElementKey> = [];
  const nextKeys: Array<ElementKey> = [];
  const prevKeysMap: Record<ElementKey, boolean> = {};
  const nextKeysMap: Record<ElementKey, boolean> = {};
  const keyedFibersMap: Record<ElementKey, Fiber> = {};
  const usedKeysMap: Record<ElementKey, boolean> = {};

  while (nextFiber || idx < children.length) {
    if (nextFiber) {
      const key = getElementKey(nextFiber.inst);
      const prevKey = detectIsEmpty(key) ? createIndexKey(idx) : key;

      if (!prevKeysMap[prevKey]) {
        prevKeysMap[prevKey] = true; // !
        prevKeys.push(prevKey);
      }

      keyedFibersMap[prevKey] = nextFiber;
    }

    if (children[idx]) {
      const inst = children[idx];
      const key = getElementKey(inst);
      const nextKey = detectIsEmpty(key) ? createIndexKey(idx) : key;

      if (process.env.NODE_ENV !== 'production') {
        if (usedKeysMap[nextKey]) {
          error(`[Dark]: the key of node [${nextKey}] already has been used!`, [inst]);
        }
      }

      if (!nextKeysMap[nextKey]) {
        nextKeysMap[nextKey] = true; // !
        nextKeys.push(nextKey);
      }

      usedKeysMap[nextKey] = true;
    }

    nextFiber = nextFiber ? nextFiber.next : null;
    idx++;
  }

  return {
    prevKeys,
    nextKeys,
    prevKeysMap,
    nextKeysMap,
    keyedFibersMap,
  };
}

function supportConditional(inst: Instance) {
  return detectIsFalsy(inst) ? createReplacer() : inst;
}

function commit($scope: Scope) {
  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_ENV === 'development' && $scope.setIsHot(false);
  }

  const wipFiber = $scope.getWorkInProgress();
  const deletions = $scope.getDeletions();
  const candidates = $scope.getCandidates();
  const isUpdateZone = $scope.getIsUpdateZone();
  const unmounts: Array<Fiber> = [];
  const combinedMask = INSERTION_EFFECT_HOST_MASK | LAYOUT_EFFECT_HOST_MASK | ASYNC_EFFECT_HOST_MASK | PORTAL_HOST_MASK;

  // !
  for (const fiber of deletions) {
    const withNextTick = fiber.mask & ATOM_HOST_MASK && !(fiber.mask & combinedMask);

    withNextTick ? unmounts.push(fiber) : unmountFiber(fiber);
    fiber.tag = DELETE_EFFECT_TAG;
    platform.commit(fiber);
  }

  isUpdateZone && sync(wipFiber);
  $scope.runInsertionEffects();

  for (const fiber of candidates) {
    fiber.tag !== SKIP_EFFECT_TAG && platform.commit(fiber);
    fiber.alt = null;
    hasChildrenProp(fiber.inst) && (fiber.inst.children = null);
  }

  wipFiber.alt = null;
  platform.finishCommit(); // !
  $scope.runLayoutEffects();
  $scope.runAsyncEffects();
  unmounts.length > 0 && setTimeout(() => unmounts.forEach(x => unmountFiber(x)));
  flush($scope);
}

function flush($scope: Scope, cancel = false) {
  $scope.flush();
  !cancel && $scope.getEmitter().emit('finish');
  $scope.runAfterCommit(); // !
}

function sync(fiber: Fiber) {
  const diff = fiber.cec - fiber.alt.cec;
  if (diff === 0) return;
  const parentFiber = getFiberWithElement(fiber.parent);
  let isRight = false;

  fiber.increment(diff, true);

  walk(parentFiber.child, ($fiber, skip) => {
    if ($fiber === fiber) {
      isRight = true;
      return skip();
    }

    $fiber.element && skip();
    isRight && ($fiber.eidx += diff);
  });
}

function fork($scope: Scope): false {
  const $$scope$ = $scope.copy();
  const wipFiber = $scope.getWorkInProgress();
  const child = wipFiber.child;
  child && (child.parent = null);
  const restore = (options: RestoreOptions) => {
    const { fiber: wipFiber, setValue, resetValue } = options;
    const $scope = $$scope();

    detectIsFunction(setValue) && setValue();
    detectIsFunction(resetValue) && $$scope$.addCancel(resetValue);

    wipFiber.alt = new Fiber().mutate(wipFiber);
    wipFiber.tag = UPDATE_EFFECT_TAG;
    wipFiber.child = child;
    child && (child.parent = wipFiber);

    if (process.env.NODE_ENV !== 'production') {
      wipFiber.marker = '✌️';
    }

    $$scope$.setRoot($scope.getRoot());
    $$scope$.setWorkInProgress(wipFiber);
    replaceScope($$scope$);
  };

  wipFiber.child = wipFiber.alt.child;
  wipFiber.alt = null;
  $scope.runInsertionEffects(); // !
  $scope.applyCancels();
  flush($scope, true);
  scheduler.cancelTask(restore);

  return false;
}

export type CreateCallbackOptions = {
  rootId: number;
  isTransition?: boolean;
  hook: Hook;
  tools?: () => Tools;
};

function createCallback(options: CreateCallbackOptions) {
  const { rootId, hook, isTransition, tools = $tools } = options;
  const callback = (restore?: (options: RestoreOptions) => void) => {
    setRootId(rootId); // !
    const fromRestore = detectIsFunction(restore);
    const { shouldUpdate, setValue, resetValue } = tools();
    const $scope = $$scope();
    const owner = hook.owner;
    const fiber = owner.alt || owner;

    if (!shouldUpdate() || !detectIsFiberAlive(fiber) || fromRestore) {
      fromRestore && restore({ fiber, setValue, resetValue });
      return;
    }

    detectIsFunction(setValue) && setValue();
    detectIsFunction(resetValue) && isTransition && $scope.addCancel(resetValue);

    fiber.alt = new Fiber().mutate(fiber);
    fiber.tag = UPDATE_EFFECT_TAG;
    fiber.cc = 0;
    fiber.cec = 0;
    fiber.child = null;

    if (process.env.NODE_ENV !== 'production') {
      fiber.marker = '🔥';
    }

    $scope.setIsUpdateZone(true);
    $scope.resetMount();
    $scope.setWorkInProgress(fiber);
    $scope.setCursorFiber(fiber);
    fiber.inst = mount(fiber, null, $scope);
    $scope.setNextUnitOfWork(fiber);
  };

  return callback;
}

export type Tools = {
  shouldUpdate: () => boolean;
} & Pick<RestoreOptions, 'setValue' | 'resetValue'>;

const $tools = (): Tools => ({
  shouldUpdate: trueFn,
  setValue: null,
  resetValue: null,
});

const detectIsBusy = () => Boolean($$scope()?.getWorkInProgress());

export { Fiber, workLoop, createCallback, detectIsBusy };
