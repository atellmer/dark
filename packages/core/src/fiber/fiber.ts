import { flatten, detectIsEmpty, error, keyBy, takeListFromEnd, detectIsUndefined, detectIsArray } from '../helpers';
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
  isLayoutEffectsZone,
} from '../scope';
import { type ComponentFactory, detectIsComponentFactory, getComponentFactoryKey } from '../component';
import {
  type TagVirtualNode,
  detectIsTagVirtualNode,
  createEmptyVirtualNode,
  getVirtualNodeKey,
  detectIsVirtualNode,
  detectIsVirtualNodeFactory,
} from '../view';
import { detectIsMemo } from '../memo';
import type { Context, ContextProviderValue } from '../context';
import type { DarkElementKey, DarkElement, DarkElementInstance } from '../shared';
import { PARTIAL_UPDATE } from '../constants';
import { type NativeElement, type Hook, EffectTag, cloneTagMap } from './types';
import { hasEffects } from '../use-effect';
import { hasLayoutEffects } from '../use-layout-effect';
import { walkFiber } from '../walk';
import { unmountFiber } from '../unmount';

class Fiber<N = NativeElement> {
  public nativeElement: N;
  public parent: Fiber<N>;
  public child: Fiber<N>;
  public nextSibling: Fiber<N>;
  public alternate: Fiber<N>;
  public effectTag: EffectTag;
  public instance: DarkElementInstance;
  public hook: Hook;
  public shadow: Fiber<N>;
  public provider: Map<Context, ContextProviderValue>;
  public transposition: boolean;
  public mountedToHost: boolean;
  public portalHost: boolean;
  public effectHost: boolean;
  public layoutEffectHost: boolean;
  public childrenCount: number;
  public marker: string;
  public isUsed: boolean;
  public idx: number;
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
    this.shadow = options.shadow || null;
    this.provider = options.provider || null;
    this.transposition = !detectIsUndefined(options.transposition) ? options.transposition : false;
    this.mountedToHost = !detectIsUndefined(options.mountedToHost) || false;
    this.portalHost = !detectIsUndefined(options.portalHost) ? options.portalHost : false;
    this.effectHost = !detectIsUndefined(options.effectHost) ? options.effectHost : false;
    this.layoutEffectHost = !detectIsUndefined(options.layoutEffectHost) ? options.layoutEffectHost : false;
    this.childrenCount = options.childrenCount || 0;
    this.marker = options.marker || '';
    this.idx = options.idx || 0;
    this.isUsed = options.isUsed || false;
  }

  public markPortalHost() {
    this.portalHost = true;
    this.parent && !this.parent.portalHost && this.parent.markPortalHost();
  }

  public markEffectHost() {
    this.effectHost = true;
    this.parent && !this.parent.effectHost && this.parent.markEffectHost();
  }

  public markLayoutEffectHost() {
    this.layoutEffectHost = true;
    this.parent && !this.parent.layoutEffectHost && this.parent.markLayoutEffectHost();
  }

  public markMountedToHost() {
    this.mountedToHost = true;
    this.parent && !this.parent.mountedToHost && this.parent.markMountedToHost();
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
  let shadow: Fiber = fiber.shadow;
  let instance = fiber.instance;

  while (true) {
    isDeepWalking = fiberMountStore.deepWalking.get();
    nextFiber.hook.idx = 0;

    if (isDeepWalking) {
      const hasChildren = hasChildrenProp(instance) && instance.children.length > 0;

      if (hasChildren) {
        const { performedFiber, performedNextFiber, performedShadow, performedInstance } = performChild({
          nextFiber,
          shadow,
          instance,
        });

        nextFiber = performedNextFiber;
        shadow = performedShadow;
        instance = performedInstance;

        if (performedFiber) return performedFiber;
      } else {
        const { performedFiber, performedNextFiber, performedShadow, performedInstance } = performSibling({
          nextFiber,
          shadow,
          instance,
        });

        nextFiber = performedNextFiber;
        shadow = performedShadow;
        instance = performedInstance;

        if (performedFiber) return performedFiber;
      }
    } else {
      const { performedFiber, performedNextFiber, performedShadow, performedInstance } = performSibling({
        nextFiber,
        shadow,
        instance,
      });

      nextFiber = performedNextFiber;
      shadow = performedShadow;
      instance = performedInstance;

      if (performedFiber) return performedFiber;
    }

    performPartialUpdateEffects(nextFiber);

    if (nextFiber.parent === null) return null;
  }
}

