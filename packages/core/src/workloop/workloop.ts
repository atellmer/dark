import { type RestoreOptions, platform, detectIsServer } from '../platform';
import { RESTART_TIMEOUT, Flag } from '../constants';
import {
  flatten,
  error,
  detectIsEmpty,
  detectIsFalsy,
  detectIsArray,
  detectIsString,
  detectIsNumber,
  detectIsFunction,
  createIndexKey,
  trueFn,
} from '../helpers';
import { type Scope, setRootId, scope$$, replaceScope } from '../scope';
import { type Hook, Fiber, EffectTag } from '../fiber';
import type { DarkElementKey as Key, DarkElementInstance } from '../shared';
import { type Component, detectIsComponent } from '../component';
import {
  Text,
  detectIsVirtualNode,
  detectIsVirtualNodeFactory,
  getElementKey,
  getElementFlag,
  getInstanceType,
  hasChildrenProp,
  detectIsReplacer,
  createReplacer,
} from '../view';
import { detectIsMemo } from '../memo/utils';
import { detectIsLazy, detectIsLoaded } from '../lazy/utils';
import { walkFiber, getFiberWithElement, detectIsFiberAlive, tryOptimizeRemoves, tryOptimizeMoves } from '../walk';
import { unmountFiber } from '../unmount';
import { Fragment, detectIsFragment } from '../fragment';
import { emitter } from '../emitter';

let hasRenderError = false;

type Box = {
  fiber$$: Fiber;
  fiber$: Fiber;
  inst$: DarkElementInstance;
  wipFiber: Fiber;
  scope$: Scope;
};

export type WorkLoop = (yield$: boolean) => boolean;

function workLoop(yield$: boolean) {
  if (hasRenderError) return false;
  const scope$ = scope$$();
  const wipFiber = scope$.getWorkInProgress();
  let unit = scope$.getNextUnitOfWork();
  let shouldYield = false;
  let hasMoreWork = Boolean(unit);
  const box: Box = {
    fiber$$: null,
    fiber$: null,
    inst$: null,
    wipFiber,
    scope$,
  };

  try {
    while (unit && !shouldYield) {
      unit = performUnitOfWork(unit, box);
      scope$.setNextUnitOfWork(unit);
      hasMoreWork = Boolean(unit);
      shouldYield = yield$ && platform.shouldYield();
      if (platform.hasPrimaryTask()) return stopTransitionWork();
    }

    if (!unit && wipFiber) {
      commit();
    }
  } catch (err) {
    if (err instanceof StopWork) {
      !yield$ && setTimeout(() => workLoop(false), RESTART_TIMEOUT);
    } else {
      hasRenderError = true;
      throw err;
    }
  }

  return hasMoreWork;
}

function performUnitOfWork(fiber: Fiber, box: Box) {
  let isDeepWalking = true;
  let nextFiber = fiber;
  let instance = fiber.inst;
  const isStream = box.scope$.getIsStreamZone();

  while (true) {
    isDeepWalking = box.scope$.getMountDeep();
    nextFiber.hook && (nextFiber.hook.idx = 0);

    if (isDeepWalking) {
      const hasChildren = hasChildrenProp(instance) && instance.children.length > 0;

      if (hasChildren) {
        mountChild(nextFiber, box);

        nextFiber = box.fiber$;
        instance = box.inst$;

        box.fiber$$ = null;
        box.fiber$ = null;
        box.inst$ = null;

        isStream && platform.chunk(nextFiber);

        if (nextFiber) return nextFiber;
      } else {
        mountSibling(nextFiber, box);

        const nextFiber$ = box.fiber$$;

        nextFiber = box.fiber$;
        instance = box.inst$;

        box.fiber$$ = null;
        box.fiber$ = null;
        box.inst$ = null;

        isStream && platform.chunk(nextFiber);

        if (nextFiber$) return nextFiber$;
      }
    } else {
      mountSibling(nextFiber, box);
      box.scope$.removeActionMap(nextFiber.id);

      const nextFiber$ = box.fiber$$;

      nextFiber = box.fiber$;
      instance = box.inst$;

      box.fiber$$ = null;
      box.fiber$ = null;
      box.inst$ = null;

      isStream && platform.chunk(nextFiber);

      if (nextFiber$) return nextFiber$;
    }

    if (nextFiber === box.wipFiber || !nextFiber.parent) return null;
  }
}

