import { EffectTag, NativeElement, WorkLoopOptions, Hook } from './model';
import { DarkElementKey, DarkElement, DarkElementInstance } from '../shared/model';
import {
  getRootId,
  wipRootHelper,
  currentRootHelper,
  nextUnitOfWorkHelper,
  deletionsHelper,
  fiberMountHelper,
  componentFiberHelper,
  fromHookUpdateHelper,
  currentHookHelper,
} from '@core/scope';
import { platform } from '@core/global';
import { ComponentFactory, detectIsComponentFactory, getComponentFactoryKey } from '@core/component';
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
  isArray,
  keyBy,
  isFunction,
  takeListFromEnd,
  detectIsTestEnvironment,
} from '@helpers';
import { detectIsMemo, detectNeedUpdateMemo } from '../use-memo';
import { UNIQ_KEY_ERROR, IS_ALREADY_USED_KEY_ERROR, EMPTY_NODE } from '../constants';


class Fiber<N = NativeElement> {
  public parent: Fiber<N>;
  public child: Fiber<N>;
  public prevSibling: Fiber<N>;
  public nextSibling: Fiber<N>;
  public alternate: Fiber<N>;
  public effectTag: EffectTag;
  public instance: DarkElementInstance;
  public hook: Hook;
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

  platform.ric(deadline => workLoop({ deadline, onRender }));
}