function performPartialUpdateEffects(nextFiber: Fiber) {
  if (nextFiber.marker !== PARTIAL_UPDATE) return;

  const alternate = nextFiber.child?.alternate || null;
  const fiber = nextFiber.child || null;

  if (alternate && fiber && alternate.nextSibling && !fiber.nextSibling) {
    let nextFiber = alternate.nextSibling;
    const deletions: Array<Fiber> = [];

    while (nextFiber) {
      nextFiber.effectTag = EffectTag.DELETION;
      deletions.push(nextFiber);
      nextFiber = nextFiber.nextSibling;
    }

    deletionsStore.get().push(...deletions);
  }
}

type PerformChildOptions = {
  nextFiber: Fiber;
  shadow: Fiber;
  instance: DarkElementInstance;
};

function performChild(options: PerformChildOptions) {
  fiberMountStore.jumpToChild();
  let nextFiber = options.nextFiber;
  let shadow = options.shadow;
  let instance = options.instance;

  shadow = shadow ? shadow.child : null;

  const alternate = getChildAlternate(nextFiber);
  const hook = getHook({ shadow, alternate, instance });
  const provider = shadow ? shadow.provider : alternate ? alternate.provider : null;
  let fiber = new Fiber({ hook, provider });

  currentFiberStore.set(fiber);
  fiber.parent = nextFiber;

  const { performedInstance, performedShadow } = pertformInstance({
    instance,
    idx: 0,
    fiber,
    alternate,
  });
  instance = performedInstance || instance;
  shadow = performedShadow || shadow;
  alternate && mutateAlternate({ alternate, instance });
  mutateFiber({ fiber, alternate, instance });
  fiber = alternate ? performMemo({ fiber, alternate, instance }) : fiber;

  fiber.idx = 0;

  nextFiber.child = fiber;
  fiber.parent = nextFiber;
  fiber.shadow = shadow;
  nextFiber = fiber;

  cloneTagMap[fiber.parent.effectTag] && (fiber.effectTag = fiber.parent.effectTag);

  return {
    performedFiber: nextFiber,
    performedNextFiber: nextFiber,
    performedShadow: shadow,
    performedInstance: instance,
  };
}

type PerformSiblingOptions = {
  nextFiber: Fiber;
  shadow: Fiber;
  instance: DarkElementInstance;
};

function performSibling(options: PerformSiblingOptions) {
  fiberMountStore.jumpToSibling();
  let nextFiber = options.nextFiber;
  let shadow = options.shadow;
  let instance = options.instance;
  const parent = nextFiber.parent.instance;
  const childrenIdx = fiberMountStore.getIndex();
  const hasSibling = hasChildrenProp(parent) && parent.children[childrenIdx];

  if (hasSibling) {
    fiberMountStore.deepWalking.set(true);

    shadow = shadow ? shadow.nextSibling : null;
    const alternate = getNextSiblingAlternate(nextFiber);
    const hook = getHook({ shadow, alternate, instance });
    const provider = shadow ? shadow.provider : alternate ? alternate.provider : null;
    let fiber = new Fiber({ hook, provider });

    currentFiberStore.set(fiber);
    fiber.parent = nextFiber.parent;

    const { performedInstance, performedShadow } = pertformInstance({
      instance: parent,
      idx: childrenIdx,
      fiber,
      alternate,
    });
    instance = performedInstance || instance;
    shadow = performedShadow || shadow;
    alternate && mutateAlternate({ alternate, instance });
    mutateFiber({ fiber, alternate, instance });
    fiber = alternate ? performMemo({ fiber, alternate, instance }) : fiber;

    fiber.idx = childrenIdx;

    fiber.parent = nextFiber.parent;
    nextFiber.nextSibling = fiber;
    fiber.shadow = shadow;
    nextFiber = fiber;

    cloneTagMap[fiber.parent.effectTag] && (fiber.effectTag = fiber.parent.effectTag);

    return {
      performedFiber: nextFiber,
      performedNextFiber: nextFiber,
      performedShadow: shadow,
      performedInstance: instance,
    };
  } else {
    fiberMountStore.jumpToParent();
    fiberMountStore.deepWalking.set(false);
    shadow = shadow ? shadow.parent : null;
    nextFiber = nextFiber.parent;
    instance = nextFiber.instance;

    if (hasChildrenProp(nextFiber.instance)) {
      nextFiber.instance.children = [];
    }
  }

  return {
    performedFiber: null,
    performedNextFiber: nextFiber,
    performedShadow: shadow,
    performedInstance: instance,
  };
}