function mountChild(nextFiber: Fiber, box: Box) {
  box.scope$.navToChild();
  const inst$ = nextFiber.inst;
  const idx = 0;
  const inst = hasChildrenProp(inst$) ? inst$.children[idx] : null;
  const alt = getAlternate(nextFiber, inst, true);
  const fiber = new Fiber(getHook(alt, alt ? alt.inst : null, inst), alt ? alt.provider : null, idx);

  box.scope$.setCursorFiber(fiber);
  box.scope$.addCandidate(fiber);
  fiber.parent = nextFiber;
  nextFiber.child = fiber;
  fiber.eidx = nextFiber.element ? 0 : nextFiber.eidx;
  fiber.inst = inst;
  fiber.inst = mount(fiber);
  alt && performAlternate(fiber, alt);
  connect(fiber, alt);
  alt && detectIsMemo(fiber.inst) && performMemo(fiber);
  box.fiber$$ = null;
  box.fiber$ = fiber;
  box.inst$ = inst$;
}

function mountSibling(nextFiber: Fiber, box: Box) {
  box.scope$.navToSibling();
  const inst$ = nextFiber.parent.inst;
  const idx = box.scope$.getMountIndex();
  const inst = hasChildrenProp(inst$) && inst$.children ? inst$.children[idx] : null;
  const hasSibling = Boolean(inst);

  if (hasSibling) {
    box.scope$.setMountDeep(true);
    const alt = getAlternate(nextFiber, inst, false);
    const fiber = new Fiber(getHook(alt, alt ? alt.inst : null, inst), alt ? alt.provider : null, idx);

    box.scope$.setCursorFiber(fiber);
    box.scope$.addCandidate(fiber);
    fiber.parent = nextFiber.parent;
    nextFiber.next = fiber;
    fiber.eidx = nextFiber.eidx + (nextFiber.element ? 1 : nextFiber.cec);
    fiber.inst = inst;
    fiber.inst = mount(fiber);
    alt && performAlternate(fiber, alt);
    connect(fiber, alt);
    alt && detectIsMemo(fiber.inst) && performMemo(fiber);
    box.fiber$$ = fiber;
    box.fiber$ = fiber;
    box.inst$ = fiber.inst;
  } else {
    box.scope$.navToParent();
    box.scope$.setMountDeep(false);
    nextFiber = nextFiber.parent;
    box.fiber$$ = null;
    box.fiber$ = nextFiber;
    box.inst$ = nextFiber.inst;
  }
}

function getAlternate(fiber: Fiber, inst: DarkElementInstance, fromChild: boolean) {
  const key = getElementKey(inst);

  if (key !== null) {
    const scope$ = scope$$();
    const parentId = fromChild ? fiber.id : fiber.parent.id;
    const actions = scope$.getActionsById(parentId);

    if (actions) {
      const isMove = actions.move && Boolean(actions.move[key]);
      const isStable = actions.stable && Boolean(actions.stable[key]);

      if (isMove || isStable) {
        const alt = actions.map[key];

        isMove && (alt.move = true);

        return alt;
      }

      return null;
    }
  }

  const alt = fiber.alt ? (fromChild ? fiber.alt.child || null : fiber.alt.next || null) : null;

  return alt;
}

function performAlternate(fiber: Fiber, alt: Fiber) {
  const scope$ = scope$$();
  const { id, inst } = fiber;
  const areSameTypes = detectAreSameInstanceTypes(alt.inst, inst);

  if (alt.move) {
    fiber.move = true;
    delete alt.move;
  }

  if (!areSameTypes) {
    scope$.addDeletion(alt);
  } else if (hasChildrenProp(alt.inst) && hasChildrenProp(inst) && alt.cc !== 0) {
    const hasSameCount = alt.cc === inst.children.length;
    const flag = getElementFlag(inst);
    const check = flag?.[Flag.NM] ? !hasSameCount : true;

    if (check) {
      const { prevKeys, nextKeys, prevKeysMap, nextKeysMap, keyedFibersMap } = extractKeys(alt.child, inst.children);
      const flush = nextKeys.length === 0;
      let size = Math.max(prevKeys.length, nextKeys.length);
      let p = 0;
      let n = 0;
      let hasMoves = false;
      let hasRemoves = false;

      scope$.addActionMap(id, keyedFibersMap);

      for (let i = 0; i < size; i++) {
        const nextKey = nextKeys[i - n] ?? null;
        const prevKey = prevKeys[i - p] ?? null;
        const prevKeyFiber = keyedFibersMap[prevKey] || null;

        if (nextKey !== prevKey) {
          if (nextKey !== null && !prevKeysMap[nextKey]) {
            if (prevKey !== null && !nextKeysMap[prevKey]) {
              scope$.addReplaceAction(id, nextKey);
              scope$.addDeletion(prevKeyFiber);
            } else {
              scope$.addInsertAction(id, nextKey);
              p++;
              size++;
            }
          } else if (!nextKeysMap[prevKey]) {
            scope$.addRemoveAction(id, prevKey);
            scope$.addDeletion(prevKeyFiber);
            flush && (prevKeyFiber.flush = true);
            hasRemoves = true;
            n++;
            size++;
          } else if (nextKeysMap[prevKey] && nextKeysMap[nextKey]) {
            scope$.addMoveAction(id, nextKey);
            hasMoves = true;
          }
        } else if (nextKey !== null) {
          scope$.addStableAction(id, nextKey);
        }
      }

      hasMoves && tryOptimizeMoves(fiber, alt, scope$);
      hasRemoves && tryOptimizeRemoves(fiber, alt, scope$);
    }
  }
}

