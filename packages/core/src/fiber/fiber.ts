import { platform } from '../platform';
import {
  flatten,
  error,
  detectIsEmpty,
  detectIsFalsy,
  detectIsArray,
  detectIsString,
  detectIsNumber,
  detectIsFunction,
} from '../helpers';
import {
  wipRootStore,
  currentRootStore,
  nextUnitOfWorkStore,
  candidatesStore,
  deletionsStore,
  fiberMountStore,
  currentFiberStore,
  isUpdateHookZone,
  rootStore,
  effectsStore,
  layoutEffectsStore,
  insertionEffectsStore,
  isLayoutEffectsZone,
  isInsertionEffectsZone,
  detectHasRegisteredLazy,
  isHydrateZone,
  hot,
} from '../scope';
import { type Component, detectIsComponent, getComponentKey, getComponentFlag } from '../component';
import {
  type TagVirtualNode,
  detectIsVirtualNode,
  detectIsTagVirtualNode,
  detectIsVirtualNodeFactory,
  getTagVirtualNodeKey,
  getVirtualNodeFactoryKey,
  getTagVirtualNodeFlag,
  getVirtualNodeFactoryFlag,
  detectIsPlainVirtualNode,
  createReplacer,
} from '../view';
import { detectIsMemo } from '../memo';
import type { Context, ContextProviderValue } from '../context';
import type { DarkElementKey, DarkElement, DarkElementInstance } from '../shared';
import { INDEX_KEY, TYPE, Flag } from '../constants';
import { type NativeElement, type Hook, EffectTag } from './types';
import { hasEffects } from '../use-effect';
import { hasLayoutEffects } from '../use-layout-effect';
import { hasInsertionEffects } from '../use-insertion-effect';
import { walkFiber } from '../walk';
import { unmountFiber } from '../unmount';
import { Text } from '../view';
import { Fragment, detectIsFragment } from '../fragment';

const cloneTagMap = {
  [EffectTag.CREATE]: true,
};

class Fiber<N = NativeElement> {
  public id = 0;
  public nativeElement: N = null;
  public parent: Fiber<N> = null;
  public child: Fiber<N> = null;
  public nextSibling: Fiber<N> = null;
  public alternate: Fiber<N> = null;
  public move = false;
  public effectTag: EffectTag = null;
  public instance: DarkElementInstance = null;
  public hook: Hook | null = null;
  public provider: Map<Context, ContextProviderValue> = null;
  public effectHost = false;
  public layoutEffectHost = false;
  public insertionEffectHost = false;
  public portalHost = false;
  public childrenCount = 0;
  public childrenElementsCount = 0;
  public marker = '';
  public isUsed = false;
  public idx = 0;
  public elementIdx = 0;
  public batched: number | NodeJS.Timeout | null = null;
  public flush = false;
  public catchException: (error: Error) => void;
  private static nextId = 0;

  constructor(hook: Hook = null, provider: Fiber['provider'] = null, idx = 0) {
    this.id = ++Fiber.nextId;
    this.hook = hook;
    this.provider = provider;
    this.idx = idx;
  }

  public mutate(options: Partial<Fiber<N>>) {
    const keys = Object.keys(options);

    for (const key of keys) {
      this[key] = options[key];
    }

    return this;
  }

  public markEffectHost() {
    this.effectHost = true;
    this.parent && !this.parent.effectHost && this.parent.markEffectHost();
  }

  public markLayoutEffectHost() {
    this.layoutEffectHost = true;
    this.parent && !this.parent.layoutEffectHost && this.parent.markLayoutEffectHost();
  }

  public markInsertionEffectHost() {
    this.insertionEffectHost = true;
    this.parent && !this.parent.insertionEffectHost && this.parent.markInsertionEffectHost();
  }

  public markPortalHost() {
    this.portalHost = true;
    this.parent && !this.parent.portalHost && this.parent.markPortalHost();
  }

  public incrementChildrenElementsCount(count = 1, force = false) {
    incrementChildrenElementsCount(this, count, force);
  }

  public setError(error: Error) {
    if (detectIsFunction(this.catchException)) {
      this.catchException(error);
    } else if (this.parent) {
      this.parent.setError(error);
    }
  }
}

