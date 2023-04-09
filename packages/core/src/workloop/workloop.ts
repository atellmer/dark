import { platform, detectIsServer } from '../platform';
import { INDEX_KEY, TYPE, Flag } from '../constants';
import {
  flatten,
  error,
  detectIsEmpty,
  detectIsFalsy,
  detectIsArray,
  detectIsString,
  detectIsNumber,
} from '../helpers';
import {
  wipRootStore,
  currentRootStore,
  nextUnitOfWorkStore,
  candidatesStore,
  deletionsStore,
  mountStore,
  currentFiberStore,
  isUpdateHookZone,
  isStreamZone,
  rootStore,
  effectsStore,
  layoutEffectsStore,
  insertionEffectsStore,
  isLayoutEffectsZone,
  isInsertionEffectsZone,
  isHydrateZone,
  hot,
} from '../scope';
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
  createReplacer,
} from '../view';
import { detectIsMemo } from '../memo/utils';
import { detectIsLazy, detectIsLoaded } from '../lazy/utils';
import { hasEffects } from '../use-effect';
import { hasLayoutEffects } from '../use-layout-effect';
import { hasInsertionEffects } from '../use-insertion-effect';
import { walkFiber, getFiberWithElement } from '../walk';
import { unmountFiber } from '../unmount';
import { Fragment, detectIsFragment } from '../fragment';

type Box = {
  fiber$$: Fiber;
  fiber$: Fiber;
  inst$: DarkElementInstance;
};

export type WorkLoop = (yield$: boolean) => boolean;

function workLoop(yield$: boolean) {
  const wipFiber = wipRootStore.get();
  let nextUnitOfWork = nextUnitOfWorkStore.get();
  let shouldYield = false;
  let hasMoreWork = Boolean(nextUnitOfWork);
  const box: Box = {
    fiber$$: null,
    fiber$: null,
    inst$: null,
  };

  try {
    while (nextUnitOfWork && !shouldYield) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork, box);
      nextUnitOfWorkStore.set(nextUnitOfWork);
      hasMoreWork = Boolean(nextUnitOfWork);
      shouldYield = yield$ && platform.shouldYield();
    }
  } catch (stop) {
    !yield$ && setTimeout(() => workLoop(false));
  }

  if (!nextUnitOfWork && wipFiber) {
    commit();
  }

  return hasMoreWork;
}

