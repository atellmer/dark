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
import { platform } from '../platform';
import {
  wipRootStore,
  currentRootStore,
  nextUnitOfWorkStore,
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
import {
  type ComponentFactory,
  detectIsComponentFactory,
  getComponentFactoryKey,
  getComponentFactoryFlag,
} from '../component';
import {
  type TagVirtualNode,
  detectIsVirtualNode,
  detectIsTagVirtualNode,
  detectIsVirtualNodeFactory,
  getTagVirtualNodeKey,
  getVirtualNodeFactoryKey,
  getTagVirtualNodeFlag,
  getVirtualNodeFactoryFlag,
  detectIsTextVirtualNode,
  detectIsCommentVirtualNode,
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

function workLoop() {
  const wipFiber = wipRootStore.get();
  let nextUnitOfWork = nextUnitOfWorkStore.get();
  let shouldYield = false;
  let hasMoreWork = Boolean(nextUnitOfWork);

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    nextUnitOfWorkStore.set(nextUnitOfWork);
    hasMoreWork = Boolean(nextUnitOfWork);
    shouldYield = platform.shouldYeildToHost();
  }

  if (!nextUnitOfWork && wipFiber) {
    commitChanges();
  }

  return hasMoreWork;
}

function performUnitOfWork(fiber: Fiber) {
  let isDeepWalking = true;
  let nextFiber = fiber;
  let instance = fiber.instance;

  while (true) {
    isDeepWalking = fiberMountStore.deepWalking.get();
    nextFiber.hook && (nextFiber.hook.idx = 0);

    if (isDeepWalking) {
      const hasChildren = hasChildrenProp(instance) && instance.children.length > 0;

      if (hasChildren) {
        const { fiber$, instance$ } = performChild(nextFiber, instance);

        nextFiber = fiber$;
        instance = instance$;

        if (fiber$) return fiber$;
      } else {
        const { fiber$$, fiber$, instance$ } = performSibling(nextFiber, instance);

        nextFiber = fiber$;
        instance = instance$;

        if (fiber$$) return fiber$$;
      }
    } else {
      const { fiber$$, fiber$, instance$ } = performSibling(nextFiber, instance);

      nextFiber = fiber$;
      instance = instance$;

      if (fiber$$) return fiber$$;
    }

    if (nextFiber.parent === null) return null;
  }
}

function performChild(nextFiber: Fiber, instance: DarkElementInstance) {
  fiberMountStore.jumpToChild();
  const childrenIdx = 0;
  const alternate = nextFiber.alternate ? nextFiber.alternate.child : null;
  const prevInstance: DarkElementInstance = alternate ? alternate.instance : null;
  const nextInstance: DarkElementInstance = hasChildrenProp(instance) ? instance.children[childrenIdx] : null;
  const hook = getHook(alternate, prevInstance, nextInstance);
  const provider = alternate ? alternate.provider : null;
  const fiber = new Fiber(hook, provider, childrenIdx);

  currentFiberStore.set(fiber);
  fiber.parent = nextFiber;
  nextFiber.child = fiber;
  fiber.elementIdx = nextFiber.nativeElement ? 0 : nextFiber.elementIdx;
  instance = pertformInstance(instance, childrenIdx, fiber);
  alternate && performAlternate(alternate, instance);
  performFiber(fiber, alternate, instance);
  alternate && detectIsMemo(fiber.instance) && performMemo(fiber, alternate, instance);

  return {
    fiber$: fiber,
    instance$: instance,
  };
}

function performSibling(nextFiber: Fiber, instance: DarkElementInstance) {
  fiberMountStore.jumpToSibling();
  const parentInstance = nextFiber.parent.instance;
  const childrenIdx = fiberMountStore.getIndex();
  const hasSibling = hasChildrenProp(parentInstance) && parentInstance.children[childrenIdx];

  if (hasSibling) {
    fiberMountStore.deepWalking.set(true);
    const alternate = nextFiber.alternate ? nextFiber.alternate.nextSibling : null;
    const prevInstance: DarkElementInstance = alternate ? alternate.instance : null;
    const nextInstance: DarkElementInstance = hasChildrenProp(parentInstance)
      ? parentInstance.children[childrenIdx]
      : null;
    const hook = getHook(alternate, prevInstance, nextInstance);
    const provider = alternate ? alternate.provider : null;
    const fiber = new Fiber(hook, provider, childrenIdx);

    currentFiberStore.set(fiber);
    fiber.parent = nextFiber.parent;
    nextFiber.nextSibling = fiber;
    fiber.elementIdx = nextFiber.elementIdx + (nextFiber.nativeElement ? 1 : nextFiber.childrenElementsCount);
    instance = pertformInstance(parentInstance, childrenIdx, fiber);
    alternate && performAlternate(alternate, instance);
    performFiber(fiber, alternate, instance);
    alternate && detectIsMemo(fiber.instance) && performMemo(fiber, alternate, instance);

    return {
      fiber$$: fiber,
      fiber$: fiber,
      instance$: instance,
    };
  } else {
    fiberMountStore.jumpToParent();
    fiberMountStore.deepWalking.set(false);
    nextFiber = nextFiber.parent;
    instance = nextFiber.instance;

    if (hasChildrenProp(nextFiber.instance)) {
      nextFiber.instance.children = [];
    }
  }

  return {
    fiber$$: null,
    fiber$: nextFiber,
    instance$: instance,
  };
}

function incrementChildrenElementsCount(fiber: Fiber, count = 1, force = false) {
  if (!fiber.parent) return;
  const fromUpdate = isUpdateHookZone.get();
  const wipFiber = wipRootStore.get();
  const stop = fromUpdate && wipFiber.parent === fiber.parent;

  if (
    detectIsTextVirtualNode(fiber.instance) ||
    detectIsCommentVirtualNode(fiber.instance) ||
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
    const hasAlternate = Boolean(alternate);
    const prevKey = hasAlternate ? getElementKey(alternate.instance) : null;
    const nextKey = hasAlternate ? getElementKey(instance) : null;
    const isSameKeys = prevKey === nextKey;
    const isSameTypes = hasAlternate && detectIsSameInstanceTypes(alternate.instance, instance);

    isUpdate = isSameTypes && isSameKeys;
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

  if (fiber.nativeElement) {
    fiber.incrementChildrenElementsCount();
  }
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
  const vNode = createReplacer();

  return new Fiber().mutate({
    instance: vNode,
    parent: alternate,
    marker: marker + '',
    effectTag: EffectTag.CREATE,
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
  const isSameType = detectIsSameInstanceTypes(alternate.instance, instance);
  const flag = getElementFlag(instance);
  const hasNoMovesFlag = flag && flag[Flag.HAS_NO_MOVES];

  alternate.isUsed = true;

  if (!isSameType) {
    if (canAddToDeletions(alternate)) {
      alternate.effectTag = EffectTag.DELETE;
      deletionsStore.add(alternate);
    }
  } else if (
    hasChildrenProp(alternate.instance) &&
    hasChildrenProp(instance) &&
    (hasNoMovesFlag ? alternate.childrenCount !== instance.children.length : true)
  ) {
    const { prevKeys, nextKeys, prevKeysMap, nextKeysMap, keyedFibersMap } = extractKeys(
      alternate.child,
      instance.children,
    );
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
            result.push([[nextKey, prevKey], 'replace']);
            nextKeyFiber.effectTag = EffectTag.CREATE;
            prevKeyFiber.effectTag = EffectTag.DELETE;
            deletionsStore.add(prevKeyFiber);
          } else {
            result.push([nextKey, 'insert']);
            nextKeyFiber.effectTag = EffectTag.CREATE;
            p++;
            size++;
          }
          nextFiber = insertToFiber(i, nextFiber, nextKeyFiber);
        } else if (!nextKeysMap[prevKey]) {
          result.push([prevKey, 'remove']);
          prevKeyFiber.effectTag = EffectTag.DELETE;
          deletionsStore.add(prevKeyFiber);
          n++;
          idx--;
          size++;
        } else if (nextKeysMap[prevKey] && nextKeysMap[nextKey]) {
          result.push([[nextKey, prevKey], 'move']);
          nextKeyFiber.effectTag = EffectTag.UPDATE;
          prevKeyFiber.effectTag = EffectTag.UPDATE;
          nextKeyFiber.move = true;
          nextFiber = insertToFiber(i, nextFiber, nextKeyFiber);
        }
      } else if (nextKey !== null) {
        result.push([nextKey, 'stable']);
        nextKeyFiber.effectTag = EffectTag.UPDATE;
        nextFiber = insertToFiber(i, nextFiber, nextKeyFiber);
      }

      nextKeyFiber.idx = idx;
      idx++;
    }

    result = [];
  }
}

