import { platform, detectIsSSR } from '../platform';
import {
  CREATE_EFFECT_TAG,
  UPDATE_EFFECT_TAG,
  DELETE_EFFECT_TAG,
  SKIP_EFFECT_TAG,
  EFFECT_HOST_MASK,
  ATOM_HOST_MASK,
  MOVE_MASK,
  TaskPriority,
} from '../constants';
import {
  logError,
  detectIsFalsy,
  detectIsArray,
  detectIsFunction,
  detectIsTextBased,
  detectIsPromise,
  createIndexKey,
  createError,
  trueFn,
} from '../utils';
import { type Scope, setRootId, $$scope, replaceScope } from '../scope';
import { type Component, detectIsComponent } from '../component';
import { type Instance, type Callback } from '../shared';
import { Fiber, getHook, Hook } from '../fiber';
import {
  type CanHaveChildren,
  Text,
  detectIsVirtualNode,
  detectIsVirtualNodeFactory,
  getElementKey,
  createReplacer,
  detectAreSameInstanceTypes,
  hasChildrenProp,
} from '../view';
import { detectIsMemo } from '../memo';
import {
  walk,
  getFiberWithElement,
  detectIsFiberAlive,
  resolveSuspense,
  resolveBoundary,
  notifyParents,
  createLoc,
} from '../walk';
import { type ScheduleCallbackOptions, type OnRestore, type OnRestoreOptions, scheduler } from '../scheduler';
import { Fragment, detectIsFragment } from '../fragment';
import { type EventEmitter } from '../emitter';
import { unmountFiber } from '../unmount';
import { addBatch } from '../batch';

export type WorkLoop = (isAsync: boolean) => boolean | Promise<unknown> | null;

function workLoop(isAsync: boolean): boolean | Promise<unknown> | null {
  const $scope = $$scope();
  const wipFiber = $scope.getWorkInProgress();
  const isStream = $scope.getIsStream();
  const emitter = $scope.getEmitter();
  let unit = $scope.getNextUnitOfWork();
  let shouldYield = false;

  try {
    while (unit && !shouldYield) {
      const isDeepWalking = $scope.getMountDeep();

      unit = performUnitOfWork(unit, wipFiber, isDeepWalking, isStream, emitter, $scope);
      shouldYield = isAsync && scheduler.shouldYield();
      $scope.setUnitOfWork(unit);

      if (shouldYield && scheduler.detectIsTransition() && scheduler.hasNewTask()) {
        fork($scope);
        return false;
      }
    }

    if (!unit && wipFiber) {
      commit($scope);
    }
  } catch (error) {
    if (detectIsPromise(error)) {
      return error;
    } else {
      const emitter = $scope.getEmitter();

      $scope.keepRoot(); // !
      emitter.emit('error', createError(error));

      if (!isAsync) {
        throw error;
      } else {
        logError(error);
      }

      return false;
    }
  }

  return Boolean(unit); // has more work
}

function performUnitOfWork(
  fiber: Fiber,
  wipFiber: Fiber,
  isDeepWalking: boolean,
  isStream: boolean,
  emitter: EventEmitter,
  $scope: Scope,
): Fiber | null {
  fiber.hook && (fiber.hook.idx = 0);

  if (isDeepWalking) {
    const children = (fiber.inst as CanHaveChildren).children;

    if (children && children.length > 0) {
      const child = mountChild(fiber, $scope);

      isStream && emitter.emit('chunk', child);

      return child;
    }
  }

  let parent = fiber.parent;

  while (parent && fiber !== wipFiber) {
    const next = mountSibling(fiber, $scope);

    if (isStream) {
      emitter.emit('chunk', fiber);
      next && emitter.emit('chunk', next);
    }

    if (next) return next;
    fiber = parent;
    parent = fiber.parent;
  }

  return null;
}

function mountChild(parent: Fiber, $scope: Scope) {
  $scope.navToChild();
  const children = (parent.inst as CanHaveChildren)?.children || null;
  const inst = children ? setupInstance(children, 0) : null;
  const fiber = createFiber(getAlternate(parent, inst, 0, $scope), inst, 0);

  fiber.hook = parent.child?.hook || fiber.hook; // from previous fiber after throwing promise
  fiber.parent = parent;
  parent.child = fiber;
  fiber.eidx = parent.element ? 0 : parent.eidx;

  share(fiber, parent, inst, $scope);

  return fiber;
}

