import { type RestoreOptions, platform, detectIsServer } from '../platform';
import { INDEX_KEY, TYPE, RESTART_TIMEOUT, Flag, TaskPriority } from '../constants';
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
import type { DarkElementKey, DarkElement, DarkElementInstance } from '../shared';
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
      if (platform.hasPrimaryTask()) return stopLowPriorityWork();
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
  let instance$ = nextFiber.inst;
  const childrenIdx = 0;
  const alternate = nextFiber.alt ? nextFiber.alt.child : null;
  const fiber = new Fiber(
    getHook(
      alternate,
      alternate ? alternate.inst : null,
      hasChildrenProp(instance$) ? instance$.children[childrenIdx] : null,
    ),
    alternate ? alternate.provider : null,
    childrenIdx,
  );

  box.scope$.setCursorFiber(fiber);
  fiber.parent = nextFiber;
  nextFiber.child = fiber;
  fiber.eidx = nextFiber.element ? 0 : nextFiber.eidx;
  instance$ = install(instance$, childrenIdx, fiber);
  fiber.inst = instance$;
  alternate && alt(fiber, alternate);
  current(fiber, alternate, instance$);
  alternate && detectIsMemo(fiber.inst) && memo(fiber);

  box.scope$.addCandidate(fiber);

  box.fiber$$ = null;
  box.fiber$ = fiber;
  box.inst$ = instance$;
}

function mountSibling(nextFiber: Fiber, box: Box) {
  box.scope$.navToSibling();
  let instance$ = nextFiber.parent.inst;
  const childrenIdx = box.scope$.getMountIndex();
  const hasSibling = hasChildrenProp(instance$) && instance$.children[childrenIdx];

  if (hasSibling) {
    box.scope$.setMountDeep(true);
    const alternate = nextFiber.alt ? nextFiber.alt.next : null;
    const fiber = new Fiber(
      getHook(
        alternate,
        alternate ? alternate.inst : null,
        hasChildrenProp(instance$) ? instance$.children[childrenIdx] : null,
      ),
      alternate ? alternate.provider : null,
      childrenIdx,
    );

    box.scope$.setCursorFiber(fiber);
    fiber.parent = nextFiber.parent;
    nextFiber.next = fiber;
    fiber.eidx = nextFiber.eidx + (nextFiber.element ? 1 : nextFiber.cec);
    instance$ = install(instance$, childrenIdx, fiber);
    fiber.inst = instance$;
    alternate && alt(fiber, alternate);
    current(fiber, alternate, instance$);
    alternate && detectIsMemo(fiber.inst) && memo(fiber);

    box.scope$.addCandidate(fiber);

    box.fiber$$ = fiber;
    box.fiber$ = fiber;
    box.inst$ = instance$;

    return;
  } else {
    box.scope$.navToParent();
    box.scope$.setMountDeep(false);
    nextFiber = nextFiber.parent;
    instance$ = nextFiber.inst;

    if (hasChildrenProp(nextFiber.inst)) {
      nextFiber.inst.children = [];
    }
  }

  box.fiber$$ = null;
  box.fiber$ = nextFiber;
  box.inst$ = instance$;
}

function current(fiber: Fiber, alt: Fiber, inst: DarkElementInstance) {
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
  fiber.element = fiber.element || (isUpdate ? alt.element : null);
  fiber.tag = isUpdate ? EffectTag.U : EffectTag.C;
  alt?.cleanup && alt.cleanup();

  if (alt && alt.move) {
    fiber.move = alt.move;
    alt.move = false;
  }

  if (hasChildrenProp(fiber.inst)) {
    fiber.cc = fiber.inst.children.length;
  }

  if (!fiber.element && detectIsVirtualNode(fiber.inst)) {
    fiber.element = platform.createElement(fiber.inst);
    fiber.tag = EffectTag.C;
  }

  fiber.element && fiber.incCEC();
}

function insertToFiber(idx: number, fiber: Fiber, child: Fiber) {
  if (idx === 0 || (fiber.child && fiber.child.tag === EffectTag.D)) {
    fiber.child = child;
    child.parent = fiber;
  } else {
    fiber.next = child;
    child.parent = fiber.parent;
  }

  return child;
}

function createConditionalFiber(alternate: Fiber, marker?: DarkElementKey) {
  return new Fiber().mutate({
    tag: EffectTag.C,
    inst: createReplacer(),
    parent: alternate,
    marker,
  });
}

function canAddToDeletions(fiber: Fiber) {
  let nextFiber = fiber.parent;

  while (nextFiber) {
    if (nextFiber.tag === EffectTag.D) return false;
    nextFiber = nextFiber.parent;
  }

  return true;
}

