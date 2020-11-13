import {
  EffectTag,
  NativeElement,
  WorkLoopOptions,
  Hook,
  cloneTagMap,
} from './model';
import { DarkElementKey, DarkElement, DarkElementInstance } from '../shared/model';
import { Context, ContextProviderValue } from '../context/model';
import {
  wipRootHelper,
  currentRootHelper,
  nextUnitOfWorkHelper,
  deletionsHelper,
  fiberMountHelper,
  componentFiberHelper,
  fromHookUpdateHelper,
  effectsHelper,
} from '@core/scope';
import { platform } from '@core/global';
import {
  ComponentFactory,
  detectIsComponentFactory,
  getComponentFactoryKey,
} from '@core/component';
import {
  VirtualNode,
  detectIsTagVirtualNode,
  createEmptyVirtualNode,
  getVirtualNodeKey,
  TagVirtualNode,
  detectIsVirtualNode,
} from '../view';
import {
  flatten,
  isEmpty,
  error,
  keyBy,
  isFunction,
  takeListFromEnd,
  isUndefined,
} from '@helpers';
import { detectIsMemo } from '../memo';

class Fiber<N = NativeElement> {
  public parent: Fiber<N>;
  public child: Fiber<N>;
  public prevSibling: Fiber<N>;
  public nextSibling: Fiber<N>;
  public alternate: Fiber<N>;
  public effectTag: EffectTag;
  public instance: DarkElementInstance;
  public hook: Hook;
  public shadow: Fiber<N>;
  public provider: Map<Context, ContextProviderValue>;
  public transposition: boolean;
  public intersecting: boolean;
  public link: N;

  constructor(options: Partial<Fiber<N>>) {
    this.parent = options.parent || null;
    this.child = options.child || null;
    this.prevSibling = options.prevSibling || null;
    this.nextSibling = options.nextSibling || null;
    this.alternate = options.alternate || null;
    this.effectTag = options.effectTag || null;
    this.instance = options.instance || null;
    this.hook = options.hook || createHook();
    this.shadow = options.shadow || null;
    this.provider = options.provider || null;
    this.transposition = !isUndefined(options.transposition) ? options.transposition : false;
    this.intersecting = !isUndefined(options.intersecting) ? options.intersecting : true;
    this.link = options.link || null;
  }
}

function workLoop(options: WorkLoopOptions) {
  const { deadline, onRender } = options;
  const wipFiber = wipRootHelper.get();
  let nextUnitOfWork = nextUnitOfWorkHelper.get();
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    nextUnitOfWorkHelper.set(nextUnitOfWork);
    shouldYield = deadline ? deadline.timeRemaining() < 1 : false;
  }

  if (!nextUnitOfWork && wipFiber) {
    commitChanges(onRender);
  }

  shouldYield && platform.ric(deadline => workLoop({ deadline, onRender }), { timeout: 16 });
}

function performUnitOfWork(fiber: Fiber) {
  let isDeepWalking = true;
  let nextFiber = fiber;
  let shadow: Fiber = fiber.shadow;
  let instance = fiber.instance;

  while (true) {
    isDeepWalking = fiberMountHelper.deepWalking.get();
    nextFiber.hook.idx = 0;

    if (isDeepWalking) {
      const hasChildren = hasChildrenProp(instance) && instance.children.length > 0;

      if (hasChildren) {
        const {
          performedFiber,
          performedNextFiber,
          performedShadow,
          performedInstance,
        } = performChild({ nextFiber, shadow, instance });

        nextFiber = performedNextFiber;
        shadow = performedShadow;
        instance = performedInstance;

        if (performedFiber) return performedFiber;
      } else {
        const {
          performedFiber,
          performedNextFiber,
          performedShadow,
          performedInstance,
        } = performSibling({ nextFiber, shadow, instance });

        nextFiber = performedNextFiber;
        shadow = performedShadow;
        instance = performedInstance;

        if (performedFiber) return performedFiber;
      }
    } else {
      const {
        performedFiber,
        performedNextFiber,
        performedShadow,
        performedInstance,
      } = performSibling({ nextFiber, shadow, instance });

      nextFiber = performedNextFiber;
      shadow = performedShadow;
      instance = performedInstance;

      if (performedFiber) return performedFiber;
    }

    if (nextFiber.parent === null) return null;
  }
}

type PerformChildOptions = {
  nextFiber: Fiber;
  shadow: Fiber;
  instance: DarkElementInstance;
};