function mountSibling(left: Fiber, $scope: Scope) {
  $scope.navToSibling();
  const idx = $scope.getMountIndex();
  const children = (left.parent.inst as CanHaveChildren).children;
  const inst = children ? setupInstance(children, idx) : null;

  if (!inst) {
    $scope.navToParent();
    $scope.setMountDeep(false);

    return null;
  }

  $scope.setMountDeep(true);
  const fiber = createFiber(getAlternate(left, inst, idx, $scope), inst, idx);

  fiber.hook = left.next?.hook || fiber.hook; // from previous fiber after throwing promise
  fiber.parent = left.parent;
  left.next = fiber;
  fiber.eidx = left.eidx + (left.element ? (left.hook?.getIsPortal() ? 0 : 1) : left.cec);

  share(fiber, left, inst, $scope);

  return fiber;
}

function setupInstance(children: Array<Instance>, idx: number): Instance {
  if (!children || idx >= children.length) return null;
  const child = children[idx];
  let inst: Instance = null;

  children[idx] = detectIsArray(child)
    ? Fragment({ slot: child })
    : detectIsTextBased(child)
    ? Text(child)
    : child || supportConditional(child);
  inst = children[idx];

  return inst;
}

function share(fiber: Fiber, prev: Fiber, inst: Instance, $scope: Scope) {
  const { alt } = fiber;
  const isMemo = alt && detectIsMemo(inst);
  const shouldMount = isMemo ? shouldUpdate(fiber, inst, $scope) : true;

  $scope.setCursor(fiber);
  fiber.inst = inst;

  if (alt && alt.mask & MOVE_MASK) {
    fiber.mask |= MOVE_MASK;
    alt.mask &= ~MOVE_MASK;
  }

  fiber.hook && (fiber.hook.owner = fiber); // !

  if (shouldMount) {
    fiber.inst = mount(fiber, prev, $scope);
    alt && $scope.getReconciler().reconcile(fiber, alt, $scope);
    setup(fiber, alt);
  } else if (fiber.mask & MOVE_MASK) {
    fiber.tag = UPDATE_EFFECT_TAG;
  }

  $scope.addCandidate(fiber); // !
}

function createFiber(alt: Fiber, next: Instance, idx: number) {
  const prev = alt ? alt.inst : null;
  const fiber = new Fiber(idx, getHook(alt, prev, next));

  fiber.alt = alt || null;

  return fiber;
}

function getAlternate(fiber: Fiber, inst: Instance, idx: number, $scope: Scope) {
  const isChild = idx === 0;
  const parent = isChild ? fiber : fiber.parent;
  if (!fiber.hook?.getIsWip() && parent.tag === CREATE_EFFECT_TAG) return null; // !
  const parentId = isChild ? fiber.id : fiber.parent.id;
  const key = getElementKey(inst);
  const store = $scope.getReconciler().get(parentId);
  let alt: Fiber = null;

  if (key !== null && store) {
    const isMove = store.move && Boolean(store.move[key]);
    const isStable = store.stable && Boolean(store.stable[key]);

    if (isMove || isStable) {
      alt = store.map[key];
      isMove && (alt.mask |= MOVE_MASK);
    }
  } else {
    if (fiber.alt) {
      alt = isChild ? fiber.alt.child : fiber.alt.next;
    } else {
      alt = store ? store.map[createIndexKey(idx)] || null : null;
    }
  }

  return alt;
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

  fiber.element && !fiber.hook?.getIsPortal() && fiber.increment();
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
      const isSSR = detectIsSSR();

      if (detectIsPromise(err)) {
        const promise = err;
        const reset = createReset(fiber, prev, $scope);
        const boundary = resolveBoundary(fiber);

        if (!isSSR) {
          const suspense = resolveSuspense(fiber);

          if (suspense || boundary) {
            $scope.getAwaiter().add(suspense, boundary, promise);
          } else {
            reset();
            throw promise;
          }
        } else {
          reset();
          throw promise;
        }
      } else {
        component.children = [];
        !isSSR && fiber.setError(err);
      }
    }
  } else if (detectIsVirtualNodeFactory(inst)) {
    inst = inst();
  }

  if (hasChildrenProp(inst)) {
    inst.children = detectIsArray(inst.children) ? inst.children : [inst.children];
    isComponent && component.children.length === 0 && component.children.push(createReplacer());
    fiber.cc = inst.children.length;
  }

  return inst;
}