type MutateFiberOptions = {
  fiber: Fiber;
  alternate: Fiber;
  instance: DarkElementInstance;
};

function mutateFiber(options: MutateFiberOptions) {
  const { fiber, alternate, instance } = options;
  const key = alternate ? getElementKey(alternate.instance) : null;
  const nextKey = alternate ? getElementKey(instance) : null;
  const isDifferentKeys = key !== nextKey;
  const isSameType = Boolean(alternate) && getInstanceType(alternate.instance) === getInstanceType(instance);
  const isUpdate = isSameType && !isDifferentKeys;

  fiber.instance = instance;
  fiber.alternate = alternate || null;
  fiber.nativeElement = isUpdate ? alternate.nativeElement : null;
  fiber.effectTag = isUpdate ? EffectTag.UPDATE : EffectTag.PLACEMENT;
  fiber.mountedToHost = isUpdate;

  if (hasChildrenProp(fiber.instance)) {
    fiber.childrenCount = fiber.instance.children.length;
  }

  if (fiber.alternate) {
    fiber.alternate.shadow = null;
    fiber.alternate.alternate = null;
  }

  if (!fiber.nativeElement && detectIsVirtualNode(fiber.instance)) {
    fiber.nativeElement = platform.createNativeElement(fiber.instance);
  }
}

type PerformAlternateOptions = {
  alternate: Fiber;
  instance: DarkElementInstance;
};

function mutateAlternate(options: PerformAlternateOptions) {
  const { alternate, instance } = options;
  const alternateType = getInstanceType(alternate.instance);
  const elementType = getInstanceType(instance);
  const isSameType = elementType === alternateType;
  const prevKey = getElementKey(alternate.instance);
  const nextKey = getElementKey(instance);
  const isSameKeys = prevKey === nextKey;

  alternate.isUsed = true;

  if (!isSameType || !isSameKeys) {
    alternate.effectTag = EffectTag.DELETION;
    deletionsStore.get().push(alternate);
  } else if (hasChildrenProp(alternate.instance) && hasChildrenProp(instance)) {
    const prevElementsCount = alternate.childrenCount;
    const nextElementsCount = instance.children.length;

    if (prevElementsCount !== nextElementsCount) {
      const children = hasChildrenProp(instance) ? instance.children : [];
      const { prevKeys, nextKeys } = extractKeys(alternate.child, children);
      const hasPrevKeys = prevKeys.length > 0;
      const hasNextKeys = nextKeys.length > 0;
      const hasAnyKeys = hasPrevKeys || hasNextKeys;

      if (process.env.NODE_ENV === 'development') {
        if (!hasAnyKeys && prevElementsCount !== 0 && nextElementsCount !== 0) {
          error(`
            [Dark]: Operation of inserting, adding, replacing elements into list requires to have a unique key for every node (string or number, but not array index)!
          `);
        }
      }

      const performRemoving = () => {
        const diffKeys = getDiffKeys(prevKeys, nextKeys);

        if (diffKeys.length > 0) {
          const fibersMap = createFibersByKeyMap(alternate.child);

          for (const key of diffKeys) {
            const fiber = fibersMap[key] || null;

            if (fiber) {
              fiber.effectTag = EffectTag.DELETION;
              deletionsStore.get().push(fiber);
            }
          }
        } else {
          const diffCount = prevElementsCount - nextElementsCount;
          if (diffCount <= 0) return;
          const fibers = takeListFromEnd(getSiblingFibers(alternate.child), diffCount);

          for (const fiber of fibers) {
            fiber.effectTag = EffectTag.DELETION;
          }

          deletionsStore.get().push(...fibers);
        }
      };

      const performInserting = () => {
        const diffKeys = getDiffKeys(nextKeys, prevKeys);

        if (diffKeys.length === 0 || diffKeys.length === nextKeys.length) return;

        const diffKeyMap = keyBy(diffKeys, x => x);
        const usedKeyMap = {};
        let keyIdx = 0;

        for (const nextKey of nextKeys) {
          if (process.env.NODE_ENV === 'development') {
            if (usedKeyMap[nextKey]) {
              error(`Some key of node already has been used!`);
            }
          }

          usedKeyMap[nextKey] = true;

          if (nextKey !== prevKeys[keyIdx] && diffKeyMap[nextKey]) {
            const insertionFiber = new Fiber({
              instance: createEmptyVirtualNode(),
              parent: alternate,
              effectTag: EffectTag.PLACEMENT,
            });

            if (keyIdx === 0) {
              insertionFiber.nextSibling = alternate.child;
              alternate.child = insertionFiber;
            } else {
              const [fiber, prevFiber] = getFibersByIdx(alternate.child, keyIdx);

              if (fiber && prevFiber) {
                insertionFiber.nextSibling = fiber;
                prevFiber.nextSibling = insertionFiber;
              }
            }
          }

          keyIdx++;
        }
      };

      performRemoving();
      performInserting();
    }
  }
}