function performMemo(fiber: Fiber, alternate: Fiber, instance: DarkElementInstance) {
  if (process.env.NODE_ENV === 'development') {
    if (hot.get()) return;
  }

  const prevFactory = alternate.instance as ComponentFactory;
  const nextFactory = instance as ComponentFactory;
  if (fiber.move || nextFactory.type !== prevFactory.type) return;
  const prevProps = prevFactory.props;
  const nextProps = nextFactory.props;
  const skip = !nextFactory.shouldUpdate(prevProps, nextProps);

  if (skip) {
    fiberMountStore.deepWalking.set(false);
    const diff = fiber.elementIdx - alternate.elementIdx;
    const deep = diff !== 0;

    fiber.mutate({
      ...alternate,
      alternate,
      id: fiber.id,
      idx: fiber.idx,
      parent: fiber.parent,
      nextSibling: fiber.nextSibling,
      elementIdx: fiber.elementIdx,
      effectTag: EffectTag.SKIP,
    });

    walkFiber(fiber.child, ({ nextFiber, stop }) => {
      if (nextFiber === fiber.nextSibling || nextFiber === fiber.parent) {
        return stop();
      }

      if (nextFiber.parent === alternate) {
        nextFiber.parent = fiber;
      }

      if (deep) {
        nextFiber.elementIdx += diff;
        if (nextFiber.parent !== fiber && nextFiber.nativeElement) return stop();
      } else if (nextFiber === alternate.child.child) return stop();
    });

    fiber.incrementChildrenElementsCount(alternate.childrenElementsCount);

    if (alternate.effectHost) {
      fiber.markEffectHost();
    }

    if (alternate.layoutEffectHost) {
      fiber.markLayoutEffectHost();
    }

    if (alternate.insertionEffectHost) {
      fiber.markInsertionEffectHost();
    }

    if (alternate.portalHost) {
      fiber.markPortalHost();
    }
  }
}