type Box = {
  fiber$$: Fiber;
  fiber$: Fiber;
  instance$: DarkElementInstance;
};

function workLoop() {
  const wipFiber = wipRootStore.get();
  let nextUnitOfWork = nextUnitOfWorkStore.get();
  let shouldYield = false;
  let hasMoreWork = Boolean(nextUnitOfWork);
  const box: Box = {
    fiber$$: null,
    fiber$: null,
    instance$: null,
  };

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork, box);
    nextUnitOfWorkStore.set(nextUnitOfWork);
    hasMoreWork = Boolean(nextUnitOfWork);
    shouldYield = platform.shouldYeildToHost();
  }

  if (!nextUnitOfWork && wipFiber) {
    commitChanges();
  }

  return hasMoreWork;
}

function performUnitOfWork(fiber: Fiber, box: Box) {
  let isDeepWalking = true;
  let nextFiber = fiber;
  let instance = fiber.instance;

  while (true) {
    isDeepWalking = fiberMountStore.deepWalking.get();
    nextFiber.hook && (nextFiber.hook.idx = 0);

    if (isDeepWalking) {
      const hasChildren = hasChildrenProp(instance) && instance.children.length > 0;

      if (hasChildren) {
        performChild(nextFiber, box);

        nextFiber = box.fiber$;
        instance = box.instance$;

        box.fiber$$ = null;
        box.fiber$ = null;
        box.instance$ = null;

        if (nextFiber) return nextFiber;
      } else {
        performSibling(nextFiber, box);

        const nextFiber$ = box.fiber$$;

        nextFiber = box.fiber$;
        instance = box.instance$;

        box.fiber$$ = null;
        box.fiber$ = null;
        box.instance$ = null;

        if (nextFiber$) return nextFiber$;
      }
    } else {
      performSibling(nextFiber, box);

      const nextFiber$ = box.fiber$$;

      nextFiber = box.fiber$;
      instance = box.instance$;

      box.fiber$$ = null;
      box.fiber$ = null;
      box.instance$ = null;

      if (nextFiber$) return nextFiber$;
    }

    if (nextFiber.parent === null) return null;
  }
}

function performChild(nextFiber: Fiber, box: Box) {
  fiberMountStore.jumpToChild();
  let instance$ = nextFiber.instance;
  const childrenIdx = 0;
  const alternate = nextFiber.alternate ? nextFiber.alternate.child : null;
  const fiber = new Fiber(
    getHook(
      alternate,
      alternate ? alternate.instance : null,
      hasChildrenProp(instance$) ? instance$.children[childrenIdx] : null,
    ),
    alternate ? alternate.provider : null,
    childrenIdx,
  );

  currentFiberStore.set(fiber);
  fiber.parent = nextFiber;
  nextFiber.child = fiber;
  fiber.elementIdx = nextFiber.nativeElement ? 0 : nextFiber.elementIdx;
  instance$ = pertformInstance(instance$, childrenIdx, fiber);
  alternate && performAlternate(alternate, instance$);
  performFiber(fiber, alternate, instance$);
  alternate && detectIsMemo(fiber.instance) && performMemo(fiber);

  candidatesStore.add(fiber);

  box.fiber$$ = null;
  box.fiber$ = fiber;
  box.instance$ = instance$;
}

function performSibling(nextFiber: Fiber, box: Box) {
  fiberMountStore.jumpToSibling();
  let instance$ = nextFiber.parent.instance;
  const childrenIdx = fiberMountStore.getIndex();
  const hasSibling = hasChildrenProp(instance$) && instance$.children[childrenIdx];

  if (hasSibling) {
    fiberMountStore.deepWalking.set(true);
    const alternate = nextFiber.alternate ? nextFiber.alternate.nextSibling : null;
    const fiber = new Fiber(
      getHook(
        alternate,
        alternate ? alternate.instance : null,
        hasChildrenProp(instance$) ? instance$.children[childrenIdx] : null,
      ),
      alternate ? alternate.provider : null,
      childrenIdx,
    );

    currentFiberStore.set(fiber);
    fiber.parent = nextFiber.parent;
    nextFiber.nextSibling = fiber;
    fiber.elementIdx = nextFiber.elementIdx + (nextFiber.nativeElement ? 1 : nextFiber.childrenElementsCount);
    instance$ = pertformInstance(instance$, childrenIdx, fiber);
    alternate && performAlternate(alternate, instance$);
    performFiber(fiber, alternate, instance$);
    alternate && detectIsMemo(fiber.instance) && performMemo(fiber);

    candidatesStore.add(fiber);

    box.fiber$$ = fiber;
    box.fiber$ = fiber;
    box.instance$ = instance$;

    return;
  } else {
    fiberMountStore.jumpToParent();
    fiberMountStore.deepWalking.set(false);
    nextFiber = nextFiber.parent;
    instance$ = nextFiber.instance;

    if (hasChildrenProp(nextFiber.instance)) {
      nextFiber.instance.children = [];
    }
  }

  box.fiber$$ = null;
  box.fiber$ = nextFiber;
  box.instance$ = instance$;
}

