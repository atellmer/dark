import { EffectTag, NativeElement } from './model';
import {
  wipRootHelper,
  currentRootHelper,
  nextUnitOfWorkHelper,
  deletionsHelper,
} from '@core/scope';
import { platform } from '@core/global';
import {
  ComponentFactory,
  detectIsComponentFactory,
  getComponentFactoryKey,
} from '@core/component';
import { VirtualNode, detectIsTagVirtualNode, createEmptyVirtualNode, detectIsVirtualNode, getVirtualNodeKey } from '../view';
import { flatten, isEmpty, error } from '@helpers';
import { ElementKey } from '../shared/model';


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

function reconcileChildren(wipFiber: Fiber, elements: Array<VirtualNode | ComponentFactory>) {
  let idx = 0;
  let alternate = wipFiber?.alternate?.child;
  let prevSibling = null;
  const keys = alternate ? getAlternateKeys(alternate) : [];
  let nextKeys = [];
  let diff = [];

  if (keys.length > 0) {
    nextKeys = elements.map(x => getElementKey(x));
    diff = getDiffKeys(keys, nextKeys);
  }

  while (idx < elements.length || alternate) {
    let fiber: Fiber = null;
    const element = idx < elements.length
      ? elements[idx] || createEmptyVirtualNode()
      : null;

    if (!element) {
      const key = getElementKey(alternate.instance);

      if (isEmpty(key)) {
        error(UNIQ_KEY_ERROR);
      }
    }

    const type = element && (detectIsTagVirtualNode(element) ? element.name : element.type);
    const isSameType = Boolean(alternate && element && alternate.type === type);
    const alternateByKey = detectIsComponentFactory(element)
      ? getAlternateByKey(getElementKey(element), alternate)
      : null;

    if (isSameType) {
      fiber = createFiber({
        type: alternate.type,
        instance: element,
        link: alternate.link,
        parent: wipFiber,
        alternate: alternateByKey || alternate,
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
      const [key] = diff;
      const alternateByKey = !isEmpty(key) && detectIsComponentFactory(alternate.instance)
        ? getAlternateByKey(key, wipFiber.alternate.child)
        : null;

      diff.length > 0 && diff.shift();

      if (alternateByKey) {
        alternateByKey.effectTag = EffectTag.DELETION;
        deletionsHelper.get().push(alternateByKey);
      } else {
        alternate.effectTag = EffectTag.DELETION;
        deletionsHelper.get().push(alternate);
      }
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

function getAlternateByKey(key: string | number, fiber: Fiber) {
  if (isEmpty(key)) return null;
  let nextFiber = fiber;

  while (nextFiber) {
    if (key === getElementKey(nextFiber.instance)) {
      return nextFiber;
    }

    nextFiber = nextFiber.sibling;
  }

  return null;
}

function getAlternateKeys(fiber: Fiber): Array<string | number> {
  let nextFiber = fiber;
  const keys = [];

  while (nextFiber) {
    const key = getElementKey(nextFiber.instance);

    if (!isEmpty(key)) {
      keys.push(key);
    }

    nextFiber = nextFiber.sibling;
  }

  return keys;
}

function getDiffKeys(keys: Array<number | string>, nextKeys: Array<number | string>) {
  const nextKeysMap = nextKeys.reduce((acc, key) => (acc[key] = true, acc), {});
  const diff = [];

  for (const key of keys) {
    if (!nextKeysMap[key]) {
      diff.push(key);
    }
  }

  return diff;
}

function getElementKey(element: ComponentFactory | VirtualNode): ElementKey | null {
  return detectIsComponentFactory(element)
    ? getComponentFactoryKey(element)
    : detectIsTagVirtualNode(element)
      ? getVirtualNodeKey(element)
      : null;
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
