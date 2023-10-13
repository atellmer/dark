import { type RestoreOptions, platform, detectIsServer } from '../platform';
import { INDEX_KEY, TYPE, RESTART_TIMEOUT, Flag } from '../constants';
import {
  flatten,
  error,
  detectIsEmpty,
  detectIsFalsy,
  detectIsArray,
  detectIsString,
  detectIsNumber,
  detectIsFunction,
  trueFn,
} from '../helpers';
import { type Scope, setRootId, scope$$, replaceScope } from '../scope';
import { type Hook, Fiber, EffectTag } from '../fiber';
import type { DarkElementKey, DarkElementInstance } from '../shared';
import { type Component, detectIsComponent, getComponentKey, getComponentFlag } from '../component';
import {
  type TagVirtualNode,
  Text,
  detectIsVirtualNode,
  detectIsTagVirtualNode,
  detectIsVirtualNodeFactory,
  getTagVirtualNodeKey,
  getVirtualNodeFactoryKey,
  getTagVirtualNodeFlag,
  getVirtualNodeFactoryFlag,
  detectIsReplacer,
  createReplacer,
} from '../view';
import { detectIsMemo } from '../memo/utils';
import { detectIsLazy, detectIsLoaded } from '../lazy/utils';
import { hasEffects } from '../use-effect';
import { hasLayoutEffects } from '../use-layout-effect';
import { hasInsertionEffects } from '../use-insertion-effect';
import { walkFiber, getFiberWithElement, detectIsFiberAlive } from '../walk';
import { unmountFiber } from '../unmount';
import { Fragment, detectIsFragment } from '../fragment';
import { emitter } from '../emitter';

let hasError = false;

type Box = {
  fiber$$: Fiber;
  fiber$: Fiber;
  inst$: DarkElementInstance;
  scope$: Scope;
};

export type WorkLoop = (yield$: boolean) => boolean;

function workLoop(yield$: boolean) {
  if (hasError) return false;
  const scope$ = scope$$();
  const wipFiber = scope$.getWorkInProgress();
  let unit = scope$.getNextUnitOfWork();
  let shouldYield = false;
  let hasMoreWork = Boolean(unit);
  const box: Box = {
    fiber$$: null,
    fiber$: null,
    inst$: null,
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
      hasError = true;
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

    if (nextFiber.parent === null) return null;
  }
}

function mountChild(nextFiber: Fiber, box: Box) {
  box.scope$.navToChild();
  let inst$ = nextFiber.inst;
  const idx = 0;
  const inst = hasChildrenProp(inst$) ? inst$.children[idx] : null;
  const alt = getAlternate(nextFiber, inst, true);
  const fiber = new Fiber(
    getHook(alt, alt ? alt.inst : null, hasChildrenProp(inst$) ? inst$.children[idx] : null),
    alt ? alt.provider : null,
    idx,
  );

  box.scope$.setCursorFiber(fiber);
  fiber.parent = nextFiber;
  nextFiber.child = fiber;
  fiber.eidx = nextFiber.element ? 0 : nextFiber.eidx;
  inst$ = install(inst$, idx, fiber);
  fiber.inst = inst$;
  alt && performAlternate(fiber, alt);
  performCurrent(fiber, alt, inst$);
  alt && detectIsMemo(fiber.inst) && performMemo(fiber);

  box.scope$.addCandidate(fiber);

  box.fiber$$ = null;
  box.fiber$ = fiber;
  box.inst$ = inst$;
}

