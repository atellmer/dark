import { EffectTag, NativeElement, WorkLoopOptions } from './model';
import { ElementKey, DarkElement } from '../shared/model';
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
import { VirtualNode, detectIsTagVirtualNode, detectIsTextVirtualNode, createEmptyVirtualNode, getVirtualNodeKey, TagVirtualNode, detectIsVirtualNode } from '../view';
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
  public parent: Fiber<N> = null;
  public child: Fiber<N> = null;
  public prevSibling: Fiber<N> = null;
  public nextSibling: Fiber<N> = null;
  public alternate: Fiber<N> = null;
  public link: N = null;
  public effectTag: EffectTag = null;
  public instance: VirtualNode | ComponentFactory = null;

  constructor(options: Partial<Fiber<N>>) {
    this.parent = options.parent || this.parent;
    this.child = options.child || this.child;
    this.prevSibling = options.prevSibling || this.prevSibling;
    this.nextSibling = options.nextSibling || this.nextSibling;
    this.alternate = options.alternate || this.alternate;
    this.link = options.link || this.link;
    this.effectTag = options.effectTag || this.effectTag;
    this.instance = options.instance || this.instance;
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

  //console.log('nextUnitOfWork', nextUnitOfWork);

  if (!nextUnitOfWork && wipFiber) {
    commitRoot(onRender);
  }

  platform.ric(deadline => workLoop({ deadline, onRender }));
}

function performUnitOfWork(fiber: Fiber) {
  let isDeepWalking = true;
  let element = fiber.instance;
  let nextFiber = fiber;
  let alternate =  fiber.alternate && fiber.alternate.child || null;

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
      element = element.children[0];

      if (detectIsComponentFactory(element)) {
        element.children = flatten([element.type(element.props)]) as Array<VirtualNode | ComponentFactory>;
      }
    }

    level++;
    levelMap[level] = 0;

    const fiber = createFiberFromElement(element, alternate);

    nextFiber.child = fiber;
    fiber.parent = nextFiber;
    nextFiber = fiber;

    return nextFiber;
  }

  function performSibling() {
    levelMap[level]++;
    const parent = nextFiber.parent.instance;
    const childrenIdx = levelMap[level];
    const hasSibling = (detectIsTagVirtualNode(parent)
      || detectIsComponentFactory(parent)) && parent.children[childrenIdx];

    alternate = nextFiber.alternate && nextFiber.alternate.nextSibling || null;

    if (hasSibling) {
      isDeepWalking = true;

      if (hasChildrenProp(parent)) {
        const elements = flatten([parent.children[childrenIdx]]);

        parent.children.splice(childrenIdx, 1, ...elements);
        element = parent.children[childrenIdx];

        if (detectIsComponentFactory(element)) {
          element.children = flatten([element.type(element.props)]) as Array<VirtualNode | ComponentFactory>;
        }
      }

      if (alternate && (hasChildrenProp(alternate.instance) && hasChildrenProp(element))) {
        if (alternate.instance.children.length > element.children.length) {
          const diffCount = alternate.instance.children.length - element.children.length;
          const list = takeListFromEnd(getSiblingFibers(alternate.child), diffCount);

          deletionsHelper.get().push(...list);
        }
      }

      const fiber = createFiberFromElement(element, alternate);

      fiber.prevSibling = nextFiber;
      nextFiber.nextSibling = fiber;
      fiber.parent = nextFiber.parent;
      nextFiber = fiber;

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

  function createFiberFromElement(element: VirtualNode | ComponentFactory, alternate: Fiber) {
    const fiber = new Fiber({
      instance: element,
      alternate: alternate || null,
      link: alternate ? alternate.link : null,
      effectTag: alternate ? EffectTag.UPDATE : EffectTag.PLACEMENT,
    });

    if (detectIsVirtualNode(fiber.instance) && !fiber.link) {
      fiber.link = platform.createLink(fiber);
    }

    return fiber;
  }
}

const createFiber = (options: Partial<Fiber>): Fiber => new Fiber(options);

function getSiblingFibers(fiber: Fiber) {
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

  commitPhaseHelper.set(true);
  commitWork(wipFiber.child, null, () => {
    deletionsHelper.get().forEach(fiber => platform.mutateTree(fiber));
    currentRootHelper.set(wipFiber);
    wipRootHelper.set(null);
    deletionsHelper.set([]);
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
