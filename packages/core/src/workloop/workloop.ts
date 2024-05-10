import { platform, detectIsSSR } from '../platform';
import {
  CREATE_EFFECT_TAG,
  UPDATE_EFFECT_TAG,
  DELETE_EFFECT_TAG,
  SKIP_EFFECT_TAG,
  INSERTION_EFFECT_HOST_MASK,
  LAYOUT_EFFECT_HOST_MASK,
  ASYNC_EFFECT_HOST_MASK,
  ATOM_HOST_MASK,
  MOVE_MASK,
  FLUSH_MASK,
  Flag,
  TaskPriority,
} from '../constants';
import {
  flatten,
  logError,
  detectIsEmpty,
  detectIsFalsy,
  detectIsArray,
  detectIsFunction,
  detectIsTextBased,
  detectIsPromise,
  formatErrorMsg,
  createIndexKey,
  trueFn,
} from '../utils';
import { type Scope, getRootId, setRootId, $$scope, replaceScope } from '../scope';
import { type Component, detectIsComponent } from '../component';
import { type ElementKey, type Instance, type Callback } from '../shared';
import { Fiber, getHook, Hook } from '../fiber';
import {
  Text,
  detectIsVirtualNode,
  detectIsVirtualNodeFactory,
  getElementKey,
  hasElementFlag,
  hasChildrenProp,
  createReplacer,
  detectAreSameInstanceTypes,
} from '../view';
import { detectIsMemo } from '../memo';
import {
  walk,
  getFiberWithElement,
  detectIsFiberAlive,
  resolveSuspense,
  notifyParents,
  tryOptStaticSlot,
  tryOptMemoSlot,
  createHookLoc,
} from '../walk';
import { type ScheduleCallbackOptions, type OnRestore, type OnRestoreOptions, scheduler } from '../scheduler';
import { Fragment, detectIsFragment } from '../fragment';
import { startTransition } from '../start-transition';
import { unmountFiber } from '../unmount';
import { addBatch } from '../batch';

export type WorkLoop = (isAsync: boolean) => boolean | Promise<unknown> | null;