function mountSibling(nextFiber: Fiber, box: Box) {
  box.scope$.navToSibling();
  let inst$ = nextFiber.parent.inst;
  const idx = box.scope$.getMountIndex();
  const inst = hasChildrenProp(inst$) ? inst$.children[idx] : null;
  const hasSibling = Boolean(inst);

  if (hasSibling) {
    box.scope$.setMountDeep(true);
    const alt = getAlternate(nextFiber, inst, false);
    const fiber = new Fiber(
      getHook(alt, alt ? alt.inst : null, hasChildrenProp(inst$) ? inst$.children[idx] : null),
      alt ? alt.provider : null,
      idx,
    );

    box.scope$.setCursorFiber(fiber);
    fiber.parent = nextFiber.parent;
    nextFiber.next = fiber;
    fiber.eidx = nextFiber.eidx + (nextFiber.element ? 1 : nextFiber.cec);
    inst$ = install(inst$, idx, fiber);
    fiber.inst = inst$;
    alt && performAlternate(fiber, alt);
    performCurrent(fiber, alt, inst$);
    alt && detectIsMemo(fiber.inst) && performMemo(fiber);

    box.scope$.addCandidate(fiber);

    box.fiber$$ = fiber;
    box.fiber$ = fiber;
    box.inst$ = inst$;

    return;
  } else {
    box.scope$.navToParent();
    box.scope$.setMountDeep(false);
    nextFiber = nextFiber.parent;
    inst$ = nextFiber.inst;
  }

  box.fiber$$ = null;
  box.fiber$ = nextFiber;
  box.inst$ = inst$;
}