function incrementChildrenElementsCount(fiber: Fiber, count = 1, force = false) {
  if (!fiber.parent) return;
  const fromUpdate = isUpdateHookZone.get();
  const wipFiber = wipRootStore.get();
  const stop = fromUpdate && wipFiber.parent === fiber.parent;

  if (
    detectIsPlainVirtualNode(fiber.instance) ||
    (detectIsTagVirtualNode(fiber.instance) && fiber.instance.children.length === 0)
  ) {
    fiber.childrenElementsCount = 1;
  }

  if (fromUpdate && stop && !force) return;

  fiber.parent.childrenElementsCount += count;

  if (!fiber.parent.nativeElement) {
    fiber.parent.incrementChildrenElementsCount(count);
  }
}

function performFiber(fiber: Fiber, alternate: Fiber, instance: DarkElementInstance) {
  let isUpdate = false;

  cloneTagMap[fiber.parent.effectTag] && (fiber.effectTag = fiber.parent.effectTag);

  if (fiber.effectTag !== EffectTag.CREATE) {
    isUpdate =
      alternate &&
      detectAreSameInstanceTypes(alternate.instance, instance) &&
      (alternate ? getElementKey(alternate.instance) : null) === getElementKey(instance);
  }

  fiber.instance = instance;
  fiber.alternate = alternate || null;
  fiber.nativeElement = isUpdate ? alternate.nativeElement : null;
  fiber.effectTag = isUpdate ? EffectTag.UPDATE : EffectTag.CREATE;

  if (alternate && alternate.move) {
    fiber.move = alternate.move;
    alternate.move = false;
  }

  if (hasChildrenProp(fiber.instance)) {
    fiber.childrenCount = fiber.instance.children.length;
  }

  if (!fiber.nativeElement && detectIsVirtualNode(fiber.instance)) {
    fiber.nativeElement = platform.createNativeElement(fiber.instance);
    fiber.effectTag = EffectTag.CREATE;
  }

  fiber.nativeElement && fiber.incrementChildrenElementsCount();
}

function insertToFiber(idx: number, fiber: Fiber, child: Fiber) {
  if (idx === 0 || (fiber.child && fiber.child.effectTag === EffectTag.DELETE)) {
    fiber.child = child;
    child.parent = fiber;
  } else {
    fiber.nextSibling = child;
    child.parent = fiber.parent;
  }

  return child;
}

function createConditionalFiber(alternate: Fiber, marker?: DarkElementKey) {
  return new Fiber().mutate({
    effectTag: EffectTag.CREATE,
    instance: createReplacer(),
    parent: alternate,
    marker: marker + '',
  });
}

function canAddToDeletions(fiber: Fiber) {
  let nextFiber = fiber.parent;

  while (nextFiber) {
    if (nextFiber.effectTag === EffectTag.DELETE) return false;
    nextFiber = nextFiber.parent;
  }

  return true;
}