type PerformMemoOptions = {
  fiber: Fiber;
  alternate: Fiber;
  instance: DarkElementInstance;
};

function performMemo(options: PerformMemoOptions) {
  const { fiber, alternate, instance } = options;

  if (detectIsMemo(fiber.instance)) {
    let memoFiber: Fiber = null;
    const factory = instance as ComponentFactory;
    const alternateFactory = alternate.instance as ComponentFactory;

    if (factory.type !== alternateFactory.type) return fiber;

    const props = alternateFactory.props;
    const nextProps = factory.props;
    const skip = !factory.shouldUpdate(props, nextProps);

    if (skip) {
      let nextFiber: Fiber = null;
      fiberMountStore.deepWalking.set(false);

      memoFiber = new Fiber({
        ...alternate,
        alternate,
        effectTag: EffectTag.SKIP,
        nextSibling: alternate.nextSibling
          ? alternate.nextSibling.effectTag === EffectTag.DELETION
            ? null
            : alternate.nextSibling
          : null,
      });

      alternate.alternate = null;
      nextFiber = memoFiber.child;

      while (nextFiber) {
        nextFiber.parent = memoFiber;
        nextFiber = nextFiber.nextSibling;
      }

      if (memoFiber.effectHost) {
        fiber.markEffectHost();
      }

      if (memoFiber.layoutEffectHost) {
        fiber.markLayoutEffectHost();
      }

      if (memoFiber.mountedToHost) {
        fiber.markMountedToHost();
      }

      if (memoFiber.portalHost) {
        fiber.markPortalHost();
      }

      return memoFiber;
    }
  }

  return fiber;
}

type PerformInstanceOptions = {
  instance: DarkElementInstance;
  idx: number;
  fiber: Fiber;
  alternate: Fiber;
};

function pertformInstance(options: PerformInstanceOptions) {
  const { instance, idx, fiber, alternate } = options;
  let performedInstance: DarkElementInstance = null;
  let performedShadow: Fiber = null;

  if (hasChildrenProp(instance)) {
    const elements = detectIsArray(instance.children[idx])
      ? flatten([instance.children[idx]])
      : [instance.children[idx]];

    instance.children.splice(idx, 1, ...elements);
    performedInstance = instance.children[idx];
    performedShadow = alternate
      ? getRootShadow({
          instance: performedInstance,
          fiber,
          alternate,
        })
      : performedShadow;
    performedInstance = mountInstance(fiber, performedInstance);
  }

  if (detectIsComponentFactory(performedInstance)) {
    if (hasEffects(fiber)) {
      fiber.markEffectHost();
    }

    if (hasLayoutEffects(fiber)) {
      fiber.markLayoutEffectHost();
    }

    if (platform.detectIsPortal(performedInstance)) {
      fiber.markPortalHost();
    }
  }

  return {
    performedInstance,
    performedShadow,
  };
}

type GetRootShadowOptions = {
  instance: DarkElementInstance;
  fiber: Fiber;
  alternate: Fiber;
};

function getRootShadow(options: GetRootShadowOptions) {
  const { instance, fiber, alternate } = options;
  const key = getElementKey(alternate.instance);
  const nextKey = getElementKey(instance);
  let shadow: Fiber = null;

  if (key !== nextKey) {
    shadow = getAlternateByKey(nextKey, alternate.parent.child);

    if (shadow) {
      fiber.hook = shadow.hook;
      fiber.provider = shadow.provider;
      alternate.transposition = true;
    }
  }

  return shadow;
}

