import { EffectTag, NativeElement, WorkLoopOptions } from './model';
import { ElementKey } from '../shared/model';
import {
  wipRootHelper,
  currentRootHelper,
  nextUnitOfWorkHelper,
  deletionsHelper,
  commitPhaseHelper,
} from '@core/scope';
import { platform } from '@core/global';
import {
  ComponentFactory,
  detectIsComponentFactory,
  getComponentFactoryKey,
} from '@core/component';
import { VirtualNode, detectIsTagVirtualNode, createEmptyVirtualNode, getVirtualNodeKey } from '../view';
import { flatten, isEmpty, error, isArray, keyBy, isFunction } from '@helpers';
import { Fragment } from '../fragment';
import { MAX_FIBERS_RENDERED_PER_FRAME, UNIQ_KEY_ERROR } from '../constants';


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

let lastUpdate = null;

const createFiber = (options: Partial<Fiber>): Fiber => new Fiber(options);

function updateRoot() {
  const update = () => {
    const alternate = currentRootHelper.get();
    const fiber = createFiber({
      link: alternate.link,
      instance: alternate.instance,
      alternate,
    });

    wipRootHelper.set(fiber);
    nextUnitOfWorkHelper.set(fiber);
  };

  commitPhaseHelper.get() ? (lastUpdate = update) : update();
}

function workLoop(options?: WorkLoopOptions) {
  const { deadline, onRender } = options;
  const wipRoot = wipRootHelper.get();
  let nextUnitOfWork = nextUnitOfWorkHelper.get();
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    nextUnitOfWorkHelper.set(nextUnitOfWork);
    shouldYield = deadline ? deadline.timeRemaining() < 1 : false;
  }

  if (!nextUnitOfWork && wipRoot && !commitPhaseHelper.get()) {
    commitRoot(onRender);
  }

  platform.ric(deadline => workLoop({ deadline, onRender }));
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
  let children: Array<VirtualNode | ComponentFactory> = [];
  const isList = isArray(fiber.instance);

  if (isList || detectIsComponentFactory(fiber.instance)) {
    const factory = isList
      ? Fragment({ slot: flatten([fiber.instance]) })
      : fiber.instance as ComponentFactory;

    fiber.instance = factory;
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
  let alternate: Fiber = wipFiber?.alternate?.child;
  let prevSibling: Fiber = null;
  const keys: Array<ElementKey> = alternate ? getAlternateKeys(alternate) : [];
  let nextKeys: Array<ElementKey> = [];
  let diff: Array<number> = [];
  let diffMap: Record<number, boolean> = {};
  let isOperationByKey = false;
  let isRemovingByKey = false;
  let isInsertingByKey = false;

  if (keys.length > 0) {
    nextKeys = elements.map(x => getElementKey(x));
    const isRemoving = nextKeys.length < keys.length;
    const isInserting = nextKeys.length > keys.length;
    diff = isRemoving
      ? getDiffKeys(keys, nextKeys)
      : isInserting
        ? getDiffKeys(nextKeys, keys)
        : [];
    diffMap = keyBy<number>(diff, x => x) as Record<number, boolean>;
    isOperationByKey = diff.length > 0;
    isRemovingByKey = isOperationByKey && isRemoving;
    isInsertingByKey = isOperationByKey && isInserting;
  }

  while (idx < elements.length || alternate) {
    let fiber: Fiber = null;
    const element = idx < elements.length
      ? elements[idx] || createEmptyVirtualNode()
      : null;
    const key = getElementKey(element);
    const hasDifferenceByKey = diffMap[key];

    if (!element) {
      const key = getElementKey(alternate.instance);

      if (isEmpty(key)) {
        error(UNIQ_KEY_ERROR);
      }
    }

    const type = element && (detectIsTagVirtualNode(element) ? element.name : element.type);
    const replacedAlternate = isRemovingByKey
      ? getAlternateByKey(getElementKey(element), alternate?.parent?.child) || alternate
      : isInsertingByKey
        ? hasDifferenceByKey
          ? null : alternate
        : alternate;
    const isUpdate = Boolean(replacedAlternate && element && replacedAlternate.type === type);

    if (isUpdate) {
      fiber = createFiber({
        type: replacedAlternate.type,
        instance: element,
        link: replacedAlternate.link,
        parent: wipFiber,
        alternate: replacedAlternate,
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

    if (alternate && !isUpdate && !(isInsertingByKey && hasDifferenceByKey)) {
      const [key] = diff;
      const alternateByKey = !isEmpty(key)
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

    if (alternate && !(isInsertingByKey && hasDifferenceByKey)) {
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

function commitRoot(onRender: () => void) {
  const wipRoot = wipRootHelper.get();

  commitPhaseHelper.set(true);
  console.log('wipRoot', wipRoot);
  commitWork(wipRoot.child, null, () => {
    deletionsHelper.get().forEach(fiber => platform.mutateTree(fiber));
    currentRootHelper.set(wipRoot);
    wipRootHelper.set(null);
    deletionsHelper.set([]);
    isFunction(onRender) && onRender();
    isFunction(lastUpdate) && lastUpdate();
    lastUpdate = null;
    commitPhaseHelper.set(false);
  });
}

function commitWork(fiber: Fiber, rootFiber: Fiber = null, onComplete: Function) {
  let nextFiber = fiber;
  let isDeepWalking = true;
  let fibersRendered = 0;

  rootFiber = rootFiber || fiber;

  while (nextFiber) {
    if (fibersRendered >= MAX_FIBERS_RENDERED_PER_FRAME && isDeepWalking) {
      platform.raf(() => commitWork(nextFiber, rootFiber, onComplete));
      return;
    }

    platform.mutateTree(nextFiber);

    if (nextFiber.child && isDeepWalking) {
      nextFiber = nextFiber.child;
    } else if (nextFiber.sibling) {
      isDeepWalking = true;
      nextFiber = nextFiber.sibling;
    } else if (nextFiber.parent && nextFiber.parent !== rootFiber.parent) {
      isDeepWalking = false;
      nextFiber = nextFiber.parent;
    } else {
      nextFiber = null;
    }

    fibersRendered++;
  }

  if (!nextFiber) {
    onComplete();
  }
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

export {
  Fiber,
  createFiber,
  workLoop,
  updateRoot,
};