function performUnitOfWork(fiber: Fiber, box: Box) {
  let isDeepWalking = true;
  let nextFiber = fiber;
  let instance = fiber.inst;
  const isStream = isStreamZone.get();

  while (true) {
    isDeepWalking = mountStore.deep.get();
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
  mountStore.toChild();
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

  currentFiberStore.set(fiber);
  fiber.parent = nextFiber;
  nextFiber.child = fiber;
  fiber.eidx = nextFiber.element ? 0 : nextFiber.eidx;
  instance$ = install(instance$, childrenIdx, fiber);
  fiber.inst = instance$;
  alternate && alt(fiber, alternate);
  current(fiber, alternate, instance$);
  alternate && detectIsMemo(fiber.inst) && memo(fiber);

  candidatesStore.add(fiber);

  box.fiber$$ = null;
  box.fiber$ = fiber;
  box.inst$ = instance$;
}

function mountSibling(nextFiber: Fiber, box: Box) {
  mountStore.toSibling();
  let instance$ = nextFiber.parent.inst;
  const childrenIdx = mountStore.getIndex();
  const hasSibling = hasChildrenProp(instance$) && instance$.children[childrenIdx];

  if (hasSibling) {
    mountStore.deep.set(true);
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

    currentFiberStore.set(fiber);
    fiber.parent = nextFiber.parent;
    nextFiber.next = fiber;
    fiber.eidx = nextFiber.eidx + (nextFiber.element ? 1 : nextFiber.cec);
    instance$ = install(instance$, childrenIdx, fiber);
    fiber.inst = instance$;
    alternate && alt(fiber, alternate);
    current(fiber, alternate, instance$);
    alternate && detectIsMemo(fiber.inst) && memo(fiber);

    candidatesStore.add(fiber);

    box.fiber$$ = fiber;
    box.fiber$ = fiber;
    box.inst$ = instance$;

    return;
  } else {
    mountStore.toParent();
    mountStore.deep.set(false);
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

function current(fiber: Fiber, alternate: Fiber, instance: DarkElementInstance) {
  let isUpdate = false;

  fiber.parent.tag === EffectTag.C && (fiber.tag = fiber.parent.tag);

  if (fiber.tag !== EffectTag.C) {
    isUpdate =
      alternate &&
      detectAreSameInstanceTypes(alternate.inst, instance) &&
      (alternate ? getElementKey(alternate.inst) : null) === getElementKey(instance);
  }

  fiber.inst = instance;
  fiber.alt = alternate || null;
  fiber.element = fiber.element || (isUpdate ? alternate.element : null);
  fiber.tag = isUpdate ? EffectTag.U : EffectTag.C;
  alternate?.cleanup && alternate.cleanup();

  if (alternate && alternate.move) {
    fiber.move = alternate.move;
    alternate.move = false;
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
    marker: marker + '',
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
  const instance = fiber.inst;
  const areSameTypes = detectAreSameInstanceTypes(alternate.inst, instance);
  const flag = getElementFlag(instance);
  const NM = flag?.[Flag.NM];

  alternate.used = true;

  if (!areSameTypes) {
    if (canAddToDeletions(alternate)) {
      alternate.tag = EffectTag.D;
      deletionsStore.add(alternate);
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
              deletionsStore.add(prevKeyFiber);
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
            deletionsStore.add(prevKeyFiber);
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
          nextKeyFiber.tag = EffectTag.U;
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
  if (process.env.NODE_ENV !== 'production') {
    if (hot.get()) return;
  }

  const alternate = fiber.alt;
  const pc = alternate.inst as Component;
  const nc = fiber.inst as Component;

  if (fiber.move || nc.type !== pc.type || nc.su(pc.props, nc.props)) return;

  mountStore.deep.set(false);
  fiber.tag = EffectTag.S;
  fiber.alt = alternate;
  fiber.element = alternate.element;
  fiber.child = alternate.child;
  fiber.hook = alternate.hook;
  fiber.provider = alternate.provider;
  fiber.cc = alternate.cc;
  fiber.cec = alternate.cec;
  fiber.catch = alternate.catch;
  alternate?.cleanup && (fiber.cleanup = alternate.cleanup);
  fiber.child && (fiber.child.parent = fiber);

  const diff = fiber.eidx - alternate.eidx;
  const deep = diff !== 0;

  if (deep) {
    walkFiber(fiber.child, (nextFiber, _, __, stop) => {
      if (nextFiber === fiber.next || nextFiber === fiber.parent) return stop();
      nextFiber.eidx += diff;
      if (nextFiber.parent !== fiber && nextFiber.element) return stop();
    });
  }

  fiber.incCEC(alternate.cec);
  alternate.efHost && fiber.markEFHost();
  alternate.lefHost && fiber.markLEFHost();
  alternate.iefHost && fiber.markIEFHost();
  alternate.aHost && fiber.markAHost();
  alternate.pHost && fiber.markPHost();
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

      if (detectIsLazy(component) && !detectIsLoaded(component) && isHydrateZone.get()) {
        console.log('xxx');
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
    if (process.env.NODE_ENV === 'development' && hot.get()) {
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
  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_ENV === 'development' && hot.set(false);
  }
  const wipFiber = wipRootStore.get();
  const isDynamic = platform.detectIsDynamic();
  const deletions = deletionsStore.get();
  const candidates = candidatesStore.get();
  const isUpdate = isUpdateHookZone.get();

  // important order
  for (const fiber of deletions) {
    unmountFiber(fiber);
    platform.commit(fiber);
  }

  isDynamic && runInsertionEffects();
  isUpdate && syncElementIndices(wipFiber);

  for (const fiber of candidates) {
    fiber.tag !== EffectTag.S && platform.commit(fiber);
    fiber.alt = null;
  }

  wipFiber.alt = null;
  platform.finishCommit();

  isDynamic && runLayoutEffects();
  isDynamic && runEffects();

  flush(wipFiber);
}

function runInsertionEffects() {
  isInsertionEffectsZone.set(true);
  insertionEffectsStore.get().forEach(fn => fn());
  isInsertionEffectsZone.set(false);
}

function runLayoutEffects() {
  isLayoutEffectsZone.set(true);
  layoutEffectsStore.get().forEach(fn => fn());
  isLayoutEffectsZone.set(false);
}

function runEffects() {
  const effects = effectsStore.get();

  effects.length > 0 && setTimeout(() => effects.forEach(fn => fn()));
}

function flush(wipFiber: Fiber) {
  wipRootStore.set(null); // important order
  candidatesStore.reset();
  deletionsStore.reset();
  insertionEffectsStore.reset();
  layoutEffectsStore.reset();
  effectsStore.reset();
  isHydrateZone.set(false);

  if (isUpdateHookZone.get()) {
    isUpdateHookZone.set(false);
  } else {
    currentRootStore.set(wipFiber);
  }
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

type CreateUpdateCallbackOptions = {
  rootId: number;
  fiber: Fiber;
  forceStart?: boolean;
  onStart?: () => void;
};

function createUpdateCallback(options: CreateUpdateCallbackOptions) {
  const { rootId, fiber, forceStart = false, onStart } = options;
  const callback = () => {
    if (fiber.tag === EffectTag.D) return;
    forceStart && onStart && onStart();
    if (fiber.used) return;
    !forceStart && onStart && onStart();
    rootStore.set(rootId); // important order!
    isUpdateHookZone.set(true);
    mountStore.reset();

    fiber.alt = new Fiber().mutate(fiber);
    fiber.marker = '🔥';
    fiber.tag = EffectTag.U;
    fiber.cc = 0;
    fiber.cec = 0;
    fiber.child = null;

    wipRootStore.set(fiber);
    currentFiberStore.set(fiber);
    fiber.inst = mount(fiber, fiber.inst);
    nextUnitOfWorkStore.set(fiber);
  };

  return callback;
}

const detectIsBusy = () => Boolean(wipRootStore.get());

class StopWork extends Error {}

export { Fiber, workLoop, createUpdateCallback, detectIsBusy };
