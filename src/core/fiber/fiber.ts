import { EffectTag, NativeElement, WorkLoopOptions } from './model';
import { DarkElementKey, DarkElement, DarkElementInstance } from '../shared/model';
import {
  getRootId,
  wipRootHelper,
  currentRootHelper,
  nextUnitOfWorkHelper,
  deletionsHelper,
  commitPhaseHelper,
  effectStoreHelper,
  currentMountedFiberHelper,
  forceUpdatePhaseHelper,
  viewportUpdatePhaseHelper,
  lastUpdateFnHelper,
  updateTimerIdHelper,
} from '@core/scope';
import { platform } from '@core/global';
import {
  ComponentFactory,
  detectIsComponentFactory,
  getComponentFactoryKey,
} from '@core/component';
import { VirtualNode, detectIsTagVirtualNode, detectIsTextVirtualNode, createEmptyVirtualNode, getVirtualNodeKey, TagVirtualNode, detectIsVirtualNode, detectIsCommentVirtualNode } from '../view';
import { flatten, isEmpty, error, isArray, keyBy, isFunction, isUndefined, isBoolean, takeListFromEnd } from '@helpers';
import { Fragment } from '../fragment';
import {
  MAX_FIBERS_RENDERED_PER_FRAME,
  SHADOW_UPDATE_TIMEOUT,
  UNIQ_KEY_ERROR,
} from '../constants';


let level = 0;
const levelMap = {};

class Fiber<N = NativeElement> {
  public parent: Fiber<N>;
  public child: Fiber<N>;
  public prevSibling: Fiber<N>;
  public nextSibling: Fiber<N>;
  public alternate: Fiber<N>;
  public effectTag: EffectTag;
  public instance: DarkElementInstance;
  public link: N = null;

  constructor(options: Partial<Fiber<N>>) {
    this.parent = options.parent || null;
    this.child = options.child || null;
    this.prevSibling = options.prevSibling || null;
    this.nextSibling = options.nextSibling || null;
    this.alternate = options.alternate || null;
    this.link = options.link || null;
    this.effectTag = options.effectTag || null;
    this.instance = options.instance || null;
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
    commitRoot(onRender);
  }

  platform.ric(deadline => workLoop({ deadline, onRender }));
}