function performChild(options: PerformChildOptions) {
  fiberMountHelper.jumpToChild();
  let nextFiber = options.nextFiber;
  let shadow = options.shadow;
  let instance = options.instance;

  shadow = shadow ? shadow.child : null;
  const alternate = getChildAlternate(nextFiber);
  const hook = shadow
    ? shadow.hook
    : alternate
      ? alternate.hook
      : createHook();
  const provider = shadow
    ? shadow.provider
    : alternate
      ? alternate.provider
      : null;
  let fiber = new Fiber({ hook, provider });

  componentFiberHelper.set(fiber);
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
  fiber = alternate
    ? performMemo({ fiber, alternate, instance })
    : fiber;

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
  fiberMountHelper.jumpToSibling();
  let nextFiber = options.nextFiber;
  let shadow = options.shadow;
  let instance = options.instance;
  const parent = nextFiber.parent.instance;
  const childrenIdx = fiberMountHelper.getIndex();
  const hasSibling = hasChildrenProp(parent) && parent.children[childrenIdx];

  if (hasSibling) {
    fiberMountHelper.deepWalking.set(true);

    shadow = shadow ? shadow.nextSibling : null;
    const alternate = getNextSiblingAlternate(nextFiber);
    const hook = shadow
      ? shadow.hook
      : alternate
        ? alternate.hook
        : createHook();
    const provider = shadow
      ? shadow.provider
      : alternate
        ? alternate.provider
        : null;
    let fiber = new Fiber({ hook, provider });

    componentFiberHelper.set(fiber);
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
    fiber = alternate
      ? performMemo({ fiber, alternate, instance })
      : fiber;

    fiber.prevSibling = nextFiber;
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
    fiberMountHelper.jumpToParent();
    fiberMountHelper.deepWalking.set(false);
    shadow = shadow ? shadow.parent : null;
    nextFiber = nextFiber.parent;
    instance = nextFiber.instance;
  }

  return {
    performedFiber: null,
    performedNextFiber: nextFiber,
    performedShadow: shadow,
    performedInstance: instance,
  };
}

type PerformAlternateOptions = {
  alternate: Fiber;
  instance: DarkElementInstance;
};

function mutateAlternate(options: PerformAlternateOptions) {
  const {
    alternate,
    instance,
  } = options;
  const alternateType = getInstanceType(alternate.instance);
  const elementType = getInstanceType(instance);
  const isSameType = elementType === alternateType;

  if (!isSameType) {
    alternate.effectTag = EffectTag.DELETION;
    deletionsHelper.get().push(alternate);
  } else if (hasChildrenProp(alternate.instance) && hasChildrenProp(instance)) {
    const isRequestedKeys = alternate.instance.children.length !== instance.children.length;

    if (isRequestedKeys) {
      const keys = [];
      const nextKeys = [];
      const max = Math.max(alternate.instance.children.length, instance.children.length);

      for (let i = 0; i < max; i++) {
        const key = alternate.instance.children[i] && getElementKey(alternate.instance.children[i]);
        const nextKey = instance.children[i] && getElementKey(instance.children[i]);

        !isEmpty(key) && keys.push(key);
        !isEmpty(nextKey) && nextKeys.push(nextKey);
      }

      const hasKeys = keys.length > 0;
      const hasAnyKeys = hasKeys || nextKeys.length > 0;

      if (process.env.NODE_ENV === 'development') {
        if (!hasAnyKeys) {
          error(`
            [Dark]: Operation of inserting, adding, replacing elements into list requires to have a unique key for every node (string or number, but not array index), otherwise the comparison algorithm won't work optimally!
          `);
        }
      }

      const performRemovingNodes = () => {
        const diffKeys = getDiffKeys(keys, nextKeys);

        if (diffKeys.length > 0) {
          for (const key of diffKeys) {
            const childAlternate = getAlternateByKey(key, alternate.child);

            if (childAlternate) {
              childAlternate.effectTag = EffectTag.DELETION;
              deletionsHelper.get().push(childAlternate);
            }
          }
        } else if (!hasKeys) {
          const diffCount = getInstanceChildDiffCount(alternate.instance, instance);
          const fibers: Array<Fiber> = takeListFromEnd(getSiblingFibers(alternate.child), diffCount).map(
            x => ((x.effectTag = EffectTag.DELETION), x),
          );

          deletionsHelper.get().push(...fibers);
        }
      }

      const performInsertingNodes = () => {
        const diffKeys = getDiffKeys(nextKeys, keys);

        if (diffKeys.length > 0) {
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

            if (nextKey !== keys[keyIdx] && diffKeyMap[nextKey]) {
              const insertionFiber = new Fiber({
                instance: createEmptyVirtualNode(),
                parent: alternate,
                effectTag: EffectTag.PLACEMENT,
              });

              if (keyIdx === 0) {
                insertionFiber.nextSibling = alternate.child;
                alternate.child = insertionFiber;
                insertionFiber.nextSibling && (insertionFiber.nextSibling.prevSibling = insertionFiber);
              } else {
                const fiber = getChildFiberByIdx(alternate, keyIdx);

                if (fiber) {
                  insertionFiber.nextSibling = fiber;
                  insertionFiber.prevSibling = fiber.prevSibling;
                  fiber.prevSibling && (fiber.prevSibling.nextSibling = insertionFiber);
                  fiber.prevSibling = insertionFiber;
                }
              }
            }

            keyIdx++;
          }
        }
      }

      performRemovingNodes();
      performInsertingNodes();
    }
  }
}