function alt(fiber: Fiber, alternate: Fiber) {
  const scope$ = scope$$();
  const instance = fiber.inst;
  const areSameTypes = detectAreSameInstanceTypes(alternate.inst, instance);
  const flag = getElementFlag(instance);
  const NM = flag?.[Flag.NM];

  if (!areSameTypes) {
    if (canAddToDeletions(alternate)) {
      alternate.tag = EffectTag.D;
      scope$.addDeletion(alternate);
    }
  } else if (hasChildrenProp(alternate.inst) && hasChildrenProp(instance) && alternate.cc !== 0) {
    const hasSameCount = alternate.cc === instance.children.length;

    if (NM ? !hasSameCount : true) {
      const { prevKeys, nextKeys, prevKeysMap, nextKeysMap, keyedFibersMap } = extractKeys(
        alternate.child,
        instance.children,
      );
      const flush = nextKeys.length === 0;
      let result: Array<[DarkElement | [DarkElementKey, DarkElementKey], string]> = [];
      let size = Math.max(prevKeys.length, nextKeys.length);
      let nextFiber = alternate;
      let idx = 0;
      let p = 0;
      let n = 0;

      if (nextKeys.length === 9) {
        console.log('fiber', fiber);
        console.log('alternate', alternate);
      }

      for (let i = 0; i < size; i++) {
        const nextKey = nextKeys[i - n] ?? null;
        const prevKey = prevKeys[i - p] ?? null;
        const prevKeyFiber = keyedFibersMap[prevKey] || null;
        const nextKeyFiber = keyedFibersMap[nextKey] || createConditionalFiber(alternate, nextKey);

        if (nextKey !== prevKey) {
          if (nextKey !== null && !prevKeysMap[nextKey]) {
            if (prevKey !== null && !nextKeysMap[prevKey]) {
              process.env.NODE_ENV !== 'production' && result.push([[nextKey, prevKey], 'replace']);
              nextKeyFiber.tag = EffectTag.C;
              prevKeyFiber.tag = EffectTag.D;
              scope$.addDeletion(prevKeyFiber);
            } else {
              process.env.NODE_ENV !== 'production' && result.push([nextKey, 'insert']);
              nextKeyFiber.tag = EffectTag.C;
              p++;
              size++;
            }
            nextFiber = insertToFiber(i, nextFiber, nextKeyFiber);
          } else if (!nextKeysMap[prevKey]) {
            process.env.NODE_ENV !== 'production' && result.push([prevKey, 'remove']);
            prevKeyFiber.tag = EffectTag.D;
            scope$.addDeletion(prevKeyFiber);
            flush && (prevKeyFiber.flush = true);
            n++;
            idx--;
            size++;
          } else if (nextKeysMap[prevKey] && nextKeysMap[nextKey]) {
            process.env.NODE_ENV !== 'production' && result.push([[nextKey, prevKey], 'move']);
            nextKeyFiber.tag = EffectTag.U;
            prevKeyFiber.tag = EffectTag.U;
            nextKeyFiber.move = true;
            nextFiber = insertToFiber(i, nextFiber, nextKeyFiber);
          }
        } else if (nextKey !== null) {
          process.env.NODE_ENV !== 'production' && result.push([nextKey, 'stable']);
          //nextKeyFiber.tag = EffectTag.U;
          nextFiber = insertToFiber(i, nextFiber, nextKeyFiber);
        }

        nextKeyFiber.idx = idx;
        idx++;
      }

      result = [];
    }
  }
}

function memo(fiber: Fiber) {
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
  fiber.element = alt.element;
  fiber.child = alt.child; // same links
  fiber.child.parent = fiber;
  fiber.hook = alt.hook;
  fiber.cc = alt.cc;
  fiber.cec = alt.cec;
  alt?.provider && (fiber.provider = alt.provider);
  alt?.catch && (fiber.catch = alt.catch);
  alt?.cleanup && (fiber.cleanup = alt.cleanup);

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
    platform.commit(fiber);
  }

  scope$.runInsertionEffects();
  isUpdateZone && syncElementIndices(wipFiber);

  for (const fiber of candidates) {
    fiber.tag !== EffectTag.S && platform.commit(fiber);
    fiber.alt = null;
    fiber.reserve = null;
  }

  wipFiber.alt = null;
  wipFiber.reserve = null;
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
  //console.log('wipFiber', wipFiber);
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

function stopLowPriorityWork(): false {
  const scope$ = scope$$();
  const copy = scope$.copy();
  const wipFiber = scope$.getWorkInProgress();
  const child = wipFiber.child;

  child.parent = null;
  copy.setRoot(null);
  copy.setWorkInProgress(null);

  platform.cancelTask((options: RestoreOptions) => {
    const { fiber: wipFiber, setValue, resetValue } = options;
    const scope$ = scope$$();
    const root = scope$.getRoot();

    console.log('----restore----');

    wipFiber.marker = '✌️';
    wipFiber.alt = null;
    wipFiber.reserve = null;
    wipFiber.alt = new Fiber().mutate(wipFiber);
    wipFiber.reserve = wipFiber.child;
    wipFiber.child = child || null;
    child && (child.parent = wipFiber);

    copy.setRoot(root);
    copy.setWorkInProgress(wipFiber);
    detectIsFunction(setValue) && setValue();
    detectIsFunction(resetValue) && copy.addCancel(resetValue);

    replaceScope(copy);
  });

  //console.log('----stop----');

  wipFiber.child = wipFiber.reserve;
  wipFiber.alt = null;
  wipFiber.reserve = null;
  wipFiber.child?.hook && (wipFiber.child.hook.idx = 0);
  scope$.applyCancels();
  flush(null, true);

  return false;
}

export type CreateUpdateCallbackOptions = {
  rootId: number;
  isTransition?: boolean;
  priority?: TaskPriority;
  getFiber: () => Fiber;
  createChanger?: () => UpdateChanger;
};

export type UpdateChanger = {
  shouldUpdate: () => boolean;
} & Pick<RestoreOptions, 'setValue' | 'resetValue'>;

function createUpdateCallback(options: CreateUpdateCallbackOptions) {
  const { rootId, getFiber, priority, isTransition, createChanger = createChanger$ } = options;
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
    fiber.reserve = fiber.child;
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