function connect(fiber: Fiber, alt: Fiber) {
  const inst = fiber.inst;
  let isUpdate = false;

  fiber.parent.tag === EffectTag.C && (fiber.tag = fiber.parent.tag);
  fiber.parent.shadow && !fiber.parent.element && !detectIsReplacer(inst) && (fiber.shadow = true);
  isUpdate =
    alt &&
    fiber.tag !== EffectTag.C &&
    detectAreSameInstanceTypes(alt.inst, inst) &&
    getElementKey(alt.inst) === getElementKey(inst);
  fiber.alt = alt || null;
  isUpdate && !fiber.element && alt.element && (fiber.element = alt.element);
  fiber.tag = isUpdate ? EffectTag.U : EffectTag.C;
  alt?.cleanup?.();
  hasChildrenProp(fiber.inst) && (fiber.cc = fiber.inst.children.length);
  !fiber.element && detectIsVirtualNode(fiber.inst) && (fiber.element = platform.createElement(fiber.inst));
  fiber.element && fiber.incChildElementCount();
}

function performMemo(fiber: Fiber) {
  const scope$ = scope$$();

  if (process.env.NODE_ENV !== 'production') {
    if (scope$.getIsHot()) return;
  }

  const alt = fiber.alt;
  const pc = alt.inst as Component;
  const nc = fiber.inst as Component;

  if (nc.type !== pc.type || nc.su(pc.props, nc.props)) return;

  scope$.setMountDeep(false);
  !fiber.move && (fiber.tag = EffectTag.S);
  fiber.child = alt.child; // same links
  fiber.child.parent = fiber;
  fiber.hook = alt.hook;
  fiber.cc = alt.cc;
  fiber.cec = alt.cec;
  alt.element && (fiber.element = alt.element);
  alt.provider && (fiber.provider = alt.provider);
  alt.catch && (fiber.catch = alt.catch);
  alt.cleanup && (fiber.cleanup = alt.cleanup);

  const diff = fiber.eidx - alt.eidx;
  const deep = diff !== 0;

  if (deep) {
    walkFiber(fiber.child, (nextFiber, _, __, stop) => {
      if (nextFiber === fiber.next || nextFiber === fiber.parent) return stop();
      nextFiber.eidx += diff;
      if (nextFiber.parent !== fiber && nextFiber.element) return stop();
    });
  }

  fiber.incChildElementCount(alt.cec);
  alt.aefHost && fiber.markAsyncEffectHost();
  alt.lefHost && fiber.markLayoutEffectHost();
  alt.iefHost && fiber.markInsertionEffectHost();
  alt.atomHost && fiber.markAtomHost();
  alt.portalHost && fiber.markPortalHost();
}

function mount(fiber: Fiber) {
  let inst = fiber.inst;
  const isComponent = detectIsComponent(inst);
  const component = inst as Component;

  if (isComponent) {
    try {
      let result = component.type(component.props, component.ref);

      if (detectIsLazy(component) && !detectIsLoaded(component) && (scope$$().getIsHydrateZone() || detectIsServer())) {
        const scope$ = scope$$();

        scope$.navToParent();
        scope$.setNextUnitOfWork(fiber.parent);
        Fiber.setNextId(fiber.parent.id);
        throw new StopWork();
      }

      if (detectIsArray(result)) {
        !detectIsFragment(component) && (result = Fragment({ slot: result }));
      } else if (detectIsString(result) || detectIsNumber(result)) {
        result = Text(result);
      }

      component.children = result as Array<DarkElementInstance>;
      fiber.cleanup && fiber.markAtomHost();
      platform.detectIsPortal(inst) && fiber.markPortalHost();
    } catch (err) {
      if (err instanceof StopWork) {
        throw err;
      }

      component.children = [];
      fiber.setError(err);
      error(err);
    }
  } else if (detectIsVirtualNodeFactory(inst)) {
    inst = inst();
  }

  if (hasChildrenProp(inst)) {
    inst.children = flatten(inst.children, x => x || supportConditional(x));
    isComponent && component.children.length === 0 && component.children.push(createReplacer());
  }

  return inst;
}