type PerformMemoOptions = {
  fiber: Fiber;
  alternate: Fiber;
  instance: DarkElementInstance;
};

function performMemo(options: PerformMemoOptions) {
  const {
    fiber,
    alternate,
    instance,
  } = options;

  if (detectIsMemo(fiber.instance)) {
    let memoFiber = null;
    const factory = instance as ComponentFactory;
    const alternateFactory = alternate.instance as ComponentFactory;

    if (factory.type !== alternateFactory.type) return fiber;

    const props = alternateFactory.props;
    const nextProps = factory.props;
    const skip = !factory.shouldUpdate(props, nextProps);

    if (skip) {
      fiberMountHelper.deepWalking.set(false);

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

      if (memoFiber.child) {
        let nextFiber = memoFiber.child.nextSibling;

        memoFiber.child.parent = memoFiber;

        while (nextFiber) {
          nextFiber.parent = memoFiber;
          nextFiber = nextFiber.nextSibling;
        }
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
  const {
    instance,
    idx,
    fiber,
    alternate,
  } = options;
  let performedInstance: DarkElementInstance = null;
  let performedShadow: Fiber = null;

  if (hasChildrenProp(instance)) {
    const elements = flatten([instance.children[idx]]);

    instance.children.splice(idx, 1, ...elements);
    performedInstance = instance.children[idx];
    performedShadow = alternate
      ? getRootShadow({
          instance:  performedInstance,
          fiber,
          alternate,
        })
      : performedShadow;
    performedInstance = mountInstance(performedInstance);
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
  const {
    instance,
    fiber,
    alternate,
  } = options;
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

function mountInstance(instance: DarkElementInstance) {
  const isFactory = detectIsComponentFactory(instance);
  const factory = instance as ComponentFactory;

  if (isFactory) {
    try {
      factory.children = flatten([factory.type(factory.props, factory.ref)]) as Array<DarkElementInstance>;
    } catch (err) {
      factory.children = [];
      error(err);
    }
  }

  if (hasChildrenProp(instance)) {
    for (let i = 0; i < instance.children.length; i++) {
      if (!instance.children[i]) {
        instance.children[i] = transformElementInstance(instance.children[i]) as DarkElementInstance;
      }
    }

    instance.children = isFactory ? instance.children : flatten([instance.children]);

    if (isFactory && factory.children.length === 0) {
      factory.children.push(createEmptyVirtualNode());
    }
  }

  return instance;
}

type MutateFiberOptions = {
  fiber: Fiber;
  alternate: Fiber;
  instance: VirtualNode | ComponentFactory;
};

function mutateFiber(options: MutateFiberOptions) {
  const {
    fiber,
    alternate,
    instance,
  } = options;
  const key = alternate ? getElementKey(alternate.instance) : null;
  const nextKey = alternate ? getElementKey(instance) : null;
  const isDifferentKeys = key !== nextKey;
  const isSameType = Boolean(alternate) && getInstanceType(alternate.instance) === getInstanceType(instance);
  const isUpdate = isSameType && !isDifferentKeys;

  fiber.instance = instance;
  fiber.alternate = alternate || null;
  fiber.link = isUpdate ? alternate.link : null;
  fiber.effectTag = isUpdate ? EffectTag.UPDATE : EffectTag.PLACEMENT;

  if (isSameType && isDifferentKeys) {
    alternate.effectTag = EffectTag.DELETION;
    deletionsHelper.get().push(alternate);
  }

  if (fiber.alternate) {
    fiber.alternate.shadow = null;
    fiber.alternate.alternate = null;
  }

  if (!fiber.link && detectIsVirtualNode(fiber.instance)) {
    fiber.link = platform.createLink(fiber);
  }
}

function getChildFiberByIdx(fiber: Fiber, idx: number) {
  let position = 0;
  let nextFiber = fiber.child;

  if (idx === 0) {
    return nextFiber;
  } else {
    while (nextFiber) {
      nextFiber = nextFiber.nextSibling;
      position++;
      if (position === idx) {
        return nextFiber;
      }
    }
  }

  return null;
}

function getAlternateByKey(key: DarkElementKey, fiber: Fiber) {
  if (isEmpty(key)) return null;
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

  return key || null;
}

function getDiffKeys(keys: Array<DarkElementKey>, nextKeys: Array<DarkElementKey>): Array<DarkElementKey> {
  const nextKeysMap = nextKeys.reduce((acc, key) => (acc[key] = true, acc), {});
  const diff = [];

  for (const key of keys) {
    if (!nextKeysMap[key]) {
      diff.push(key);
    }
  }

  return diff;
}

function getChildAlternate(fiber: Fiber): Fiber | null {
  let alternate = fiber.alternate && fiber.alternate.effectTag !== EffectTag.DELETION && fiber.alternate.child || null;

  while (alternate && alternate.effectTag === EffectTag.DELETION) {
    alternate = alternate.nextSibling;
  }

  return alternate;
}

function getNextSiblingAlternate(fiber: Fiber): Fiber | null {
  let alternate = fiber.alternate && fiber.alternate.nextSibling || null;

  while (alternate && alternate.effectTag === EffectTag.DELETION) {
    alternate = alternate.nextSibling;
  }

  return alternate;
}

function transformElementInstance(instance: DarkElement): DarkElement {
  return isEmpty(instance) || instance === false ? createEmptyVirtualNode() : instance;
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

function getInstanceChildDiffCount(alternateInstance: DarkElementInstance, instance: DarkElementInstance): number {
  return hasChildrenProp(alternateInstance) && hasChildrenProp(instance)
    ? alternateInstance.children.length - instance.children.length
    : 0;
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

function hasChildrenProp(element: VirtualNode | ComponentFactory): element is TagVirtualNode | ComponentFactory {
  return detectIsTagVirtualNode(element) || detectIsComponentFactory(element);
}

function commitChanges(onRender?: () => void) {
  const wipFiber = wipRootHelper.get();
  const fromHook = fromHookUpdateHelper.get();

  // console.log('wip', wipFiber);

  commitWork(wipFiber.child, () => {

    for (const fiber of deletionsHelper.get()) {
      platform.applyCommits(fiber);
    }

    deletionsHelper.set([]);
    wipRootHelper.set(null);

    for (const effect of effectsHelper.get()) {
      effect();
    }

    effectsHelper.reset();

    if (fromHook) {
      fromHookUpdateHelper.set(false);
    } else {
      currentRootHelper.set(wipFiber);
      isFunction(onRender) && onRender();
    }
  });
}

function commitWork(fiber: Fiber, onComplete: Function) {
  let nextFiber = fiber;
  let isDeepWalking = true;
  let isReturn = false;

  while (nextFiber) {
    const skip = nextFiber.effectTag === EffectTag.SKIP;

    if (skip) {
      isDeepWalking = false;
    } else if (!isReturn) {
      platform.applyCommits(nextFiber);
    }

    if (nextFiber.child && isDeepWalking) {
      nextFiber = nextFiber.child;
    } else if (nextFiber.nextSibling) {
      isDeepWalking = true;
      isReturn = false;
      nextFiber = nextFiber.nextSibling;
    } else if (nextFiber.parent !== fiber && nextFiber.parent !== fiber.parent) {
      isDeepWalking = false;
      isReturn = true;
      nextFiber = nextFiber.parent;
    } else {
      nextFiber = null;
    }

    if (nextFiber && nextFiber.shadow) {
      nextFiber.shadow = null;
    }
  }

  if (!nextFiber) {
    onComplete();
  }
}

function createHook(): Hook {
  return {
    idx: 0,
    values: [],
    updateScheduled: false,
    update: null,
  };
}

export {
  Fiber,
  workLoop,
  mountInstance,
  createHook,
  hasChildrenProp,
};