function pertformInstance(parentInstance: DarkElementInstance, idx: number, fiber: Fiber) {
  let instance: DarkElementInstance = null;

  if (hasChildrenProp(parentInstance)) {
    const elements = detectIsArray(parentInstance.children[idx])
      ? flatten([parentInstance.children[idx]])
      : [parentInstance.children[idx]];

    parentInstance.children.splice(idx, 1, ...elements);

    instance = parentInstance.children[idx];
    instance = mountInstance(fiber, instance);
  }

  if (detectIsComponentFactory(instance)) {
    if (hasEffects(fiber)) {
      fiber.markEffectHost();
    }

    if (hasLayoutEffects(fiber)) {
      fiber.markLayoutEffectHost();
    }

    if (hasInsertionEffects(fiber)) {
      fiber.markInsertionEffectHost();
    }

    if (platform.detectIsPortal(instance)) {
      fiber.markPortalHost();
    }
  }

  return instance;
}

function mountInstance(fiber: Fiber, instance: DarkElementInstance) {
  const isComponentFactory = detectIsComponentFactory(instance);
  const factory = instance as ComponentFactory;

  if (isComponentFactory) {
    try {
      let result = factory.type(factory.props, factory.ref);

      if (detectIsArray(result) && !detectIsFragment(factory)) {
        result = Fragment({ slot: result });
      } else if (detectIsString(result) || detectIsNumber(result)) {
        result = Text(result);
      }

      factory.children = detectIsArray(result)
        ? (flatten([result]) as Array<DarkElementInstance>)
        : ([result] as Array<DarkElementInstance>);
    } catch (err) {
      factory.children = [];
      fiber.setError(err);
      error(err);
    }
  } else if (detectIsVirtualNodeFactory(instance)) {
    instance = instance();
  }

  if (hasChildrenProp(instance)) {
    instance.children = isComponentFactory
      ? instance.children
      : detectIsArray(instance.children)
      ? flatten([instance.children])
      : [instance.children];

    for (let i = 0; i < instance.children.length; i++) {
      if (instance.children[i]) continue;
      instance.children[i] = supportConditional(instance.children[i]);
    }

    if (isComponentFactory && factory.children.length === 0) {
      factory.children.push(createReplacer());
    }
  }

  return instance;
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

      if (process.env.NODE_ENV === 'development') {
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
  const key = detectIsComponentFactory(instance)
    ? getComponentFactoryKey(instance)
    : detectIsVirtualNodeFactory(instance)
    ? getVirtualNodeFactoryKey(instance)
    : detectIsTagVirtualNode(instance)
    ? getTagVirtualNodeKey(instance)
    : null;

  return key;
}

function getElementFlag(instance: DarkElementInstance): Record<Flag, boolean> | null {
  const flag = detectIsComponentFactory(instance)
    ? getComponentFactoryFlag(instance)
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
    : detectIsComponentFactory(instance)
    ? instance.type
    : null;
}

function hasChildrenProp(element: DarkElementInstance): element is TagVirtualNode | ComponentFactory {
  return detectIsTagVirtualNode(element) || detectIsComponentFactory(element);
}

function detectIsSameComponentFactoryTypesWithSameKeys(
  prevInstance: DarkElementInstance | null,
  nextInstance: DarkElementInstance | null,
) {
  if (
    prevInstance &&
    nextInstance &&
    detectIsComponentFactory(prevInstance) &&
    detectIsComponentFactory(nextInstance) &&
    detectIsSameInstanceTypes(prevInstance, nextInstance, true)
  ) {
    const prevKey = prevInstance ? getElementKey(prevInstance) : null;
    const nextKey = nextInstance ? getElementKey(nextInstance) : null;

    return prevKey === nextKey;
  }

  return false;
}

function detectIsSameInstanceTypes(
  prevInstance: DarkElementInstance,
  nextInstance: DarkElementInstance,
  isComponentFactories = false,
) {
  if (process.env.NODE_ENV === 'development') {
    if (hot.get()) {
      if (detectIsComponentFactory(prevInstance) && detectIsComponentFactory(nextInstance)) {
        return prevInstance.displayName === nextInstance.displayName;
      }
    }
  }

  if (isComponentFactories) {
    const prevFactory = prevInstance as ComponentFactory;
    const nextFactory = nextInstance as ComponentFactory;

    return prevFactory.type === nextFactory.type;
  }

  const prevType = getInstanceType(prevInstance);
  const nextType = getInstanceType(nextInstance);

  return prevType === nextType;
}

function getHook(alternate: Fiber, prevInstance: DarkElementInstance, nextInstance: DarkElementInstance): Hook | null {
  if (alternate && detectIsSameComponentFactoryTypesWithSameKeys(prevInstance, nextInstance)) {
    return alternate.hook;
  }

  if (detectIsComponentFactory(nextInstance)) {
    return createHook();
  }

  return null;
}

function createHook(): Hook {
  return {
    idx: 0,
    values: [],
  };
}

function commitChanges() {
  if (process.env.NODE_ENV === 'development') {
    hot.set(false);
  }
  if (isHydrateZone.get() && detectHasRegisteredLazy()) return flush(null); // important order
  const wipFiber = wipRootStore.get();
  const isDynamic = platform.detectIsDynamic();
  const insertionEffects = insertionEffectsStore.get();
  const deletions = deletionsStore.get();
  const fromUpdate = isUpdateHookZone.get();

  // important order
  for (const fiber of deletions) {
    unmountFiber(fiber);
    platform.applyCommit(fiber);
  }

  isInsertionEffectsZone.set(true);
  isDynamic && insertionEffects.forEach(fn => fn());
  isInsertionEffectsZone.set(false);

  fromUpdate && syncElementIndices(wipFiber);

  commitWork(wipFiber, () => {
    const layoutEffects = layoutEffectsStore.get();
    const effects = effectsStore.get();

    isLayoutEffectsZone.set(true);
    isDynamic && layoutEffects.forEach(fn => fn());
    isLayoutEffectsZone.set(false);

    setTimeout(() => {
      isDynamic && effects.forEach(fn => fn());
    });

    flush(wipFiber);
  });
}

function flush(wipFiber: Fiber) {
  const fromUpdate = isUpdateHookZone.get();

  wipRootStore.set(null); // important order
  deletionsStore.reset();
  insertionEffectsStore.reset();
  layoutEffectsStore.reset();
  effectsStore.reset();

  if (fromUpdate) {
    isUpdateHookZone.set(false);
  } else {
    currentRootStore.set(wipFiber);
  }
}

function commitWork(fiber: Fiber, onComplete: Function) {
  walkFiber(fiber.child, ({ nextFiber, isReturn, resetIsDeepWalking, stop }) => {
    const skip = nextFiber.effectTag === EffectTag.SKIP;

    if (nextFiber === fiber) return stop();

    if (skip) {
      resetIsDeepWalking();
    } else if (!isReturn) {
      platform.applyCommit(nextFiber);
    }

    nextFiber.alternate = null;
  });

  fiber.alternate = null;
  platform.finishCommitWork();
  onComplete();
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

  walkFiber(parentFiber.child, ({ nextFiber, resetIsDeepWalking, isReturn, stop }) => {
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

    fiber.alternate = new Fiber().mutate({ ...fiber });
    fiber.marker = '🍒';
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