function extractKeys(alternate: Fiber, children: Array<DarkElementInstance>) {
  let nextFiber = alternate;
  let idx = 0;
  const prevKeys: Array<Key> = [];
  const nextKeys: Array<Key> = [];
  const prevKeysMap: Record<Key, boolean> = {};
  const nextKeysMap: Record<Key, boolean> = {};
  const keyedFibersMap: Record<Key, Fiber> = {};
  const usedKeysMap: Record<Key, boolean> = {};

  while (nextFiber || idx < children.length) {
    if (nextFiber) {
      const key = getElementKey(nextFiber.inst);
      const prevKey = detectIsEmpty(key) ? createIndexKey(idx) : key;

      prevKeys.push(prevKey);
      prevKeysMap[prevKey] = true;
      keyedFibersMap[prevKey] = nextFiber;
    }

    if (children[idx]) {
      const instance = children[idx];
      const key = getElementKey(instance);
      const nextKey = detectIsEmpty(key) ? createIndexKey(idx) : key;

      if (process.env.NODE_ENV !== 'production') {
        if (usedKeysMap[nextKey]) {
          error(`[Dark]: The key of node [${nextKey}] already has been used!`, [instance]);
        }

        usedKeysMap[nextKey] = true;
      }

      nextKeys.push(nextKey);
      nextKeysMap[nextKey] = true;
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

function supportConditional(instance: DarkElementInstance) {
  return detectIsFalsy(instance) ? createReplacer() : instance;
}

function detectAreSameComponentTypesWithSameKeys(
  prevInstance: DarkElementInstance | null,
  nextInstance: DarkElementInstance | null,
) {
  if (
    prevInstance &&
    nextInstance &&
    detectIsComponent(prevInstance) &&
    detectIsComponent(nextInstance) &&
    detectAreSameInstanceTypes(prevInstance, nextInstance, true)
  ) {
    return getElementKey(prevInstance) === getElementKey(nextInstance);
  }

  return false;
}

function detectAreSameInstanceTypes(
  prevInstance: DarkElementInstance,
  nextInstance: DarkElementInstance,
  isComponentFactories = false,
) {
  if (process.env.NODE_ENV !== 'production') {
    if (process.env.NODE_ENV === 'development' && scope$$().getIsHot()) {
      if (detectIsComponent(prevInstance) && detectIsComponent(nextInstance)) {
        return prevInstance.dn === nextInstance.dn;
      }
    }
  }

  if (isComponentFactories) {
    const prevComponent = prevInstance as Component;
    const nextComponent = nextInstance as Component;

    return prevComponent.type === nextComponent.type;
  }

  return getInstanceType(prevInstance) === getInstanceType(nextInstance);
}

function getHook(alternate: Fiber, prevInstance: DarkElementInstance, nextInstance: DarkElementInstance): Hook | null {
  if (alternate && detectAreSameComponentTypesWithSameKeys(prevInstance, nextInstance)) return alternate.hook;
  if (detectIsComponent(nextInstance)) return createHook();

  return null;
}

function createHook(): Hook {
  return { idx: 0, values: [] };
}

function commit() {
  const scope$ = scope$$();

  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_ENV === 'development' && scope$.setIsHot(false);
  }

  const wipFiber = scope$.getWorkInProgress();
  const deletions = scope$.getDeletions();
  const candidates = scope$.getCandidates();
  const isUpdateZone = scope$.getIsUpdateZone();
  const unmounts: Array<Fiber> = [];

  // !
  for (const fiber of deletions) {
    const withNextTick = fiber.atomHost && !fiber.iefHost && !fiber.lefHost && !fiber.aefHost && !fiber.portalHost;

    withNextTick ? unmounts.push(fiber) : unmountFiber(fiber);
    fiber.tag = EffectTag.D;
    platform.commit(fiber);
  }

  scope$.runInsertionEffects();
  isUpdateZone && syncElementIndices(wipFiber);

  for (const fiber of candidates) {
    fiber.tag !== EffectTag.S && platform.commit(fiber);
    fiber.alt = null;
    hasChildrenProp(fiber.inst) && (fiber.inst.children = null);
  }

  wipFiber.alt = null;
  platform.finishCommit(); // !
  scope$.runLayoutEffects();
  scope$.runAsyncEffects();
  unmounts.length > 0 && setTimeout(() => unmounts.forEach(x => unmountFiber(x)));
  flush(wipFiber);
}

function flush(wipFiber: Fiber, cancel = false) {
  const scope$ = scope$$();

  !scope$.getIsUpdateZone() && scope$.setRoot(wipFiber); // !
  scope$.setWorkInProgress(null);
  scope$.setNextUnitOfWork(null);
  scope$.setCursorFiber(null);
  scope$.resetMount();
  scope$.resetCandidates();
  scope$.resetDeletions();
  scope$.resetCancels();
  scope$.resetInsertionEffects();
  scope$.resetLayoutEffects();
  scope$.resetAsyncEffects();
  scope$.setIsHydrateZone(false);
  scope$.setIsUpdateZone(false);
  scope$.resetActions();
  !cancel && emitter.emit('finish');
}

function syncElementIndices(fiber: Fiber) {
  const diff = fiber.cec - fiber.alt.cec;
  if (diff === 0) return;
  const parentFiber = getFiberWithElement(fiber.parent);
  let isRight = false;

  fiber.incChildElementCount(diff, true);

  walkFiber(parentFiber.child, (nextFiber, isReturn, resetIsDeepWalking, stop) => {
    if (nextFiber === parentFiber) return stop();
    if (nextFiber === fiber) {
      isRight = true;
      return resetIsDeepWalking();
    }

    if (nextFiber.element) {
      resetIsDeepWalking();
    }

    if (isRight && !isReturn) {
      nextFiber.eidx += diff;
    }
  });
}

function stopTransitionWork(): false {
  const scope$ = scope$$();
  const scope$$$ = scope$.copy();
  const wipFiber = scope$.getWorkInProgress();
  const child = wipFiber.child;

  child && (child.parent = null);

  const restoreTask = (options: RestoreOptions) => {
    const { fiber: wipFiber, setValue, resetValue } = options;
    const scope$ = scope$$();

    detectIsFunction(setValue) && setValue();
    detectIsFunction(resetValue) && scope$$$.addCancel(resetValue);

    wipFiber.alt = new Fiber().mutate(wipFiber);
    wipFiber.marker = '✌️';
    wipFiber.tag = EffectTag.U;
    wipFiber.child = child;
    child && (child.parent = wipFiber);

    scope$$$.setRoot(scope$.getRoot());
    scope$$$.setWorkInProgress(wipFiber);
    replaceScope(scope$$$);
  };

  wipFiber.child = wipFiber.alt.child;
  wipFiber.alt = null;
  scope$.applyCancels();
  flush(null, true);
  platform.cancelTask(restoreTask);

  return false;
}

export type CreateUpdateCallbackOptions = {
  rootId: number;
  isTransition?: boolean;
  getFiber: () => Fiber;
  createChanger?: () => UpdateChanger;
};

export type UpdateChanger = {
  shouldUpdate: () => boolean;
} & Pick<RestoreOptions, 'setValue' | 'resetValue'>;

function createUpdateCallback(options: CreateUpdateCallbackOptions) {
  const { rootId, getFiber, isTransition, createChanger = createChanger$ } = options;
  const callback = (restore?: (options: RestoreOptions) => void) => {
    setRootId(rootId); // !
    const { shouldUpdate, setValue, resetValue } = createChanger();
    const scope$ = scope$$();
    const fiber = getFiber();
    const fromRestore = detectIsFunction(restore);

    if (!shouldUpdate() || !detectIsFiberAlive(fiber) || fromRestore) {
      fromRestore && restore({ fiber, setValue, resetValue });
      return;
    }

    detectIsFunction(setValue) && setValue();
    detectIsFunction(resetValue) && isTransition && scope$.addCancel(resetValue);

    fiber.alt = new Fiber().mutate(fiber);
    fiber.marker = '🔥';
    fiber.tag = EffectTag.U;
    fiber.cc = 0;
    fiber.cec = 0;
    fiber.child = null;

    scope$.setIsUpdateZone(true);
    scope$.resetMount();
    scope$.setWorkInProgress(fiber);
    scope$.setCursorFiber(fiber);
    fiber.inst = mount(fiber);
    scope$.setNextUnitOfWork(fiber);
  };

  return callback;
}

const createChanger$ = (): UpdateChanger => ({
  shouldUpdate: trueFn,
  setValue: null,
  resetValue: null,
});

const detectIsBusy = () => Boolean(scope$$()?.getWorkInProgress());

class StopWork extends Error {}

export { Fiber, workLoop, createUpdateCallback, detectIsBusy };