function performAlternate(alternate: Fiber, instance: DarkElementInstance) {
  const areSameTypes = detectAreSameInstanceTypes(alternate.instance, instance);
  const flag = getElementFlag(instance);
  const hasNoMovesFlag = flag && flag[Flag.HAS_NO_MOVES];

  alternate.isUsed = true;

  if (!areSameTypes) {
    if (canAddToDeletions(alternate)) {
      alternate.effectTag = EffectTag.DELETE;
      deletionsStore.add(alternate);
    }
  } else if (
    hasChildrenProp(alternate.instance) &&
    hasChildrenProp(instance) &&
    alternate.childrenCount !== 0 &&
    (hasNoMovesFlag ? alternate.childrenCount !== instance.children.length : true)
  ) {
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
            nextKeyFiber.effectTag = EffectTag.CREATE;
            prevKeyFiber.effectTag = EffectTag.DELETE;
            deletionsStore.add(prevKeyFiber);
          } else {
            process.env.NODE_ENV !== 'production' && result.push([nextKey, 'insert']);
            nextKeyFiber.effectTag = EffectTag.CREATE;
            p++;
            size++;
          }
          nextFiber = insertToFiber(i, nextFiber, nextKeyFiber);
        } else if (!nextKeysMap[prevKey]) {
          process.env.NODE_ENV !== 'production' && result.push([prevKey, 'remove']);
          prevKeyFiber.effectTag = EffectTag.DELETE;
          deletionsStore.add(prevKeyFiber);
          flush && (prevKeyFiber.flush = true);
          n++;
          idx--;
          size++;
        } else if (nextKeysMap[prevKey] && nextKeysMap[nextKey]) {
          process.env.NODE_ENV !== 'production' && result.push([[nextKey, prevKey], 'move']);
          nextKeyFiber.effectTag = EffectTag.UPDATE;
          prevKeyFiber.effectTag = EffectTag.UPDATE;
          nextKeyFiber.move = true;
          nextFiber = insertToFiber(i, nextFiber, nextKeyFiber);
        }
      } else if (nextKey !== null) {
        process.env.NODE_ENV !== 'production' && result.push([nextKey, 'stable']);
        nextKeyFiber.effectTag = EffectTag.UPDATE;
        nextFiber = insertToFiber(i, nextFiber, nextKeyFiber);
      }

      nextKeyFiber.idx = idx;
      idx++;
    }

    result = [];
  }
}

function performMemo(fiber: Fiber) {
  if (process.env.NODE_ENV !== 'production') {
    if (hot.get()) return;
  }

  const alternate = fiber.alternate;
  const prevComponent = alternate.instance as Component;
  const nextComponent = fiber.instance as Component;

  if (
    fiber.move ||
    nextComponent.type !== prevComponent.type ||
    nextComponent.shouldUpdate(prevComponent.props, nextComponent.props)
  )
    return;

  fiberMountStore.deepWalking.set(false);
  fiber.effectTag = EffectTag.SKIP;
  fiber.alternate = alternate;
  fiber.nativeElement = alternate.nativeElement;
  fiber.child = alternate.child;
  fiber.hook = alternate.hook;
  fiber.provider = alternate.provider;
  fiber.childrenCount = alternate.childrenCount;
  fiber.childrenElementsCount = alternate.childrenElementsCount;
  fiber.catchException = alternate.catchException;
  fiber.child && (fiber.child.parent = fiber);

  const diff = fiber.elementIdx - alternate.elementIdx;
  const deep = diff !== 0;

  if (deep) {
    walkFiber(fiber.child, (nextFiber, _, __, stop) => {
      if (nextFiber === fiber.nextSibling || nextFiber === fiber.parent) return stop();
      nextFiber.elementIdx += diff;
      if (nextFiber.parent !== fiber && nextFiber.nativeElement) return stop();
    });
  }

  fiber.incrementChildrenElementsCount(alternate.childrenElementsCount);
  alternate.effectHost && fiber.markEffectHost();
  alternate.layoutEffectHost && fiber.markLayoutEffectHost();
  alternate.insertionEffectHost && fiber.markInsertionEffectHost();
  alternate.portalHost && fiber.markPortalHost();
}

function pertformInstance(instance: DarkElementInstance, idx: number, fiber: Fiber) {
  let instance$: DarkElementInstance = null;

  if (hasChildrenProp(instance)) {
    if (detectIsArray(instance.children[idx])) {
      instance.children.splice(idx, 1, ...flatten(instance.children[idx] as unknown as Array<DarkElementInstance>));
    }

    instance$ = mountInstance(fiber, instance.children[idx]);

    if (detectIsComponent(instance$)) {
      hasEffects(fiber) && fiber.markEffectHost();
      hasLayoutEffects(fiber) && fiber.markLayoutEffectHost();
      hasInsertionEffects(fiber) && fiber.markInsertionEffectHost();
      platform.detectIsPortal(instance$) && fiber.markPortalHost();
    }
  }

  return instance$;
}