const createReset = (fiber: Fiber, prev: Fiber, $scope: Scope) => () => {
  if (prev) {
    fiber.hook.owner = null;
    fiber.hook.idx = 0;
    $scope.navToPrev();
    $scope.setUnitOfWork(prev);
    Fiber.setNextId(prev.id);
  } else {
    fiber.id = Fiber.incrementId();
    fiber.cec = fiber.alt.cec;
  }
};

function supportConditional(inst: Instance) {
  return detectIsFalsy(inst) ? createReplacer() : inst;
}

function commit($scope: Scope) {
  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_ENV === 'development' && $scope.setIsHot(false);
  }

  const wip = $scope.getWorkInProgress();
  const deletions = $scope.getDeletions();
  const candidates = $scope.getCandidates();
  const isUpdate = $scope.getIsUpdate();
  const awaiter = $scope.getAwaiter();
  const unmounts: Array<Fiber> = [];
  const inst = wip.inst as Component;

  // !
  for (const fiber of deletions) {
    const canAsync = fiber.mask & ATOM_HOST_MASK && !(fiber.mask & EFFECT_HOST_MASK);

    canAsync ? unmounts.push(fiber) : unmountFiber(fiber);
    fiber.tag = DELETE_EFFECT_TAG;
    platform.commit(fiber);
  }

  isUpdate && sync(wip);
  $scope.runInsertionEffects();

  for (const fiber of candidates) {
    const item = fiber.inst as CanHaveChildren;

    fiber.tag !== SKIP_EFFECT_TAG && platform.commit(fiber);
    fiber.alt = null;
    item.children && (item.children = null);
  }

  wip.alt = null;
  wip.hook?.setIsWip(false);
  inst.children = null;
  platform.finishCommit(); // !
  $scope.runLayoutEffects();
  $scope.runAsyncEffects();
  awaiter.resolve();
  unmounts.length > 0 && platform.raf(onUnmount(unmounts));
  cleanup($scope);
}

const onUnmount = (fibers: Array<Fiber>) => () => fibers.forEach(unmountFiber);

function cleanup($scope: Scope, fromFork = false) {
  $scope.cleanup();
  !fromFork && $scope.getEmitter().emit('finish');
  $scope.runAfterCommit(); // !
}

function sync(fiber: Fiber) {
  const diff = fiber.cec - fiber.alt.cec;
  if (diff === 0) return;
  const parent = getFiberWithElement(fiber.parent);
  const scope = { isRight: false };

  fiber.hook.setIsWip(false);
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
  const { alt } = wip;

  wip.child = alt.child;
  wip.cc = alt.cc;
  wip.cec = alt.cec;
  wip.hook?.setIsWip(false);
  wip.alt = null;

  wip.hook.idx = 0;
  wip.hook.owner = wip;

  $scope.runInsertionEffects(); // !
  $scope.applyCancels();
  cleanup($scope, true);
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
  wip.hook?.setIsWip(true);
  child.parent = wip;

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
    fiber.hook.setIsWip(true);

    hook.idx = 0; // !
    hook.owner = fiber;

    $scope.setIsUpdate(true);
    $scope.resetMount();
    $scope.setWorkInProgress(fiber);
    $scope.setCursor(fiber);
    fiber.inst = mount(fiber, null, $scope);
    $scope.setUnitOfWork(fiber);
  };

  return callback;
}

function createUpdate(rootId: number, hook: Hook) {
  const { idx } = hook;
  const update = (tools?: () => Tools) => {
    const $scope = $$scope();
    if ($scope.getIsInsertionEffect()) return;
    const hasTools = detectIsFunction(tools);
    const isTransition = $scope.getIsTransition();
    const isBatch = $scope.getIsBatch();
    const isEvent = $scope.getIsEvent();
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
        hook,
        () => scheduler.schedule(callback, options),
        () => hasTools && tools().setValue(),
      );
    } else {
      scheduler.schedule(callback, options);
    }
  };

  return update;
}

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