function mountInstance(fiber: Fiber, instance: DarkElementInstance) {
  const isComponentFactory = detectIsComponentFactory(instance);
  const factory = instance as ComponentFactory;

  if (isComponentFactory) {
    try {
      const result = factory.type(factory.props, factory.ref);

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

function getFibersByIdx(fiber: Fiber, idx: number): [Fiber | null, Fiber | null] {
  const map: Record<string, Fiber> = {};
  let nextFiber = fiber;
  let position = 0;

  while (nextFiber) {
    map[position] = nextFiber;

    if (position === idx) {
      return [map[position] || null, map[position - 1] || null];
    }

    position++;
    nextFiber = nextFiber.nextSibling;
  }

  return [null, null];
}

function createFibersByKeyMap(fiber: Fiber) {
  let nextFiber = fiber;
  const map: Record<string, Fiber> = {};

  while (nextFiber) {
    const key = getElementKey(nextFiber.instance);

    if (!detectIsEmpty(key)) {
      map[key] = nextFiber;
    }

    nextFiber = nextFiber.nextSibling;
  }

  return map;
}

function extractKeys(alternate: Fiber, children: Array<DarkElementInstance>) {
  let nextFiber = alternate;
  let idx = 0;
  const prevKeys: Array<DarkElementKey> = [];
  const nextKeys: Array<DarkElementKey> = [];

  while (nextFiber || idx < children.length) {
    const key = nextFiber && getElementKey(nextFiber.instance);
    const nextKey = children[idx] && getElementKey(children[idx]);

    if (!detectIsEmpty(key)) {
      prevKeys.push(key);
    }

    if (!detectIsEmpty(nextKey)) {
      nextKeys.push(nextKey);
    }

    nextFiber = nextFiber ? nextFiber.nextSibling : null;
    idx++;
  }

  return {
    prevKeys,
    nextKeys,
  };
}

function getAlternateByKey(key: DarkElementKey, fiber: Fiber) {
  if (detectIsEmpty(key)) return null;
  let nextFiber = fiber;

  while (nextFiber) {
    if (key === getElementKey(nextFiber.instance)) {
      return nextFiber;
    }

    nextFiber = nextFiber.nextSibling;
  }

  return null;
}

function getElementKey(instance: DarkElementInstance): DarkElementKey | null {
  const key = detectIsComponentFactory(instance)
    ? getComponentFactoryKey(instance)
    : detectIsTagVirtualNode(instance)
    ? getVirtualNodeKey(instance)
    : null;

  return key;
}

function getDiffKeys(keys: Array<DarkElementKey>, nextKeys: Array<DarkElementKey>): Array<DarkElementKey> {
  const nextKeysMap = nextKeys.reduce((acc, key) => ((acc[key] = true), acc), {});
  const diff = [];

  for (const key of keys) {
    if (!nextKeysMap[key]) {
      diff.push(key);
    }
  }

  return diff;
}

function getChildAlternate(fiber: Fiber): Fiber | null {
  let alternate = fiber.alternate && fiber.alternate.effectTag !== EffectTag.DELETION ? fiber.alternate.child : null;

  while (alternate && alternate.effectTag === EffectTag.DELETION) {
    alternate = alternate.nextSibling;
  }

  return alternate;
}

function getNextSiblingAlternate(fiber: Fiber): Fiber | null {
  let alternate = fiber.alternate?.nextSibling || null;

  while (alternate && alternate.effectTag === EffectTag.DELETION) {
    alternate = alternate.nextSibling;
  }

  return alternate;
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

function getSiblingFibers(fiber: Fiber): Array<Fiber> {
  const list = [];
  let nextFiber = fiber;

  while (nextFiber) {
    list.push(nextFiber);
    nextFiber = nextFiber.nextSibling;
  }

  return list;
}

function hasChildrenProp(element: DarkElementInstance): element is TagVirtualNode | ComponentFactory {
  return detectIsTagVirtualNode(element) || detectIsComponentFactory(element);
}

function commitChanges() {
  const wipFiber = wipRootStore.get();

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

  walkFiber({
    fiber,
    onLoop: ({ nextFiber, isReturn, resetIsDeepWalking }) => {
      const skip = nextFiber.effectTag === EffectTag.SKIP;

      if (skip) {
        resetIsDeepWalking();
      } else if (!isReturn) {
        platform.applyCommit(nextFiber);
      }

      if (nextFiber && nextFiber.shadow) {
        nextFiber.shadow = null;
      }
    },
  });

  platform.finishCommitWork();
  deletionsStore.set([]);
  onComplete();
}

function createHook(): Hook {
  return {
    idx: 0,
    values: [],
  };
}

type GetHookOptions = {
  shadow: Fiber;
  alternate: Fiber;
  instance: DarkElementInstance;
};

function getHook(options: GetHookOptions) {
  const { shadow, alternate, instance } = options;

  if (shadow) return shadow.hook;

  if (alternate && getElementKey(alternate.instance) === getElementKey(instance)) {
    return alternate.hook;
  }

  return createHook();
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

export { Fiber, workLoop, createHook, hasChildrenProp, createUpdateCallback };