function mountInstance(fiber: Fiber, instance: DarkElementInstance) {
  let instance$ = instance;
  const isComponent = detectIsComponent(instance$);
  const component = instance$ as Component;

  if (isComponent) {
    try {
      let result = component.type(component.props, component.ref);

      if (detectIsArray(result) && !detectIsFragment(component)) {
        result = Fragment({ slot: result });
      } else if (detectIsString(result) || detectIsNumber(result)) {
        result = Text(result);
      }

      component.children = (detectIsArray(result) ? flatten(result) : [result]) as Array<DarkElementInstance>;
    } catch (err) {
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
      const key = getElementKey(nextFiber.instance);
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

    nextFiber = nextFiber ? nextFiber.nextSibling : null;
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
        return prevInstance.displayName === nextInstance.displayName;
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

function commitChanges() {
  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_ENV === 'development' && hot.set(false);
  }
  if (isHydrateZone.get() && detectHasRegisteredLazy()) return flush(null); // important order
  const wipFiber = wipRootStore.get();
  const isDynamic = platform.detectIsDynamic();
  const deletions = deletionsStore.get();
  const candidates = candidatesStore.get();
  const fromUpdate = isUpdateHookZone.get();

  // important order
  for (const fiber of deletions) {
    unmountFiber(fiber);
    platform.applyCommit(fiber);
  }

  isDynamic && runInsertionEffects();
  fromUpdate && syncElementIndices(wipFiber);

  for (const fiber of candidates) {
    fiber.effectTag !== EffectTag.SKIP && platform.applyCommit(fiber);
    fiber.alternate = null;
  }

  wipFiber.alternate = null;
  platform.finishCommitWork();

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

  if (isUpdateHookZone.get()) {
    isUpdateHookZone.set(false);
  } else {
    currentRootStore.set(wipFiber);
  }
}

function getParentFiberWithNativeElement(fiber: Fiber) {
  let parentFiber = fiber;

  while (parentFiber) {
    parentFiber = parentFiber.parent;

    if (parentFiber && parentFiber.nativeElement) {
      break;
    }
  }

  return parentFiber;
}

function syncElementIndices(fiber: Fiber) {
  const diff = fiber.childrenElementsCount - fiber.alternate.childrenElementsCount;
  if (diff === 0) return;
  const parentFiber = getParentFiberWithNativeElement(fiber);
  let isRight = false;

  fiber.incrementChildrenElementsCount(diff, true);

  walkFiber(parentFiber.child, (nextFiber, isReturn, resetIsDeepWalking, stop) => {
    if (nextFiber === parentFiber) return stop();
    if (nextFiber === fiber) {
      isRight = true;
      return resetIsDeepWalking();
    }

    if (nextFiber.nativeElement) {
      resetIsDeepWalking();
    }

    if (isRight && !isReturn) {
      nextFiber.elementIdx += diff;
    }
  });
}

type CreateUpdateCallbackOptions = {
  rootId: number;
  fiber: Fiber;
  forceStart?: boolean;
  onStart: () => void;
};

function createUpdateCallback(options: CreateUpdateCallbackOptions) {
  const { rootId, fiber, forceStart = false, onStart } = options;
  const callback = () => {
    if (fiber.effectTag === EffectTag.DELETE) return;
    forceStart && onStart();
    if (fiber.isUsed) return;
    !forceStart && onStart();
    rootStore.set(rootId); // important order!
    isUpdateHookZone.set(true);
    fiberMountStore.reset();

    fiber.alternate = new Fiber().mutate(fiber);
    fiber.marker = '🔥';
    fiber.effectTag = EffectTag.UPDATE;
    fiber.childrenElementsCount = 0;
    fiber.child = null;

    wipRootStore.set(fiber);
    currentFiberStore.set(fiber);
    fiber.instance = mountInstance(fiber, fiber.instance);
    nextUnitOfWorkStore.set(fiber);
  };

  return callback;
}

const detectIsBusy = () => Boolean(wipRootStore.get());

export { Fiber, workLoop, createUpdateCallback, detectIsBusy };