function performUnitOfWork(fiber: Fiber) {
  let isDeepWalking = true;
  let element = fiber.instance;
  let nextFiber = fiber;
  let alternate = fiber.alternate
    && fiber.alternate.effectTag !== EffectTag.DELETION
    && fiber.alternate.child || null;

  while (true) {
    if (isDeepWalking) {
      const hasChild = (detectIsTagVirtualNode(element)
        || detectIsComponentFactory(element)) && Boolean(element.children[0]);

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
    if (hasChildrenProp(element)) {
      const elements = flatten([element.children[0]]);

      element.children.splice(0, 1, ...elements);
      element = element.children[0] as DarkElementInstance;

      if (detectIsComponentFactory(element)) {
        element.children = flatten([(element.type(element.props))]) as Array<DarkElementInstance>;
      }

      if (hasChildrenProp(element)) {
        element.children = element.children.map(transformElementInstance) as Array<DarkElementInstance>;
      }
    }

    level++;
    levelMap[level] = 0;

    if (alternate) {
      const alternateType = getInstanceType(alternate.instance);
      const elementType = getInstanceType(element);
      const diffCount = getInstanceChildDiffCount(alternate.instance, element);
      const isRemovingNodes = diffCount > 0;

      if (elementType !== alternateType) {
        alternate.effectTag = EffectTag.DELETION;
        deletionsHelper.get().push(alternate);
      } else if (isRemovingNodes) {
        const fibers: Array<Fiber> = takeListFromEnd(
          getSiblingFibers(alternate.child), diffCount,
        ).map(x => (x.effectTag = EffectTag.DELETION, x));

        deletionsHelper.get().push(...fibers);
      }
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
    const hasSibling = (detectIsTagVirtualNode(parent)
      || detectIsComponentFactory(parent)) && parent.children[childrenIdx];

    alternate = nextFiber.alternate
      && nextFiber.alternate.nextSibling
      && nextFiber.alternate.nextSibling.effectTag !== EffectTag.DELETION
      && nextFiber.alternate.nextSibling || null;

    if (hasSibling) {
      isDeepWalking = true;

      if (hasChildrenProp(parent)) {
        const elements = flatten([parent.children[childrenIdx]]);

        parent.children.splice(childrenIdx, 1, ...elements);
        element = parent.children[childrenIdx];

        if (detectIsComponentFactory(element)) {
          element.children = flatten([element.type(element.props)]) as Array<DarkElementInstance>;
        }

        if (hasChildrenProp(element)) {
          element.children = element.children.map(transformElementInstance) as Array<DarkElementInstance>;
        }
      }

      if (alternate) {
        const alternateType = getInstanceType(alternate.instance);
        const elementType = getInstanceType(element);
        const diffCount = getInstanceChildDiffCount(alternate.instance, element);
        const isRemovingNodes = diffCount > 0;

        if (elementType !== alternateType) {
          alternate.effectTag = EffectTag.DELETION;
          deletionsHelper.get().push(alternate);
        } else if (isRemovingNodes) {
          const fibers: Array<Fiber> = takeListFromEnd(
            getSiblingFibers(alternate.child), diffCount,
          ).map(x => (x.effectTag = EffectTag.DELETION, x));

          deletionsHelper.get().push(...fibers);
        }
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
      nextFiber = nextFiber.parent;
      element = nextFiber.instance;
      level--;
    }

    return null;
  }
}

function transformElementInstance(instance: DarkElement): DarkElement {
  return (isEmpty(instance) || instance === false) ? createEmptyVirtualNode() : instance;
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
  return (hasChildrenProp(alternateInstance) && hasChildrenProp(instance))
    ? alternateInstance.children.length - instance.children.length
    : 0;
}

function createFiberFromElement(instance: VirtualNode | ComponentFactory, alternate: Fiber) {
  const isUpdate = alternate && getInstanceType(alternate.instance) === getInstanceType(instance);
  const fiber = new Fiber({
    instance,
    alternate: alternate || null,
    link: isUpdate ? alternate.link : null,
    effectTag: isUpdate
      ? EffectTag.UPDATE
      : EffectTag.PLACEMENT,
  });

  fiber.alternate && (fiber.alternate.alternate = null);

  if (!fiber.link && detectIsVirtualNode(fiber.instance)) {
    fiber.link = platform.createLink(fiber);
  }

  return fiber;
}

const createFiber = (options: Partial<Fiber>): Fiber => new Fiber(options);

function getSiblingFibers(fiber: Fiber): Array<Fiber> {
  const list = [];
  let nextFiber = fiber;

  while (nextFiber) {
    list.push(nextFiber);
    nextFiber = nextFiber.nextSibling;
  }

  return list;
};

function hasChildrenProp(element: VirtualNode | ComponentFactory): element is TagVirtualNode | ComponentFactory {
  return detectIsTagVirtualNode(element) || detectIsComponentFactory(element);
}

function commitRoot(onRender: () => void) {
  const wipFiber = wipRootHelper.get();

  console.log('wip', wipFiber);

  commitWork(wipFiber.child, null, () => {
    deletionsHelper.get().forEach(fiber => platform.mutateTree(fiber));
    deletionsHelper.set([]);
    wipRootHelper.set(null);
    currentRootHelper.set(wipFiber);
    isFunction(onRender) && onRender();
  });
}


function commitWork(fiber: Fiber, rootFiber: Fiber = null, onComplete: Function) {
  let nextFiber = fiber;
  let isDeepWalking = true;

  rootFiber = rootFiber || fiber;

  while (nextFiber) {
    platform.mutateTree(nextFiber);

    if (nextFiber.child && isDeepWalking) {
      nextFiber = nextFiber.child;
    } else if (nextFiber.nextSibling) {
      isDeepWalking = true;
      nextFiber = nextFiber.nextSibling;
    } else if (nextFiber.parent && nextFiber.parent !== rootFiber.parent) {
      isDeepWalking = false;
      nextFiber = nextFiber.parent;
    } else {
      nextFiber = null;
    }
  }

  if (!nextFiber) {
    onComplete();
  }
}

export {
  Fiber,
  createFiber,
  workLoop,
};
