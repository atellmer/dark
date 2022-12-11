import {
  flatten,
  detectIsEmpty,
  detectIsFalsy,
  error,
  detectIsArray,
  detectIsString,
  detectIsNumber,
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
  createEmptyVirtualNode,
  getTagVirtualNodeKey,
  getVirtualNodeFactoryKey,
  getTagVirtualNodeFlag,
  getVirtualNodeFactoryFlag,
} from '../view';
import { detectIsMemo } from '../memo';
import type { Context, ContextProviderValue } from '../context';
import type { DarkElementKey, DarkElement, DarkElementInstance } from '../shared';
import { INDEX_KEY, PARTIAL_UPDATE, TYPE, Flag } from '../constants';
import { type NativeElement, type Hook, EffectTag, cloneTagMap } from './types';
import { hasEffects } from '../use-effect';
import { hasLayoutEffects } from '../use-layout-effect';
import { hasInsertionEffects } from '../use-insertion-effect';
import { walkFiber } from '../walk';
import { unmountFiber } from '../unmount';
import { Text } from '../view';
import { Fragment, detectIsFragment } from '../fragment';

let nextFiberId = 0;

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
  public mountedToHost = false;
  public effectHost = false;
  public layoutEffectHost = false;
  public insertionEffectHost = false;
  public portalHost = false;
  public childrenCount = 0;
  public marker = '';
  public isUsed = false;
  public idx = 0;
  public batched: number | null = null;
  public catchException: (error: Error) => void;

  constructor(hook: Hook = null, provider: Fiber['provider'] = null, idx = 0) {
    this.id = ++nextFiberId;
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

  public markMountedToHost() {
    this.mountedToHost = true;
    this.parent && !this.parent.mountedToHost && this.parent.markMountedToHost();
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

  public setError(error: Error) {
    if (typeof this.catchException === 'function') {
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
        const { performedFiber, performedNextFiber, performedInstance } = performChild(nextFiber, instance);

        nextFiber = performedNextFiber;
        instance = performedInstance;

        if (performedFiber) return performedFiber;
      } else {
        const { performedFiber, performedNextFiber, performedInstance } = performSibling(nextFiber, instance);

        nextFiber = performedNextFiber;
        instance = performedInstance;

        if (performedFiber) return performedFiber;
      }
    } else {
      const { performedFiber, performedNextFiber, performedInstance } = performSibling(nextFiber, instance);

      nextFiber = performedNextFiber;
      instance = performedInstance;

      if (performedFiber) return performedFiber;
    }

    if (nextFiber.parent === null) return null;
  }
}