function getAlternate(fiber: Fiber, inst: DarkElementInstance, fromChild: boolean) {
  const key = getElementKey(inst);

  if (key !== null) {
    const scope$ = scope$$();
    const parentId = fromChild ? fiber.id : fiber.parent.id;
    const actions = scope$.getActionsById(parentId);

    if (actions) {
      const isMove = actions.move[key];
      const isStable = actions.stable[key];

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

function performCurrent(fiber: Fiber, alt: Fiber, inst: DarkElementInstance) {
  let isUpdate = false;

  fiber.parent.tag === EffectTag.C && (fiber.tag = fiber.parent.tag);
  fiber.parent.shadow && !fiber.parent.element && !detectIsReplacer(inst) && (fiber.shadow = true);

  if (fiber.tag !== EffectTag.C) {
    isUpdate =
      alt &&
      detectAreSameInstanceTypes(alt.inst, inst) &&
      (alt ? getElementKey(alt.inst) : null) === getElementKey(inst);
  }

  fiber.inst = inst;
  fiber.alt = alt || null;
  isUpdate && !fiber.element && alt.element && (fiber.element = alt.element);
  fiber.tag = isUpdate ? EffectTag.U : EffectTag.C;
  alt?.cleanup && alt.cleanup();
  hasChildrenProp(fiber.inst) && (fiber.cc = fiber.inst.children.length);

  if (!fiber.element && detectIsVirtualNode(fiber.inst)) {
    fiber.element = platform.createElement(fiber.inst);
    fiber.tag = EffectTag.C;
  }

  fiber.element && fiber.incCEC();
}

function performAlternate(fiber: Fiber, alt: Fiber) {
  const scope$ = scope$$();
  const instance = fiber.inst;
  const areSameTypes = detectAreSameInstanceTypes(alt.inst, instance);
  const flag = getElementFlag(instance);
  const NM = flag?.[Flag.NM];
  const fiberId = fiber.id;

  if (alt.move) {
    fiber.move = true;
    delete alt.move;
  }

  if (!areSameTypes) {
    scope$.addDeletion(alt);
  } else if (hasChildrenProp(alt.inst) && hasChildrenProp(instance) && alt.cc !== 0) {
    const hasSameCount = alt.cc === instance.children.length;

    if (NM ? !hasSameCount : true) {
      const { prevKeys, nextKeys, prevKeysMap, nextKeysMap, keyedFibersMap } = extractKeys(
        alt.child,
        instance.children,
      );
      const flush = nextKeys.length === 0;
      let size = Math.max(prevKeys.length, nextKeys.length);
      let p = 0;
      let n = 0;

      scope$.addActionMap(fiberId, keyedFibersMap);

      for (let i = 0; i < size; i++) {
        const nextKey = nextKeys[i - n] ?? null;
        const prevKey = prevKeys[i - p] ?? null;
        const prevKeyFiber = keyedFibersMap[prevKey] || null;

        if (nextKey !== prevKey) {
          if (nextKey !== null && !prevKeysMap[nextKey]) {
            if (prevKey !== null && !nextKeysMap[prevKey]) {
              scope$.addReplaceAction(fiberId, nextKey, prevKey);
              scope$.addDeletion(prevKeyFiber);
            } else {
              scope$.addInsertAction(fiberId, nextKey);
              p++;
              size++;
            }
          } else if (!nextKeysMap[prevKey]) {
            scope$.addRemoveAction(fiberId, prevKey);
            scope$.addDeletion(prevKeyFiber);
            flush && (prevKeyFiber.flush = true);
            n++;
            size++;
          } else if (nextKeysMap[prevKey] && nextKeysMap[nextKey]) {
            scope$.addMoveAction(fiberId, nextKey, prevKey);
          }
        } else if (nextKey !== null) {
          scope$.addStableAction(fiberId, nextKey);
        }
      }
    }
  }
}

function performMemo(fiber: Fiber) {
  const scope$ = scope$$();

  if (process.env.NODE_ENV !== 'production') {
    if (scope$.getIsHot()) return;
  }

  const alt = fiber.alt;
  const pc = alt.inst as Component;
  const nc = fiber.inst as Component;

  if (fiber.move || nc.type !== pc.type || nc.su(pc.props, nc.props)) return;

  scope$.setMountDeep(false);
  fiber.tag = EffectTag.S;
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

  fiber.incCEC(alt.cec);
  alt.efHost && fiber.markEFHost();
  alt.lefHost && fiber.markLEFHost();
  alt.iefHost && fiber.markIEFHost();
  alt.aHost && fiber.markAHost();
  alt.pHost && fiber.markPHost();
}

function install(instance: DarkElementInstance, idx: number, fiber: Fiber) {
  let instance$: DarkElementInstance = null;

  if (hasChildrenProp(instance)) {
    if (detectIsArray(instance.children[idx])) {
      instance.children.splice(idx, 1, ...flatten(instance.children[idx] as unknown as Array<DarkElementInstance>));
    }

    instance$ = mount(fiber, instance.children[idx]);

    if (detectIsComponent(instance$)) {
      hasEffects(fiber) && fiber.markEFHost();
      hasLayoutEffects(fiber) && fiber.markLEFHost();
      hasInsertionEffects(fiber) && fiber.markIEFHost();
      fiber.cleanup && fiber.markAHost();
      platform.detectIsPortal(instance$) && fiber.markPHost();
    }
  }

  return instance$;
}

function mount(fiber: Fiber, instance: DarkElementInstance) {
  let instance$ = instance;
  const isComponent = detectIsComponent(instance$);
  const component = instance$ as Component;

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

      if (detectIsArray(result) && !detectIsFragment(component)) {
        result = Fragment({ slot: result });
      } else if (detectIsString(result) || detectIsNumber(result)) {
        result = Text(result);
      }

      component.children = (detectIsArray(result) ? flatten(result) : [result]) as Array<DarkElementInstance>;
    } catch (err) {
      if (err instanceof StopWork) {
        throw err;
      }

      component.children = [];
      fiber.setError(err);
      error(err);
    }
  } else if (detectIsVirtualNodeFactory(instance$)) {
    instance$ = instance$();
  }

  if (hasChildrenProp(instance$)) {
    instance$.children = isComponent
      ? instance$.children
      : detectIsArray(instance$.children)
      ? flatten(instance$.children)
      : [instance$.children];

    for (let i = 0; i < instance$.children.length; i++) {
      if (instance$.children[i]) continue;
      instance$.children[i] = supportConditional(instance$.children[i]);
    }

    if (isComponent && component.children.length === 0) {
      component.children.push(createReplacer());
    }
  }

  return instance$;
}

function extractKeys(alternate: Fiber, children: Array<DarkElementInstance>) {
  let nextFiber = alternate;
  let idx = 0;
  const prevKeys: Array<DarkElementKey> = [];
  const nextKeys: Array<DarkElementKey> = [];
  const prevKeysMap: Record<DarkElementKey, boolean> = {};
  const nextKeysMap: Record<DarkElementKey, boolean> = {};
  const keyedFibersMap: Record<DarkElementKey, Fiber> = {};
  const usedKeysMap: Record<DarkElementKey, boolean> = {};

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

function createIndexKey(idx: number) {
  return `${INDEX_KEY}:${idx}`;
}

function getElementKey(instance: DarkElementInstance): DarkElementKey | null {
  const key = detectIsComponent(instance)
    ? getComponentKey(instance)
    : detectIsVirtualNodeFactory(instance)
    ? getVirtualNodeFactoryKey(instance)
    : detectIsTagVirtualNode(instance)
    ? getTagVirtualNodeKey(instance)
    : null;

  return key;
}

function getElementFlag(instance: DarkElementInstance): Record<Flag, boolean> | null {
  const flag = detectIsComponent(instance)
    ? getComponentFlag(instance)
    : detectIsVirtualNodeFactory(instance)
    ? getVirtualNodeFactoryFlag(instance)
    : detectIsTagVirtualNode(instance)
    ? getTagVirtualNodeFlag(instance)
    : null;

  return flag;
}

function supportConditional(instance: DarkElementInstance) {
  return detectIsFalsy(instance) ? createReplacer() : instance;
}

function getInstanceType(instance: DarkElementInstance): string | Function {
  return detectIsVirtualNodeFactory(instance)
    ? instance[TYPE]
    : detectIsTagVirtualNode(instance)
    ? instance.name
    : detectIsVirtualNode(instance)
    ? instance.type
    : detectIsComponent(instance)
    ? instance.type
    : null;
}

function hasChildrenProp(element: DarkElementInstance): element is TagVirtualNode | Component {
  return detectIsTagVirtualNode(element) || detectIsComponent(element);
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
  const queue: Array<Fiber> = [];

  // !
  for (const fiber of deletions) {
    if (fiber.aHost && !fiber.iefHost && !fiber.lefHost && !fiber.efHost && !fiber.pHost) {
      queue.push(fiber);
    } else {
      unmountFiber(fiber);
    }
    fiber.tag = EffectTag.D;
    platform.commit(fiber);
  }

  scope$.runInsertionEffects();
  isUpdateZone && syncElementIndices(wipFiber);

  for (const fiber of candidates) {
    fiber.tag !== EffectTag.S && platform.commit(fiber);
    fiber.alt = null;
    hasChildrenProp(fiber.inst) && (fiber.inst.children = []);
  }

  wipFiber.alt = null;
  platform.finishCommit();

  scope$.runLayoutEffects();
  scope$.runAsyncEffects();

  queue.length > 0 &&
    setTimeout(() => {
      for (const fiber of queue) {
        unmountFiber(fiber);
      }
    });

  flush(wipFiber);
  // console.log('wipFiber', wipFiber);
}

function flush(wipFiber: Fiber, transition = false) {
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
  !transition && emitter.emit('finish');
}

function syncElementIndices(fiber: Fiber) {
  const diff = fiber.cec - fiber.alt.cec;
  if (diff === 0) return;
  const parentFiber = getFiberWithElement(fiber.parent);
  let isRight = false;

  fiber.incCEC(diff, true);

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

  platform.cancelTask((options: RestoreOptions) => {
    const { fiber: wipFiber, setValue, resetValue } = options;
    const scope$ = scope$$();

    detectIsFunction(setValue) && setValue();
    detectIsFunction(resetValue) && scope$$$.addCancel(resetValue);

    // console.log('----restore----');
    wipFiber.alt = new Fiber().mutate(wipFiber);
    wipFiber.marker = '✌️';
    wipFiber.tag = EffectTag.U;
    wipFiber.child = child;
    child && (child.parent = wipFiber);

    scope$$$.setRoot(scope$.getRoot());
    scope$$$.setWorkInProgress(wipFiber);
    replaceScope(scope$$$);
  });

  //console.log('----stop----');
  wipFiber.child = wipFiber.alt.child;
  wipFiber.alt = null;
  scope$.applyCancels();
  flush(null, true);

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
    fiber.inst = mount(fiber, fiber.inst);
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