function performUnitOfWork(fiber: Fiber) {
  let isDeepWalking = true;
  let element = fiber.instance;
  let nextFiber = fiber;

  while (true) {
    nextFiber.hook.idx = 0;

    if (isDeepWalking) {
      const hasChild = hasChildrenProp(element) && Boolean(element.children[0]);

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

    if (nextFiber.parent === null) {
      return null;
    }
  }

  function performChild() {
    fiberMountHelper.jumpToChild();

    const alternate = getChildAlternate(nextFiber);
    const hook = alternate ? alternate.hook : createHook();
    const isMemo = alternate && detectIsMemo(nextFiber.instance);
    const parentSkiped = alternate && nextFiber.parent && nextFiber.parent.effectTag === EffectTag.SKIP;
    const skip = isMemo
      ? !detectNeedUpdateMemo(nextFiber.instance as ComponentFactory)
      : parentSkiped;

    if (isMemo) {
      nextFiber.effectTag = skip ? EffectTag.SKIP : EffectTag.UPDATE;
    }

    currentHookHelper.set(hook);
    pertformInstance(element, 0, skip, alternate);

    if (!skip) {
      if (alternate) {
        performAlternate(alternate);
      }
    }

    const fiber = createFiberFromInstance(element, alternate, hook);

    nextFiber.child = fiber;
    fiber.parent = nextFiber;
    nextFiber = fiber;

    if (fiber.parent.effectTag === EffectTag.PLACEMENT) {
      fiber.effectTag = EffectTag.PLACEMENT;
    }

    if (fiber.parent.effectTag === EffectTag.SKIP) {
      fiber.effectTag = EffectTag.SKIP;
    }

    return nextFiber;
  }

  function performSibling() {
    fiberMountHelper.jumpToSibling();

    const parent = nextFiber.parent.instance;
    const childrenIdx = fiberMountHelper.getIndex();
    const hasSibling = hasChildrenProp(parent) && parent.children[childrenIdx];

    if (hasSibling) {
      isDeepWalking = true;

      const alternate = getNextSiblingAlternate(nextFiber);
      const hook = alternate ? alternate.hook : createHook();
      const isMemo = alternate && detectIsMemo(nextFiber.instance);
      const parentSkiped = alternate && nextFiber.parent && nextFiber.parent.effectTag === EffectTag.SKIP;
      const skip = isMemo
        ? !detectNeedUpdateMemo(nextFiber.instance as ComponentFactory)
        : parentSkiped;

      if (isMemo) {
        nextFiber.effectTag = skip ? EffectTag.SKIP : EffectTag.UPDATE;
      }

      currentHookHelper.set(hook);
      pertformInstance(parent, childrenIdx, skip, alternate);

      if (!skip) {
        if (alternate) {
          performAlternate(alternate);
        }
      }

      const fiber = createFiberFromInstance(element, alternate, hook);

      fiber.prevSibling = nextFiber;
      nextFiber.nextSibling = fiber;
      fiber.parent = nextFiber.parent;
      nextFiber = fiber;

      if (fiber.parent.effectTag === EffectTag.PLACEMENT) {
        fiber.effectTag = EffectTag.PLACEMENT;
      }

      if (fiber.parent.effectTag === EffectTag.SKIP) {
        fiber.effectTag = EffectTag.SKIP;
      }

      return nextFiber;
    } else {
      fiberMountHelper.jumpToParent();
      isDeepWalking = false;
      nextFiber = nextFiber.parent;
      element = nextFiber.instance;
    }

    return null;
  }

  function pertformInstance(instance: DarkElementInstance, idx: number, skip: boolean, alternate: Fiber) {
    if (hasChildrenProp(instance)) {
      const elements = flatten([instance.children[idx]]);

      instance.children.splice(idx, 1, ...elements);
      element = instance.children[idx];
      element = mountInstance(element, () => nextFiber, skip, alternate);
    }
  }

  function performAlternate(alternate: Fiber) {
    const alternateType = getInstanceType(alternate.instance);
    const elementType = getInstanceType(element);
    const isSameType = elementType === alternateType;

    if (!isSameType) {
      alternate.effectTag = EffectTag.DELETION;
      deletionsHelper.get().push(alternate);
    }

    if (hasChildrenProp(alternate.instance) && hasChildrenProp(element)) {
      const isRequestedKeys = alternate.instance.children.length !== element.children.length;

      if (isRequestedKeys) {
        const keys = alternate.instance.children.map(getElementKey).filter(Boolean);
        const nextKeys = element.children.map(getElementKey).filter(Boolean);
        const hasKeys = keys.length > 0;
        const hasAnyKeys = hasKeys || nextKeys.length > 0;

        if (!hasAnyKeys && !detectIsTestEnvironment()) {
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
                if (!detectIsTestEnvironment()) {
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

        if (isSameType) {
          performRemovingNodes();
          performInsertingNodes();
        }
      }
    }
  }
}

function mountInstance(instance: DarkElementInstance, getNextFiber: () => Fiber, skip: boolean, alternate: Fiber) {
  if (detectIsComponentFactory(instance)) {
    componentFiberHelper.set(getNextFiber);

    try {
      if (skip && alternate && hasChildrenProp(alternate.instance)) {
        instance.children = alternate.instance.children;
      } else {
        instance.children = flatten([instance.type(instance.props)]) as Array<DarkElementInstance>;
      }
    } catch (err) {
      instance.children = [];
      error(err);
    }
  }

  if (hasChildrenProp(instance)) {
    instance.children = flatten([instance.children.map(transformElementInstance)]) as Array<DarkElementInstance>;

    if (detectIsComponentFactory(instance) && instance.children.length === 0) {
      instance.children.push(createEmptyVirtualNode());
    }
  }

  return instance;
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

function createFiberFromInstance(instance: VirtualNode | ComponentFactory, alternate: Fiber, hook: Hook) {
  const key = alternate ? getElementKey(alternate.instance) : null;
  const nextKey = alternate ? getElementKey(instance) : null;
  const isDifferentKeys = key !== nextKey;
  const isSameType = Boolean(alternate) && getInstanceType(alternate.instance) === getInstanceType(instance);
  const isUpdate = isSameType && !isDifferentKeys;

  const fiber = new Fiber({
    instance,
    alternate: alternate || null,
    hook,
    link: isUpdate ? alternate.link : null,
    effectTag: isUpdate ? EffectTag.UPDATE : EffectTag.PLACEMENT,
  });

  if (isSameType && isDifferentKeys) {
    alternate.effectTag = EffectTag.DELETION;
    deletionsHelper.get().push(alternate);
  }

  fiber.alternate && (fiber.alternate.alternate = null);

  if (!fiber.link && detectIsVirtualNode(fiber.instance)) {
    fiber.link = platform.createLink(fiber);
  }

  return fiber;
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
    deletionsHelper.get().forEach(platform.applyCommits);
    deletionsHelper.set([]);
    wipRootHelper.set(null);

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

    if (!isReturn && nextFiber.effectTag !== EffectTag.SKIP) {
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
    // console.log('complete!');
    onComplete();
  }
}

function createHook(): Hook {
  return {
    idx: 0,
    values: [],
  };
}

export {
  Fiber,
  workLoop,
  mountInstance,
  createHook,
};
