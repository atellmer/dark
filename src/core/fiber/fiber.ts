import { EffectTag, NativeElement } from './model';
import {
  wipRootHelper,
  currentRootHelper,
  nextUnitOfWorkHelper,
  deletionsHelper,
} from '@core/scope';
import { platform } from '@core/global';
import { ComponentFactory, detectIsComponentFactory, getComponentKey } from '@core/component';
import { VirtualNode, detectIsTagVirtualNode, createEmptyVirtualNode, detectIsVirtualNode } from '../view';
import { flatten, isEmpty, error } from '@helpers';


class Fiber<N = NativeElement> {
  public parent: Fiber<N> = null;
  public child: Fiber<N> = null;
  public sibling: Fiber<N> = null;
  public alternate: Fiber<N> = null;
  public link: N = null;
  public effectTag: EffectTag = null;
  public type: string | Function = null;
  public instance: VirtualNode | ComponentFactory = null;

  constructor(options: Partial<Fiber<N>>) {
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

function workLoop(deadline: IdleDeadline = null) {
  const wipRoot = wipRootHelper.get();
  let nextUnitOfWork = nextUnitOfWorkHelper.get();
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    nextUnitOfWorkHelper.set(nextUnitOfWork);
    shouldYield = deadline ? deadline.timeRemaining() < 1 : false;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  platform.ric(workLoop);
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

  if (isComponentFactory) {
    const factory = fiber.instance as ComponentFactory;

    children = flatten([factory.createElement(factory.props)]);
  } else {
    children = detectIsTagVirtualNode(fiber.instance)
      ? fiber.instance.children
      : [];

    if (!fiber.link) {
      fiber.link = platform.createLink(fiber);
    }
  }

  reconcileChildren(fiber, children);
}

function reconcileChildren(wipFiber: Fiber, elements: Array<VirtualNode>) {
  let idx = 0;
  let alternate = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;

  while (idx < elements.length || alternate !== null) {
    let fiber: Fiber = null;
    const element = idx < elements.length
      ? elements[idx] || createEmptyVirtualNode()
      : null;

    if (!element) {
      const key = getComponentKey(alternate.instance as ComponentFactory);

      if (isEmpty(key)) {
        error(UNIQ_KEY_ERROR);
      }
    }

    const type = element && (detectIsTagVirtualNode(element) ? element.name : element.type);
    const isSameType = Boolean(alternate && element && alternate.type === type);

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
        type,
        instance: element,
        link: null,
        parent: wipFiber,
        alternate: null,
        effectTag: EffectTag.PLACEMENT,
      });
    }

    if (alternate && !isSameType) {
      alternate.effectTag = EffectTag.DELETION;
      deletionsHelper.get().push(alternate);
    }

    if (alternate) {
      alternate = alternate.sibling;
    }

    if (idx === 0) {
      wipFiber.child = fiber;
    } else if (element) {
      prevSibling.sibling = fiber;
    }

    prevSibling = fiber;
    idx++;
  }
}

function commitRoot() {
  const wipRoot = wipRootHelper.get()

  commitWork(wipRoot.child);
  deletionsHelper.get().forEach(fiber => platform.mutateTree(fiber));
  currentRootHelper.set(wipRoot);
  wipRootHelper.set(null);
  deletionsHelper.set([]);
}

function commitWork(fiber: Fiber) {
  if (!fiber) return;

  platform.mutateTree(fiber);

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

const UNIQ_KEY_ERROR = `
  [Dark]: The node must have a unique key (string or number, but not array index), 
  otherwise the comparison algorithm will not work optimally or even will work incorrectly!
`;

export {
  Fiber,
  createFiber,
  workLoop,
};
