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
  detectIsDevEnvironment,
  isUndefined,
} from '@helpers';
import { detectIsMemo } from '../memo';
import { UNIQ_KEY_ERROR, IS_ALREADY_USED_KEY_ERROR } from '../constants';

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

  shouldYield && platform.ric(deadline => workLoop({ deadline, onRender }));
}

function performUnitOfWork(fiber: Fiber) {
  let isDeepWalking = true;
  let element = fiber.instance;
  let nextFiber = fiber;
  let shadow: Fiber = fiber.shadow;

  while (true) {
    isDeepWalking = fiberMountHelper.deepWalking.get();
    nextFiber.hook.idx = 0;

    if (isDeepWalking) {
      const hasChild = hasChildrenProp(element) && element.children.length > 0;

      if (hasChild) {
        const childFiber = performChild();

        if (childFiber) return childFiber;
      } else {
        const siblingFiber = performSibling();

        if (siblingFiber) return siblingFiber;
      }
    } else {
      const siblingFiber = performSibling();

      if (siblingFiber) return siblingFiber;
    }

    if (nextFiber.parent === null) return null;
  }

  function performChild() {
    fiberMountHelper.jumpToChild();

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

    pertformInstance({
      instance: element,
      idx: 0,
      fiber,
      alternate,
    });
    alternate && performAlternate(alternate);
    mutateFiber(fiber, element, alternate);
    fiber = alternate ? performMemo(fiber, alternate) : fiber;

    nextFiber.child = fiber;
    fiber.parent = nextFiber;
    fiber.shadow = shadow;
    nextFiber = fiber;

    cloneTagMap[fiber.parent.effectTag] && (fiber.effectTag = fiber.parent.effectTag);

    return nextFiber;
  }

  function performSibling() {
    fiberMountHelper.jumpToSibling();

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

      pertformInstance({
        instance: parent,
        idx: childrenIdx,
        fiber,
        alternate,
      });
      alternate && performAlternate(alternate);
      mutateFiber(fiber, element, alternate);
      fiber = alternate ? performMemo(fiber, alternate) : fiber;

      fiber.prevSibling = nextFiber;
      fiber.parent = nextFiber.parent;
      nextFiber.nextSibling = fiber;
      fiber.shadow = shadow;
      nextFiber = fiber;

      cloneTagMap[fiber.parent.effectTag] && (fiber.effectTag = fiber.parent.effectTag);

      return nextFiber;
    } else {
      fiberMountHelper.jumpToParent();
      fiberMountHelper.deepWalking.set(false);
      shadow = shadow ? shadow.parent : null;
      nextFiber = nextFiber.parent;
      element = nextFiber.instance;
    }

    return null;
  }

  function getRootShadow(element: DarkElementInstance, fiber: Fiber, alternate: Fiber) {
    const key = getElementKey(alternate.instance);
    const nextKey = getElementKey(element);
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
    } = options;;

    if (hasChildrenProp(instance)) {
      const elements = flatten([instance.children[idx]]);

      instance.children.splice(idx, 1, ...elements);
      element = instance.children[idx];
      shadow = alternate ? getRootShadow(element, fiber, alternate) : shadow;
      element = mountInstance(element);
    }
  }

  function performAlternate(alternate: Fiber) {
    const alternateType = getInstanceType(alternate.instance);
    const elementType = getInstanceType(element);
    const isSameType = elementType === alternateType;

    if (!isSameType) {
      alternate.effectTag = EffectTag.DELETION;
      deletionsHelper.get().push(alternate);
    } else if (hasChildrenProp(alternate.instance) && hasChildrenProp(element)) {
      const isRequestedKeys = alternate.instance.children.length !== element.children.length;

      if (isRequestedKeys) {
        const keys = alternate.instance.children.map(getElementKey).filter(Boolean);
        const nextKeys = element.children.map(getElementKey).filter(Boolean);
        const hasKeys = keys.length > 0;
        const hasAnyKeys = hasKeys || nextKeys.length > 0;

        if (detectIsDevEnvironment() && !hasAnyKeys) {
          error(UNIQ_KEY_ERROR);
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
            const diffCount = getInstanceChildDiffCount(alternate.instance, element);
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
              if (usedKeyMap[nextKey]) {
                if (detectIsDevEnvironment()) {
                  error(IS_ALREADY_USED_KEY_ERROR);
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

  function performMemo(fiber: Fiber, alternate: Fiber) {
    let memoFiber = fiber;

    if (detectIsMemo(memoFiber.instance)) {
      const factory = element as ComponentFactory;
      const alternateFactory = alternate.instance as ComponentFactory;

      if (factory.type !== alternateFactory.type) return memoFiber;

      const props = alternateFactory.props;
      const nextProps = factory.props;
      const skip = !factory.shouldUpdate(props, nextProps);

      if (skip) {
        fiberMountHelper.deepWalking.set(false);

        memoFiber = new Fiber({
          ...alternate,
        });

        alternate.alternate = null;
        memoFiber.alternate = alternate;
        memoFiber.effectTag = EffectTag.SKIP;

        if (memoFiber.child) {
          let nextFiber = memoFiber.child.nextSibling;

          memoFiber.child.parent = memoFiber;

          while (nextFiber) {
            nextFiber.parent = memoFiber;
            nextFiber = nextFiber.nextSibling;
          }
        }
      }
    }

    return memoFiber;
  }
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

function mutateFiber(fiber: Fiber, instance: VirtualNode | ComponentFactory, alternate: Fiber) {
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
  const fromHookUpdate = fromHookUpdateHelper.get();

  while (nextFiber) {
    const skip = nextFiber.effectTag === EffectTag.SKIP;

    if (nextFiber.shadow) {
      nextFiber.shadow = null;
    }

    if (skip) {
      if (nextFiber.nextSibling) {
        isDeepWalking = true;
        isReturn = false;
        nextFiber = nextFiber.nextSibling;
      } else if (nextFiber.parent && nextFiber !== fiber) {
        isDeepWalking = false;
        isReturn = true;
        nextFiber = nextFiber.parent;
      } else {
        nextFiber = null;
      }

      continue;
    }

    if (!isReturn) {
      platform.applyCommits(nextFiber);
    }

    if (nextFiber.child && isDeepWalking) {
      nextFiber = nextFiber.child;
    } else if (nextFiber.nextSibling) {
      isDeepWalking = true;
      isReturn = false;
      nextFiber = nextFiber.nextSibling;
    } else if (nextFiber.parent && nextFiber !== fiber) {
      isDeepWalking = false;
      isReturn = true;
      nextFiber = nextFiber.parent;

      if (fromHookUpdate && nextFiber === fiber.parent) {
        nextFiber = null;
      }

    } else {
      nextFiber = null;
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