function performChild(nextFiber: Fiber, instance: DarkElementInstance) {
  fiberMountStore.jumpToChild();
  const childrenIdx = 0;
  const alternate = nextFiber.alternate ? nextFiber.alternate.child : null;
  const prevInstance: DarkElementInstance = alternate ? alternate.instance : null;
  const nextInstance: DarkElementInstance = hasChildrenProp(instance) ? instance.children[childrenIdx] || null : null;
  const hook = getHook(alternate, prevInstance, nextInstance);
  const provider = alternate ? alternate.provider : null;
  const fiber = new Fiber(hook, provider, childrenIdx);

  currentFiberStore.set(fiber);
  fiber.parent = nextFiber;
  nextFiber.child = fiber;

  instance = pertformInstance(instance, childrenIdx, fiber) || instance;
  alternate && performAlternate(alternate, instance);
  performFiber(fiber, alternate, instance);
  alternate && detectIsMemo(fiber.instance) && performMemo(fiber, alternate, instance);
  cloneTagMap[fiber.parent.effectTag] && (fiber.effectTag = fiber.parent.effectTag);

  return {
    performedFiber: fiber,
    performedNextFiber: fiber,
    performedInstance: instance,
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
      ? parentInstance.children[childrenIdx] || null
      : null;
    const hook = getHook(alternate, prevInstance, nextInstance);
    const provider = alternate ? alternate.provider : null;
    const fiber = new Fiber(hook, provider, childrenIdx);

    currentFiberStore.set(fiber);
    fiber.parent = nextFiber.parent;
    nextFiber.nextSibling = fiber;

    instance = pertformInstance(parentInstance, childrenIdx, fiber) || instance;
    alternate && performAlternate(alternate, instance);
    performFiber(fiber, alternate, instance);
    alternate && detectIsMemo(fiber.instance) && performMemo(fiber, alternate, instance);
    cloneTagMap[fiber.parent.effectTag] && (fiber.effectTag = fiber.parent.effectTag);

    return {
      performedFiber: fiber,
      performedNextFiber: fiber,
      performedInstance: instance,
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
    performedFiber: null,
    performedNextFiber: nextFiber,
    performedInstance: instance,
  };
}

function performFiber(fiber: Fiber, alternate: Fiber, instance: DarkElementInstance) {
  const hasAlternate = Boolean(alternate);
  const prevKey = hasAlternate ? getElementKey(alternate.instance) : null;
  const nextKey = hasAlternate ? getElementKey(instance) : null;
  const isSameKeys = prevKey === nextKey;
  const isSameTypes = hasAlternate && getInstanceType(alternate.instance) === getInstanceType(instance);
  const isUpdate = isSameTypes && isSameKeys;

  fiber.instance = instance;
  fiber.alternate = alternate || null;
  fiber.nativeElement = isUpdate ? alternate.nativeElement : null;
  fiber.effectTag = isUpdate ? EffectTag.UPDATE : EffectTag.CREATE;
  fiber.mountedToHost = isUpdate;

  if (alternate && alternate.move) {
    fiber.move = alternate.move;
    alternate.move = false;
  }

  if (hasChildrenProp(fiber.instance)) {
    fiber.childrenCount = fiber.instance.children.length;
  }

  if (fiber.alternate) {
    fiber.alternate.alternate = null;
  }

  if (!fiber.nativeElement && detectIsVirtualNode(fiber.instance)) {
    fiber.nativeElement = platform.createNativeElement(fiber.instance);
    fiber.effectTag = EffectTag.CREATE;
    fiber.mountedToHost = false;
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
  const vNode = createEmptyVirtualNode();

  return new Fiber().mutate({
    instance: vNode,
    parent: alternate,
    marker: marker + '',
    effectTag: EffectTag.CREATE,
  });
}

function performAlternate(alternate: Fiber, instance: DarkElementInstance) {
  const alternateType = getInstanceType(alternate.instance);
  const elementType = getInstanceType(instance);
  const isSameType = elementType === alternateType;
  const flag = getElementFlag(instance);
  const hasNoSwapsFlag = flag && flag[Flag.HAS_NO_SWAPS];

  alternate.isUsed = true;

  if (!isSameType) {
    alternate.effectTag = EffectTag.DELETE;

    if (!deletionsStore.has(alternate.parent)) {
      deletionsStore.add(alternate);
    }
  } else if (
    hasChildrenProp(alternate.instance) &&
    hasChildrenProp(instance) &&
    (hasNoSwapsFlag ? alternate.childrenCount !== instance.children.length : true)
  ) {
    const { prevKeys, nextKeys, prevKeysMap, nextKeysMap, keyedFibersMap } = extractKeys(
      alternate.child,
      instance.children,
    );
    const size = Math.max(prevKeys.length, nextKeys.length);
    const result: Array<[DarkElement | [DarkElementKey, DarkElementKey], string]> = [];
    let nextFiber = alternate;
    let idx = 0;
    let p = 0;
    let n = 0;

    for (let i = 0; i < size + p; i++) {
      const nextKey = nextKeys[i - n] || null;
      const prevKey = prevKeys[i - p] || null;
      const prevKeyFiber = keyedFibersMap[prevKey];
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
          }
          nextFiber = insertToFiber(i, nextFiber, nextKeyFiber);
        } else if (!nextKeysMap[prevKey]) {
          result.push([prevKey, 'remove']);
          prevKeyFiber.effectTag = EffectTag.DELETE;
          deletionsStore.add(prevKeyFiber);
          idx--;
          n++;
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
  }
}

function performMemo(fiber: Fiber, alternate: Fiber, instance: DarkElementInstance) {
  const prevFactory = alternate.instance as ComponentFactory;
  const nextFactory = instance as ComponentFactory;
  if (fiber.move || nextFactory.type !== prevFactory.type) return;
  const prevProps = prevFactory.props;
  const nextProps = nextFactory.props;
  const skip = !nextFactory.shouldUpdate(prevProps, nextProps);

  if (skip) {
    fiberMountStore.deepWalking.set(false);
    let nextFiber: Fiber = null;

    fiber.mutate({
      ...alternate,
      alternate,
      id: fiber.id,
      idx: fiber.idx,
      parent: fiber.parent,
      nextSibling: fiber.nextSibling,
      effectTag: EffectTag.SKIP,
    });

    alternate.alternate = null;

    nextFiber = fiber.child;

    while (nextFiber) {
      nextFiber.parent = fiber;
      nextFiber = nextFiber.nextSibling;
    }

    if (alternate.mountedToHost) {
      fiber.markMountedToHost();
    }

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

function pertformInstance(instance: DarkElementInstance, idx: number, fiber: Fiber) {
  let performedInstance: DarkElementInstance = null;

  if (hasChildrenProp(instance)) {
    const elements = detectIsArray(instance.children[idx])
      ? flatten([instance.children[idx]])
      : [instance.children[idx]];

    instance.children.splice(idx, 1, ...elements);

    performedInstance = instance.children[idx];
    performedInstance = mountInstance(fiber, performedInstance);
  }

  if (detectIsComponentFactory(performedInstance)) {
    if (hasEffects(fiber)) {
      fiber.markEffectHost();
    }

    if (hasLayoutEffects(fiber)) {
      fiber.markLayoutEffectHost();
    }

    if (hasInsertionEffects(fiber)) {
      fiber.markInsertionEffectHost();
    }

    if (platform.detectIsPortal(performedInstance)) {
      fiber.markPortalHost();
    }
  }

  return performedInstance;
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
    for (let i = 0; i < instance.children.length; i++) {
      if (!instance.children[i]) {
        instance.children[i] = supportConditional(instance.children[i]) as DarkElementInstance;
      }
    }

    instance.children = isComponentFactory
      ? instance.children
      : detectIsArray(instance.children)
      ? flatten([instance.children])
      : [instance.children];

    if (isComponentFactory && factory.children.length === 0) {
      factory.children.push(createEmptyVirtualNode());
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

  while (nextFiber || idx < children.length) {
    if (nextFiber) {
      const key = getElementKey(nextFiber.instance);
      const prevKey = detectIsEmpty(key) ? createIndexKey(idx) : key;

      prevKeys.push(prevKey);
      prevKeysMap[prevKey] = true;
      keyedFibersMap[prevKey] = nextFiber;
    }

    if (children[idx]) {
      const key = getElementKey(children[idx]);
      const nextKey = detectIsEmpty(key) ? createIndexKey(idx) : key;

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

function supportConditional(instance: DarkElement) {
  return detectIsFalsy(instance) ? createEmptyVirtualNode() : instance;
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
    detectIsComponentFactory(nextInstance)
  ) {
    const prevKey = prevInstance ? getElementKey(prevInstance) : null;
    const nextKey = nextInstance ? getElementKey(nextInstance) : null;

    return prevInstance.type === nextInstance.type && prevKey === nextKey;
  }

  return false;
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
  const wipFiber = wipRootStore.get();
  const insertionEffects = insertionEffectsStore.get();
  const deletions = deletionsStore.get();

  // important order
  for (const fiber of deletions) {
    unmountFiber(fiber);
    platform.applyCommit(fiber);
  }

  isInsertionEffectsZone.set(true);
  insertionEffects.forEach(fn => fn());
  isInsertionEffectsZone.set(false);

  wipFiber.alternate = null;

  // console.log('wipFiber', wipFiber);

  commitWork(wipFiber.child, () => {
    const layoutEffects = layoutEffectsStore.get();
    const effects = effectsStore.get();

    isLayoutEffectsZone.set(true);
    layoutEffects.forEach(fn => fn());
    isLayoutEffectsZone.set(false);

    setTimeout(() => {
      effects.forEach(fn => fn());
    });

    wipRootStore.set(null); // important order
    deletionsStore.reset();
    insertionEffectsStore.reset();
    layoutEffectsStore.reset();
    effectsStore.reset();

    if (isUpdateHookZone.get()) {
      isUpdateHookZone.set(false);
    } else {
      currentRootStore.set(wipFiber);
    }
  });
}

function commitWork(fiber: Fiber, onComplete: Function) {
  walkFiber(fiber, ({ nextFiber, isReturn, resetIsDeepWalking }) => {
    const skip = nextFiber.effectTag === EffectTag.SKIP;

    if (skip) {
      resetIsDeepWalking();
    } else if (!isReturn) {
      platform.applyCommit(nextFiber);
    }

    nextFiber.alternate = null;
  });

  platform.finishCommitWork();
  onComplete();
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

    fiber.alternate = new Fiber().mutate({ ...fiber, alternate: null });
    fiber.marker = PARTIAL_UPDATE;
    fiber.effectTag = EffectTag.UPDATE;
    fiber.child = null;

    wipRootStore.set(fiber);
    currentFiberStore.set(fiber);
    fiber.instance = mountInstance(fiber, fiber.instance);
    nextUnitOfWorkStore.set(fiber);
  };

  return callback;
}

export { Fiber, workLoop, hasChildrenProp, createUpdateCallback };
