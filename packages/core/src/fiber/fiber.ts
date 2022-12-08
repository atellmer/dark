import {
  flatten,
  detectIsEmpty,
  error,
  keyBy,
  fromEnd,
  detectIsUndefined,
  detectIsArray,
  detectIsString,
  detectIsNumber,
  getDiffKeys,
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
import { type ComponentFactory, detectIsComponentFactory, getComponentFactoryKey } from '../component';
import {
  type TagVirtualNode,
  detectIsVirtualNode,
  detectIsTagVirtualNode,
  detectIsVirtualNodeFactory,
  createEmptyVirtualNode,
  getTagVirtualNodeKey,
  getVirtualNodeFactoryKey,
} from '../view';
import { detectIsMemo } from '../memo';
import type { Context, ContextProviderValue } from '../context';
import type { DarkElementKey, DarkElement, DarkElementInstance } from '../shared';
import { ATTR_KEY, PARTIAL_UPDATE } from '../constants';
import { type NativeElement, type Hook, EffectTag, cloneTagMap } from './types';
import { hasEffects } from '../use-effect';
import { hasLayoutEffects } from '../use-layout-effect';
import { hasInsertionEffects } from '../use-insertion-effect';
import { walkFiber } from '../walk';
import { unmountFiber } from '../unmount';
import { Text } from '../view';

class Fiber<N = NativeElement> {
  public nativeElement: N;
  public parent: Fiber<N>;
  public child: Fiber<N>;
  public nextSibling: Fiber<N>;
  public alternate: Fiber<N>;
  public effectTag: EffectTag;
  public instance: DarkElementInstance;
  public hook: Hook | null;
  public provider: Map<Context, ContextProviderValue>;
  public transposition: boolean;
  public mountedToHost: boolean;
  public effectHost: boolean;
  public layoutEffectHost: boolean;
  public insertionEffectHost: boolean;
  public portalHost: boolean;
  public listHost: boolean;
  public childrenCount: number;
  public marker: string;
  public isUsed: boolean;
  public idx: number;
  public batched: number | null;
  public catchException: (error: Error) => void;

  constructor(options: Partial<Fiber<N>>) {
    this.nativeElement = options.nativeElement || null;
    this.parent = options.parent || null;
    this.child = options.child || null;
    this.nextSibling = options.nextSibling || null;
    this.alternate = options.alternate || null;
    this.effectTag = options.effectTag || null;
    this.instance = options.instance || null;
    this.hook = options.hook || createHook();
    this.provider = options.provider || null;
    this.transposition = !detectIsUndefined(options.transposition) ? options.transposition : false;
    this.mountedToHost = !detectIsUndefined(options.mountedToHost) || false;
    this.effectHost = !detectIsUndefined(options.effectHost) ? options.effectHost : false;
    this.layoutEffectHost = !detectIsUndefined(options.layoutEffectHost) ? options.layoutEffectHost : false;
    this.insertionEffectHost = !detectIsUndefined(options.insertionEffectHost) ? options.insertionEffectHost : false;
    this.portalHost = !detectIsUndefined(options.portalHost) ? options.portalHost : false;
    this.listHost = !detectIsUndefined(options.listHost) ? options.listHost : false;
    this.childrenCount = options.childrenCount || 0;
    this.marker = options.marker || '';
    this.idx = options.idx || 0;
    this.isUsed = options.isUsed || false;
    this.batched = options.batched || null;
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

    nextFiber.marker === PARTIAL_UPDATE && performPartialUpdateEffects(nextFiber);

    if (nextFiber.parent === null) return null;
  }
}

function performPartialUpdateEffects(nextFiber: Fiber) {
  const alternate = nextFiber.child?.alternate || null;
  const fiber = nextFiber.child || null;

  if (alternate && fiber && alternate.nextSibling && !fiber.nextSibling) {
    let nextFiber = alternate.nextSibling;
    const deletions: Array<Fiber> = [];

    while (nextFiber) {
      nextFiber.effectTag = EffectTag.DELETE;
      deletions.push(nextFiber);
      nextFiber = nextFiber.nextSibling;
    }

    deletionsStore.get().push(...deletions);
  }
}

function performChild(nextFiber: Fiber, instance: DarkElementInstance) {
  fiberMountStore.jumpToChild();
  const childrenIdx = 0;
  const alternate = nextFiber.alternate ? nextFiber.alternate.child : null;
  let fiber = new Fiber({});

  currentFiberStore.set(fiber);
  fiber.parent = nextFiber;

  instance = pertformInstance(instance, childrenIdx, fiber) || instance;
  alternate && mutateAlternate(fiber, alternate, instance);

  fiber.idx = childrenIdx;

  mutateFiber(fiber, alternate, instance);
  fiber = alternate && detectIsMemo(fiber.instance) ? performMemo(fiber, alternate, instance) : fiber;

  nextFiber.child = fiber;
  fiber.parent = nextFiber;
  nextFiber = fiber;

  cloneTagMap[fiber.parent.effectTag] && (fiber.effectTag = fiber.parent.effectTag);

  return {
    performedFiber: nextFiber,
    performedNextFiber: nextFiber,
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
    let fiber = new Fiber({});

    currentFiberStore.set(fiber);
    fiber.parent = nextFiber.parent;

    instance = pertformInstance(parentInstance, childrenIdx, fiber) || instance;
    alternate && mutateAlternate(fiber, alternate, instance);

    fiber.idx = childrenIdx;

    mutateFiber(fiber, alternate, instance);
    fiber = alternate && detectIsMemo(fiber.instance) ? performMemo(fiber, alternate, instance) : fiber;

    fiber.parent = nextFiber.parent;
    nextFiber.nextSibling = fiber;
    nextFiber = fiber;

    cloneTagMap[fiber.parent.effectTag] && (fiber.effectTag = fiber.parent.effectTag);

    return {
      performedFiber: nextFiber,
      performedNextFiber: nextFiber,
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

function mutateFiber(fiber: Fiber, alternate: Fiber, instance: DarkElementInstance) {
  const key = alternate ? getElementKey(alternate.instance) : null;
  const nextKey = alternate ? getElementKey(instance) : null;
  const isDifferentKeys = key !== nextKey;
  const isSameType = Boolean(alternate) && getInstanceType(alternate.instance) === getInstanceType(instance);
  const isUpdate = isSameType && !isDifferentKeys;

  fiber.instance = instance;
  fiber.alternate = alternate || null;
  fiber.nativeElement = isUpdate ? alternate.nativeElement : null;
  fiber.effectTag = isUpdate ? EffectTag.UPDATE : EffectTag.CREATE;
  fiber.mountedToHost = isUpdate;

  if (hasChildrenProp(fiber.instance)) {
    fiber.childrenCount = fiber.instance.children.length;
  }

  if (fiber.alternate) {
    fiber.alternate.alternate = null;
  }

  if (!fiber.nativeElement && detectIsVirtualNode(fiber.instance)) {
    fiber.nativeElement = platform.createNativeElement(fiber.instance);
  }
}

function insertToFiber(idx: number, fiber: Fiber, child: Fiber) {
  if (idx === 0 || (fiber.child && fiber.child.effectTag === EffectTag.DELETE)) {
    fiber.child = child;
  } else {
    fiber.nextSibling = child;
  }

  return child;
}

function mutateAlternate(fiber: Fiber, alternate: Fiber, instance: DarkElementInstance) {
  const alternateType = getInstanceType(alternate.instance);
  const elementType = getInstanceType(instance);
  const isSameType = elementType === alternateType;

  alternate.isUsed = true;

  if (!isSameType) {
    alternate.effectTag = EffectTag.DELETE;
    deletionsStore.get().push(alternate);
  } else if (
    hasChildrenProp(alternate.instance) &&
    hasChildrenProp(instance) &&
    (alternate.childrenCount !== instance.children.length || alternate.listHost)
  ) {
    if (alternate.childrenCount !== instance.children.length) {
      fiber.listHost = true;
    } else {
      fiber.listHost = alternate.listHost;
    }

    const { prevKeys, nextKeys, keyedMap, nextKeysMap } = extractKeys(alternate.child, instance.children);
    const size = Math.max(prevKeys.length, nextKeys.length);
    let p = 0;
    let n = 0;
    const result: Array<[DarkElement | [DarkElementKey, DarkElementKey], string]> = [];
    let nextFiber = alternate;

    for (let i = 0; i < size; i++) {
      const prevKey = prevKeys[p];
      const nextKey = nextKeys[n];
      const prevKeyFiber = keyedMap[prevKey];
      const nextKeyFiber =
        keyedMap[nextKey] ||
        new Fiber({
          instance: createEmptyVirtualNode(),
          parent: alternate,
          marker: nextKey as string,
          effectTag: EffectTag.CREATE,
        });

      if (nextKeys[n] !== prevKeys[p]) {
        if (nextKeys.length - n < prevKeys.length - p) {
          n--;
          //result.push([prevKey, 'remove']);
          prevKeyFiber.effectTag = EffectTag.DELETE;
          deletionsStore.get().push(prevKeyFiber);
        } else if (nextKeys.length - n > prevKeys.length - p) {
          p--;
          //result.push([nextKey, 'insert']);
          nextFiber = insertToFiber(i, nextFiber, nextKeyFiber);
        } else {
          if (nextKeysMap[prevKey]) {
            //result.push([[prevKey, nextKey], 'swap']);
            nextKeyFiber.transposition = true;
          } else {
            //result.push([[prevKey, nextKey], 'replace']);
            prevKeyFiber.effectTag = EffectTag.DELETE;
            deletionsStore.get().push(prevKeyFiber);
          }

          nextFiber = insertToFiber(i, nextFiber, nextKeyFiber);
        }
      } else {
        //result.push([nextKey, 'stable']);
        nextKeyFiber.effectTag = EffectTag.UPDATE;
        nextFiber = insertToFiber(i, nextFiber, nextKeyFiber);
      }

      n++;
      p++;
    }

    if (result.length > 0) {
      // console.log('prevKeys', prevKeys);
      // console.log('nextKeys', nextKeys);
      // console.log('result', result);
      // console.log('fiber', fiber);
    }
  }
}

function performMemo(fiber: Fiber, alternate: Fiber, instance: DarkElementInstance) {
  let memoFiber = fiber;
  const prevFactory = alternate.instance as ComponentFactory;
  const nextFactory = instance as ComponentFactory;

  if (alternate.transposition || nextFactory.type !== prevFactory.type) return memoFiber;

  const props = prevFactory.props;
  const nextProps = nextFactory.props;
  const skip = !nextFactory.shouldUpdate(props, nextProps);

  if (skip) {
    let nextFiber: Fiber = null;
    fiberMountStore.deepWalking.set(false);

    memoFiber = new Fiber({
      ...alternate,
      alternate,
      idx: fiber.idx,
      effectTag: EffectTag.SKIP,
    });

    alternate.alternate = null;
    nextFiber = memoFiber.child;

    while (nextFiber) {
      nextFiber.parent = memoFiber;
      nextFiber = nextFiber.nextSibling;
    }

    if (memoFiber.mountedToHost) {
      fiber.markMountedToHost();
    }

    if (memoFiber.effectHost) {
      fiber.markEffectHost();
    }

    if (memoFiber.layoutEffectHost) {
      fiber.markLayoutEffectHost();
    }

    if (memoFiber.insertionEffectHost) {
      fiber.markInsertionEffectHost();
    }

    if (memoFiber.portalHost) {
      fiber.markPortalHost();
    }
  }

  return memoFiber;
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

      if (detectIsString(result) || detectIsNumber(result)) {
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
        instance.children[i] = transformElementInstance(instance.children[i]) as DarkElementInstance;
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
  const keyedMap: Record<DarkElementKey, Fiber> = {};
  const nextKeysMap: Record<DarkElementKey, true> = {};

  while (nextFiber || idx < children.length) {
    if (nextFiber) {
      const key = getElementKey(nextFiber.instance);
      const prevKey = detectIsEmpty(key) ? idx : key;

      prevKeys.push(prevKey);
      keyedMap[prevKey] = nextFiber;
    }

    if (children[idx]) {
      const key = getElementKey(children[idx]);
      const nextKey = detectIsEmpty(key) ? idx : key;

      nextKeys.push(nextKey);
      nextKeysMap[nextKey] = true;
    }

    nextFiber = nextFiber ? nextFiber.nextSibling : null;
    idx++;
  }

  return {
    prevKeys,
    nextKeys,
    keyedMap,
    nextKeysMap,
  };
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

function transformElementInstance(instance: DarkElement) {
  return detectIsEmpty(instance) || instance === false ? createEmptyVirtualNode() : instance;
}

function getInstanceType(instance: DarkElementInstance): string | Function {
  return detectIsTagVirtualNode(instance)
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

function commitChanges() {
  const wipFiber = wipRootStore.get();
  const insertionEffects = insertionEffectsStore.get();

  isInsertionEffectsZone.set(true);
  insertionEffects.forEach(fn => fn());
  isInsertionEffectsZone.set(false);

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
  const deletions = deletionsStore.get();

  // important order
  for (const fiber of deletions) {
    unmountFiber(fiber);
    platform.applyCommit(fiber);
  }

  walkFiber(fiber, ({ nextFiber, isReturn, resetIsDeepWalking }) => {
    const skip = nextFiber.effectTag === EffectTag.SKIP;

    if (skip) {
      resetIsDeepWalking();
    } else if (!isReturn) {
      platform.applyCommit(nextFiber);
    }
  });

  platform.finishCommitWork();
  deletionsStore.set([]);
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

    fiber.alternate = new Fiber({
      ...fiber,
      alternate: null,
    });
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

function createHook(): Hook {
  return {
    idx: 0,
    values: [],
  };
}

export { Fiber, workLoop, hasChildrenProp, createUpdateCallback };
