import { EffectTag } from './model';
import {
  wipRootHelper,
  currentRootHelper,
  nextUnitOfWorkHelper,
} from '@core/scope';
import { global } from '@core/global';
import { ComponentFactory, detectIsComponentFactory } from '@core/component';
import { VirtualNode, detectIsTagVirtualNode } from '../view';
import { flatten } from '@helpers';


class Fiber {
  public parent: Fiber = null;
  public child: Fiber = null;
  public sibling: Fiber = null;
  public alternate: Fiber = null;
  public link: HTMLElement = null;
  public effectTag: EffectTag = null;
  public type: string | Function = null;
  public instance: VirtualNode | ComponentFactory = null;

  constructor(options: Partial<Fiber>) {
    this.parent = options.parent || this.parent;
    this.child = options.child || this.child;
    this.sibling = options.sibling || this.sibling;
    this.alternate = options.alternate || this.alternate;
    this.link = options.link || this.link;
    this.effectTag = options.effectTag || this.effectTag;
    this.type = options.type || this.type;
    this.instance = options.instance || this.instance;
  }
}

const createFiber = (options: Partial<Fiber>): Fiber => new Fiber(options);

function workLoop(deadline: IdleDeadline) {
  let shouldYield = false;
  let nextUnitOfWork = nextUnitOfWorkHelper.get();

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    nextUnitOfWorkHelper.set(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  // if (!nextUnitOfWork && wipRoot) {
  //   commitRoot();
  // }

  global.ric(workLoop);
}

function performUnitOfWork(fiber: Fiber) {
  updateComponent(fiber);

  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;

  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }

    nextFiber = nextFiber.parent;
  }
}

function updateComponent(fiber: Fiber) {
  let children = [];
  const isComponentFactory = detectIsComponentFactory(fiber.instance);

  console.log('fiber', fiber);

  if (isComponentFactory) {
    const factory = fiber.instance as ComponentFactory;

    children = flatten([factory.createElement(factory.props)]);
  } else {
    children = detectIsTagVirtualNode(fiber.instance)
      ? fiber.instance.children
      : [];
  }

  reconcileChildren(fiber, children);
}

function reconcileChildren(wipFiber: Fiber, elements: Array<VirtualNode>) {
  let index = 0;
  let alternate = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;

  while (index < elements.length || alternate != null) {
    let fiber = null;
    const element = elements[index];
    const isSameType = alternate && element && element.type === alternate.type;

    if (isSameType) {
      fiber = createFiber({
        type: alternate.type,
        instance: element,
        link: alternate.link,
        parent: wipFiber,
        alternate,
        effectTag: EffectTag.UPDATE,
      });
    } else if (element) {
      fiber = createFiber({
        type: detectIsTagVirtualNode(element) ? element.name : element.type,
        instance: element,
        link: null,
        parent: wipFiber,
        alternate: null,
        effectTag: EffectTag.PLACEMENT,
      });
    }

    if (alternate && !isSameType) {
      alternate.effectTag = EffectTag.DELETION;
      //deletions.push(oldFiber);
    }

    if (alternate) {
      alternate = alternate.sibling;
    }

    if (index === 0) {
      wipFiber.child = fiber;
    } else if (element) {
      prevSibling.sibling = fiber;
    }

    prevSibling = fiber;
    index++;
  }
}


export {
  Fiber,
  createFiber,
  workLoop,
};
