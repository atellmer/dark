import { EffectTag, NativeElement, WorkLoopOptions } from './model';
import { DarkElementKey, DarkElement, DarkElementInstance } from '../shared/model';
import {
  getRootId,
  wipRootHelper,
  currentRootHelper,
  nextUnitOfWorkHelper,
  deletionsHelper,
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
  detectIsCommentVirtualNode,
} from '../view';
import { flatten, isEmpty, error, isArray, keyBy, isFunction, isUndefined, isBoolean, takeListFromEnd, deepClone } from '@helpers';
import { UNIQ_KEY_ERROR, IS_ALREADY_USED_KEY_ERROR, EMPTY_NODE } from '../constants';

let level = 0;
let levelMap = {};

class Fiber<N = NativeElement> {
  public parent: Fiber<N>;
  public child: Fiber<N>;
  public prevSibling: Fiber<N>;
  public nextSibling: Fiber<N>;
  public alternate: Fiber<N>;
  public effectTag: EffectTag;
  public instance: DarkElementInstance;
  public link: N = null;
  public placement: N = null;

  constructor(options: Partial<Fiber<N>>) {
    this.parent = options.parent || null;
    this.child = options.child || null;
    this.prevSibling = options.prevSibling || null;
    this.nextSibling = options.nextSibling || null;
    this.alternate = options.alternate || null;
    this.link = options.link || null;
    this.effectTag = options.effectTag || null;
    this.instance = options.instance || null;
    this.placement = options.placement || null;
  }
}

function workLoop(options: WorkLoopOptions) {
  const { deadline, fromRoot, onRender } = options;
  const wipFiber = wipRootHelper.get();
  let nextUnitOfWork = nextUnitOfWorkHelper.get();
  let shouldYield = false;

  if (fromRoot) {
    level = 0;
    levelMap = {};
  }

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    nextUnitOfWorkHelper.set(nextUnitOfWork);
    shouldYield = deadline ? deadline.timeRemaining() < 1 : false;
  }

  if (!nextUnitOfWork && wipFiber) {
    commitRoot(onRender);
  }

  platform.ric(deadline => workLoop({ deadline, onRender }));
}

function performUnitOfWork(fiber: Fiber) {
  let isDeepWalking = true;
  let element = fiber.instance;
  let nextFiber = fiber;

  while (true) {
    if (isDeepWalking) {
      const hasChild = hasChildrenProp(element) && Boolean(element.children[0]);

      if (hasChild) {
        return performChild();
      } else {
        const siblingFiber = performSibling();

        if (siblingFiber) return siblingFiber;
      }
    } else {
      const siblingFiber = performSibling();

      if (siblingFiber) return siblingFiber;
    }

    if (nextFiber.parent === null) {
      wipRootHelper.set(nextFiber);
      return null;
    }
  }

  function performChild() {
    pertformInstance(element, 0);

    const alternate = getChildAlternate(nextFiber);

    level++;
    levelMap[level] = 0;

    if (alternate) {
      performAlternate(alternate);
    }

    const fiber = createFiberFromElement(element, alternate);

    nextFiber.child = fiber;
    fiber.parent = nextFiber;
    nextFiber = fiber;

    if (fiber.parent.effectTag === EffectTag.PLACEMENT) {
      fiber.effectTag = EffectTag.PLACEMENT;
    }

    return nextFiber;
  }

  function performSibling() {
    levelMap[level]++;
    const parent = nextFiber.parent.instance;
    const childrenIdx = levelMap[level];
    const hasSibling = hasChildrenProp(parent) && parent.children[childrenIdx];

    if (hasSibling) {
      isDeepWalking = true;

      pertformInstance(parent, childrenIdx);

      const alternate = getNextSiblingAlternate(nextFiber);
      if (alternate) {
        performAlternate(alternate);
      }

      const fiber = createFiberFromElement(element, alternate);

      fiber.prevSibling = nextFiber;
      nextFiber.nextSibling = fiber;
      fiber.parent = nextFiber.parent;
      nextFiber = fiber;

      if (fiber.parent.effectTag === EffectTag.PLACEMENT) {
        fiber.effectTag = EffectTag.PLACEMENT;
      }

      return nextFiber;
    } else {
      isDeepWalking = false;
      levelMap[level] = 0;
      level--;
      nextFiber = nextFiber.parent;
      element = nextFiber.instance;
    }

    return null;
  }

  function pertformInstance(instance: DarkElementInstance, idx: number) {
    if (hasChildrenProp(instance)) {
      const elements = flatten([instance.children[idx]]);

      instance.children.splice(idx, 1, ...elements);
      element = instance.children[idx];

      if (detectIsComponentFactory(element)) {
        element.children = flatten([element.type(element.props)]) as Array<DarkElementInstance>;
      }

      if (hasChildrenProp(element)) {
        element.children = flatten([element.children.map(transformElementInstance)]) as Array<DarkElementInstance>;

        if (detectIsComponentFactory(element) && element.children.length === 0) {
          element.children.push(createEmptyVirtualNode());
        }
      }
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

        if (!hasAnyKeys) {
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
                error(IS_ALREADY_USED_KEY_ERROR);
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

function createFiberFromElement(instance: VirtualNode | ComponentFactory, alternate: Fiber) {
  const key = alternate ? getElementKey(alternate.instance) : null;
  const nextKey = alternate ? getElementKey(instance) : null;
  const isDifferentKeys = key !== nextKey;
  const isSameType = Boolean(alternate) && getInstanceType(alternate.instance) === getInstanceType(instance);
  const isUpdate = isSameType && !isDifferentKeys;

  const fiber = new Fiber({
    instance,
    alternate: alternate || null,
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

function commitRoot(onRender: () => void) {
  const wipFiber = wipRootHelper.get();

  console.log('wip', wipFiber);

  commitWork(wipFiber.child, () => {
    deletionsHelper.get().forEach(platform.applyCommits);
    deletionsHelper.set([]);
    wipRootHelper.set(null);
    currentRootHelper.set(wipFiber);
    isFunction(onRender) && onRender();
  });
}

function commitWork(fiber: Fiber, onComplete: Function) {
  let nextFiber = fiber;
  let isDeepWalking = true;
  let isReturn = false;

  while (nextFiber) {

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
    } else {
      nextFiber = null;
    }
  }

  if (!nextFiber) {
    onComplete();
  }
}

export { Fiber, workLoop };