function workLoop(isAsync: boolean): boolean | Promise<unknown> | null {
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

      if (shouldYield && scheduler.detectIsTransition() && scheduler.hasPrimaryTask()) {
        fork($scope);
        return false;
      }
    }

    if (!unit && wipFiber) {
      commit($scope);
    }
  } catch (err) {
    if (detectIsPromise(err)) {
      return err;
    } else {
      const emitter = $scope.getEmitter();

      $scope.keepRoot(); // !
      emitter.emit('error', String(err));

      if (!isAsync) {
        throw err;
      } else {
        logError('err', err);
      }

      return false;
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
  const $hook = parent.child ? parent.child.hook || null : null; // from previous fiber after throwing promise
  const $inst = parent.inst;
  const idx = 0;
  const inst = hasChildrenProp($inst) ? $inst.children[idx] : null;
  const alt = getAlternate(parent, inst, idx, $scope);
  const fiber = createFiber(alt, inst, idx);

  fiber.hook = $hook || fiber.hook;
  fiber.parent = parent;
  parent.child = fiber;
  fiber.eidx = parent.element ? 0 : parent.eidx;

  share(fiber, parent, inst, $scope);

  return fiber;
}

function mountSibling(left: Fiber, $scope: Scope) {
  $scope.navToSibling();
  const $hook = left.next ? left.next.hook || null : null; // from previous fiber after throwing promise
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

  fiber.hook = $hook || fiber.hook;
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

function createFiber(alt: Fiber, next: Instance, idx: number) {
  const provider = alt ? alt.provider : null;
  const prev = alt ? alt.inst : null;
  const hook = getHook(alt, prev, next);
  const fiber = new Fiber(hook, provider, idx);

  fiber.alt = alt || null;

  return fiber;
}

function getAlternate(fiber: Fiber, inst: Instance, idx: number, $scope: Scope) {
  const isChild = idx === 0;
  const parent = isChild ? fiber : fiber.parent;
  if (!fiber.wip && parent.tag === CREATE_EFFECT_TAG) return null; // !
  const parentId = isChild ? fiber.id : fiber.parent.id;
  const key = getElementKey(inst);
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
  isUpdate =
    alt &&
    fiber.tag !== CREATE_EFFECT_TAG &&
    detectAreSameInstanceTypes(alt.inst, inst) &&
    getElementKey(alt.inst) === getElementKey(inst);
  fiber.tag = isUpdate ? UPDATE_EFFECT_TAG : CREATE_EFFECT_TAG;

  if (!fiber.element) {
    if (isUpdate && alt.element) {
      fiber.element = alt.element;
    } else if (detectIsVirtualNode(fiber.inst)) {
      fiber.element = platform.createElement(fiber.inst);
    }
  }

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

  deep && walk(fiber.child, onWalkInShouldUpdate(diff));
  notifyParents(fiber, alt);

  return false;
}

const onWalkInShouldUpdate = (diff: number) => ($fiber: Fiber, skip: Callback) => {
  $fiber.eidx += diff;
  if ($fiber.element) return skip();
};

function mount(fiber: Fiber, prev: Fiber, $scope: Scope) {
  let inst = fiber.inst;
  const isComponent = detectIsComponent(inst);
  const component = inst as Component;

  if (isComponent) {
    try {
      let result = component.type(component.props);

      if (detectIsArray(result)) {
        !detectIsFragment(component) && (result = Fragment({ slot: result }));
      } else if (detectIsTextBased(result)) {
        result = Text(result);
      }

      component.children = result as Array<Instance>;
    } catch (err) {
      if (detectIsPromise(err)) {
        const promise = err;
        const isSSR = detectIsSSR();
        const reset = createResetClosure(fiber, prev, $scope);

        if (!isSSR) {
          const suspense = resolveSuspense(fiber);

          if (suspense) {
            suspense.hook.isPending = true;
            $scope.getAwaiter().add(suspense.hook, promise);
          } else {
            reset();
            throw err;
          }
        } else {
          reset();
          throw err;
        }
      } else {
        component.children = [];
        fiber.setError(err);
      }
    }
  } else if (detectIsVirtualNodeFactory(inst)) {
    inst = inst();
  }

  if (hasChildrenProp(inst)) {
    inst.children = flatten(inst.children, x => (detectIsTextBased(x) ? Text(x) : x || supportConditional(x)));
    isComponent && component.children.length === 0 && component.children.push(createReplacer());
    fiber.cc = inst.children.length;
  }

  return inst;
}

const createResetClosure = (fiber: Fiber, prev: Fiber, $scope: Scope) => () => {
  if (prev) {
    fiber.hook.owner = null;
    fiber.hook.idx = 0;
    $scope.navToPrev();
    $scope.setNextUnitOfWork(prev);
    Fiber.setNextId(prev.id);
  } else {
    fiber.id = Fiber.incrementId();
    fiber.cec = fiber.alt.cec;
  }
};

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
          logError(formatErrorMsg(`The key of node [${nextKey}] already has been used!`), [inst]);
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

  const rootId = getRootId();
  const wip = $scope.getWorkInProgress();
  const deletions = $scope.getDeletions();
  const candidates = $scope.getCandidates();
  const isUpdateZone = $scope.getIsUpdateZone();
  const awaiter = $scope.getAwaiter();
  const unmounts: Array<Fiber> = [];
  const mask = INSERTION_EFFECT_HOST_MASK | LAYOUT_EFFECT_HOST_MASK | ASYNC_EFFECT_HOST_MASK;
  const isTransition = scheduler.detectIsTransition();

  // !
  for (const fiber of deletions) {
    const canAsync = fiber.mask & ATOM_HOST_MASK && !(fiber.mask & mask);

    canAsync ? unmounts.push(fiber) : unmountFiber(fiber);
    fiber.tag = DELETE_EFFECT_TAG;
    platform.commit(fiber);
  }

  isUpdateZone && sync(wip);
  $scope.runInsertionEffects();

  for (const fiber of candidates) {
    fiber.tag !== SKIP_EFFECT_TAG && platform.commit(fiber);
    fiber.alt = null;

    if (hasChildrenProp(fiber.inst) && (!fiber.hook || !fiber.hook.isUpdateHost)) {
      fiber.inst.children = null;
    }
  }

  wip.alt = null;
  wip.wip = false;
  platform.finishCommit(); // !
  $scope.runLayoutEffects();
  $scope.runAsyncEffects();
  awaiter.resolve(onResolve(rootId, isTransition));
  unmounts.length > 0 && platform.raf(onUnmount(unmounts));
  flush($scope);
}

const onUnmount = (fibers: Array<Fiber>) => () => fibers.forEach(x => unmountFiber(x));

const onResolve = (rootId: number, isTransition: boolean) => (hook: Hook) => {
  const update = createUpdate(rootId, hook);

  isTransition ? startTransition(update) : update();
};

function flush($scope: Scope, fromFork = false) {
  $scope.flush();
  !fromFork && $scope.getEmitter().emit('finish');
  $scope.runAfterCommit(); // !
}

function sync(fiber: Fiber) {
  const diff = fiber.cec - fiber.alt.cec;
  if (diff === 0) return;
  const parent = getFiberWithElement(fiber.parent);
  const scope = { isRight: false };

  fiber.wip = false;
  fiber.increment(diff);
  walk(parent.child, onWalkInSync(diff, fiber, scope));
}

const onWalkInSync = (diff: number, fiber: Fiber, scope: { isRight: boolean }) => ($fiber: Fiber, skip: Callback) => {
  if ($fiber === fiber) {
    scope.isRight = true;
    return skip();
  }

  $fiber.element && skip();
  scope.isRight && ($fiber.eidx += diff);
};

function fork($scope: Scope) {
  const $fork = $scope.fork();
  const wip = $scope.getWorkInProgress();
  const onRestore = createOnRestore($fork, wip.child);

  wip.child = wip.alt.child;
  wip.alt = null;
  $scope.runInsertionEffects(); // !
  $scope.applyCancels();
  flush($scope, true);
  scheduler.retain(onRestore);
}

const createOnRestore = ($fork: Scope, child: Fiber) => (options: OnRestoreOptions) => {
  const { fiber: wip, setValue, resetValue } = options;
  const $scope = $$scope();

  detectIsFunction(setValue) && setValue();
  detectIsFunction(resetValue) && $fork.addCancel(resetValue);

  wip.alt = new Fiber().mutate(wip);
  wip.tag = UPDATE_EFFECT_TAG;
  wip.child = child;
  wip.wip = true;
  child && (child.parent = wip);

  if (process.env.NODE_ENV !== 'production') {
    wip.marker = '🔀';
  }

  $fork.setRoot($scope.getRoot());
  $fork.setWorkInProgress(wip);
  replaceScope($fork);
};

export type CreateCallbackOptions = {
  rootId: number;
  isTransition?: boolean;
  hook: Hook;
  tools?: () => Tools;
};

function createCallback(options: CreateCallbackOptions) {
  const { rootId, hook, isTransition, tools = $tools } = options;
  const callback = (onRestore?: OnRestore) => {
    setRootId(rootId); // !
    const isRetain = detectIsFunction(onRestore);
    const { shouldUpdate, setValue, resetValue } = tools();
    const $scope = $$scope();
    const owner = hook.owner;
    const fiber = owner.alt || owner;
    const isBroken = !fiber.tag;

    if (isBroken || !shouldUpdate() || !detectIsFiberAlive(fiber) || isRetain) {
      isRetain && onRestore({ fiber, setValue, resetValue });
      return;
    }

    detectIsFunction(setValue) && setValue();
    detectIsFunction(resetValue) && isTransition && $scope.addCancel(resetValue);

    fiber.alt = null; // !
    fiber.alt = new Fiber().mutate(fiber);
    fiber.tag = UPDATE_EFFECT_TAG;
    fiber.cc = 0;
    fiber.cec = 0;
    fiber.child = null;
    fiber.wip = true;

    hook.idx = 0; // !
    hook.owner = fiber;

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

function createUpdate(rootId: number, hook: Hook) {
  const { idx } = hook;
  const update = (tools?: () => Tools) => {
    const $scope = $$scope();
    if ($scope.getIsInsertionEffectsZone()) return;
    const { owner } = hook;
    const hasTools = detectIsFunction(tools);
    const isTransition = $scope.getIsTransitionZone();
    const isBatch = $scope.getIsBatchZone();
    const isEvent = $scope.getIsEventZone();
    const priority = isTransition ? TaskPriority.LOW : isEvent ? TaskPriority.HIGH : TaskPriority.NORMAL; // !
    const forceAsync = isTransition;
    const onTransitionEnd = isTransition ? $scope.getOnTransitionEnd() : null;
    const callback = createCallback({
      rootId,
      hook,
      isTransition,
      tools: hasTools ? tools : undefined,
    });
    const loc = createLoc(rootId, idx, hook);
    const options: ScheduleCallbackOptions = {
      priority,
      forceAsync,
      isTransition,
      loc,
      onTransitionEnd,
    };

    if (isBatch) {
      addBatch(
        owner,
        () => scheduler.schedule(callback, options),
        () => hasTools && tools().setValue(),
      );
    } else {
      scheduler.schedule(callback, options);
    }
  };

  hook.isUpdateHost = true;

  return update;
}

const createLoc = (rootId: number, idx: number, hook: Hook) => () => createHookLoc(rootId, idx, hook);

export type Tools = {
  shouldUpdate: () => boolean;
} & Pick<OnRestoreOptions, 'setValue' | 'resetValue'>;

const $tools = (): Tools => ({
  shouldUpdate: trueFn,
  setValue: null,
  resetValue: null,
});

const detectIsBusy = () => Boolean($$scope()?.getWorkInProgress());

export { Fiber, workLoop, createUpdate, detectIsBusy };
