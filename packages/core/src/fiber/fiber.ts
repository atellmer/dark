import { platform } from '../platform';
import {
  flatten,
  error,
  detectIsEmpty,
  detectIsFalsy,
  detectIsArray,
  detectIsString,
  detectIsNumber,
  detectIsFunction,
} from '../helpers';
import {
  wipRootStore,
  currentRootStore,
  nextUnitOfWorkStore,
  candidatesStore,
  deletionsStore,
  mountStore,
  currentFiberStore,
  isUpdateHookZone,
  rootStore,
  effectsStore,
  layoutEffectsStore,
  insertionEffectsStore,
  isLayoutEffectsZone,
  isInsertionEffectsZone,
  detectHasRegisteredLazy,
  isHydrateZone,
  hot,
} from '../scope';
import { type Component, detectIsComponent, getComponentKey, getComponentFlag } from '../component';
import {
  type TagVirtualNode,
  detectIsVirtualNode,
  detectIsTagVirtualNode,
  detectIsVirtualNodeFactory,
  getTagVirtualNodeKey,
  getVirtualNodeFactoryKey,
  getTagVirtualNodeFlag,
  getVirtualNodeFactoryFlag,
  detectIsPlainVirtualNode,
  createReplacer,
} from '../view';
import { detectIsMemo } from '../memo';
import type { Context, ContextProviderValue } from '../context';
import type { DarkElementKey, DarkElement, DarkElementInstance } from '../shared';
import { INDEX_KEY, TYPE, Flag } from '../constants';
import { type NativeElement, type Hook, EffectTag } from './types';
import { hasEffects } from '../use-effect';
import { hasLayoutEffects } from '../use-layout-effect';
import { hasInsertionEffects } from '../use-insertion-effect';
import { walkFiber } from '../walk';
import { unmountFiber } from '../unmount';
import { Text } from '../view';
import { Fragment, detectIsFragment } from '../fragment';

class Fiber<N = NativeElement> {
  public id = 0;
  public cc = 0; // child fibers count
  public cec = 0; // child native elements count
  public idx = 0; // idx of fiber in the parent fiber
  public eidx = 0; // native element idx
  public element: N = null; // native element
  public parent: Fiber<N> = null; // parent fiber
  public child: Fiber<N> = null; // child fiber
  public next: Fiber<N> = null; // next sibling fiber
  public alt: Fiber<N> = null; // alternate fiber (previous)
  public move = false; // flag of reordering in list
  public tag: EffectTag = null; // effect tag (CREATE, UPDATE, DELETE, SKIP)
  public inst: DarkElementInstance = null; // instance of component or virtual node
  public hook: Hook | null = null; // hook
  public provider: Map<Context, ContextProviderValue> = null; // provider of context
  public efHost = false; // effect host
  public lefHost = false; // layout effect host
  public iefHost = false; // insertion effect host
  public pHost = false; // portal host
  public marker = ''; // for dev
  public used = false; // flag if fiber already been rendered
  public batch: number | NodeJS.Timeout | null = null; // timer for batching
  public flush = false; // flag for optimizing removing of all elements in parent fiber
  public catch: (error: Error) => void;
  private static nextId = 0;

  constructor(hook: Hook = null, provider: Fiber['provider'] = null, idx = 0) {
    this.id = ++Fiber.nextId;
    this.hook = hook;
    this.provider = provider;
    this.idx = idx;
  }

  public mutate(options: Partial<Fiber<N>>) {
    const keys = Object.keys(options);

    for (const key of keys) {
      this[key] = options[key];
    }

    return this;
  }

  public markEFHost() {
    this.efHost = true;
    this.parent && !this.parent.efHost && this.parent.markEFHost();
  }

  public markLEFHost() {
    this.lefHost = true;
    this.parent && !this.parent.lefHost && this.parent.markLEFHost();
  }

  public markIEFHost() {
    this.iefHost = true;
    this.parent && !this.parent.iefHost && this.parent.markIEFHost();
  }

  public markPHost() {
    this.pHost = true;
    this.parent && !this.parent.pHost && this.parent.markPHost();
  }

  public incCEC(count = 1, force = false) {
    incrementChildrenElementsCount(this, count, force);
  }

  public setError(error: Error) {
    if (detectIsFunction(this.catch)) {
      this.catch(error);
    } else if (this.parent) {
      this.parent.setError(error);
    }
  }
}

type Box = {
  fiber$$: Fiber;
  fiber$: Fiber;
  inst$: DarkElementInstance;
};

function workLoop() {
  const wipFiber = wipRootStore.get();
  let nextUnitOfWork = nextUnitOfWorkStore.get();
  let shouldYield = false;
  let hasMoreWork = Boolean(nextUnitOfWork);
  const box: Box = {
    fiber$$: null,
    fiber$: null,
    inst$: null,
  };

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork, box);
    nextUnitOfWorkStore.set(nextUnitOfWork);
    hasMoreWork = Boolean(nextUnitOfWork);
    shouldYield = platform.shouldYeild();
  }

  if (!nextUnitOfWork && wipFiber) {
    commitChanges();
  }

  return hasMoreWork;
}

function performUnitOfWork(fiber: Fiber, box: Box) {
  let isDeepWalking = true;
  let nextFiber = fiber;
  let instance = fiber.inst;

  while (true) {
    isDeepWalking = mountStore.deep.get();
    nextFiber.hook && (nextFiber.hook.idx = 0);

    if (isDeepWalking) {
      const hasChildren = hasChildrenProp(instance) && instance.children.length > 0;

      if (hasChildren) {
        performChild(nextFiber, box);

        nextFiber = box.fiber$;
        instance = box.inst$;

        box.fiber$$ = null;
        box.fiber$ = null;
        box.inst$ = null;

        if (nextFiber) return nextFiber;
      } else {
        performSibling(nextFiber, box);

        const nextFiber$ = box.fiber$$;

        nextFiber = box.fiber$;
        instance = box.inst$;

        box.fiber$$ = null;
        box.fiber$ = null;
        box.inst$ = null;

        if (nextFiber$) return nextFiber$;
      }
    } else {
      performSibling(nextFiber, box);

      const nextFiber$ = box.fiber$$;

      nextFiber = box.fiber$;
      instance = box.inst$;

      box.fiber$$ = null;
      box.fiber$ = null;
      box.inst$ = null;

      if (nextFiber$) return nextFiber$;
    }

    if (nextFiber.parent === null) return null;
  }
}

function performChild(nextFiber: Fiber, box: Box) {
  mountStore.toChild();
  let instance$ = nextFiber.inst;
  const childrenIdx = 0;
  const alternate = nextFiber.alt ? nextFiber.alt.child : null;
  const fiber = new Fiber(
    getHook(
      alternate,
      alternate ? alternate.inst : null,
      hasChildrenProp(instance$) ? instance$.children[childrenIdx] : null,
    ),
    alternate ? alternate.provider : null,
    childrenIdx,
  );

  currentFiberStore.set(fiber);
  fiber.parent = nextFiber;
  nextFiber.child = fiber;
  fiber.eidx = nextFiber.element ? 0 : nextFiber.eidx;
  instance$ = pertformInstance(instance$, childrenIdx, fiber);
  alternate && performAlternate(alternate, instance$);
  performFiber(fiber, alternate, instance$);
  alternate && detectIsMemo(fiber.inst) && performMemo(fiber);

  candidatesStore.add(fiber);

  box.fiber$$ = null;
  box.fiber$ = fiber;
  box.inst$ = instance$;
}

function performSibling(nextFiber: Fiber, box: Box) {
  mountStore.toSibling();
  let instance$ = nextFiber.parent.inst;
  const childrenIdx = mountStore.getIndex();
  const hasSibling = hasChildrenProp(instance$) && instance$.children[childrenIdx];

  if (hasSibling) {
    mountStore.deep.set(true);
    const alternate = nextFiber.alt ? nextFiber.alt.next : null;
    const fiber = new Fiber(
      getHook(
        alternate,
        alternate ? alternate.inst : null,
        hasChildrenProp(instance$) ? instance$.children[childrenIdx] : null,
      ),
      alternate ? alternate.provider : null,
      childrenIdx,
    );

    currentFiberStore.set(fiber);
    fiber.parent = nextFiber.parent;
    nextFiber.next = fiber;
    fiber.eidx = nextFiber.eidx + (nextFiber.element ? 1 : nextFiber.cec);
    instance$ = pertformInstance(instance$, childrenIdx, fiber);
    alternate && performAlternate(alternate, instance$);
    performFiber(fiber, alternate, instance$);
    alternate && detectIsMemo(fiber.inst) && performMemo(fiber);

    candidatesStore.add(fiber);

    box.fiber$$ = fiber;
    box.fiber$ = fiber;
    box.inst$ = instance$;

    return;
  } else {
    mountStore.toParent();
    mountStore.deep.set(false);
    nextFiber = nextFiber.parent;
    instance$ = nextFiber.inst;

    if (hasChildrenProp(nextFiber.inst)) {
      nextFiber.inst.children = [];
    }
  }

  box.fiber$$ = null;
  box.fiber$ = nextFiber;
  box.inst$ = instance$;
}

function incrementChildrenElementsCount(fiber: Fiber, count = 1, force = false) {
  if (!fiber.parent) return;
  const fromUpdate = isUpdateHookZone.get();
  const wipFiber = wipRootStore.get();
  const stop = fromUpdate && wipFiber.parent === fiber.parent;

  if (
    detectIsPlainVirtualNode(fiber.inst) ||
    (detectIsTagVirtualNode(fiber.inst) && fiber.inst.children.length === 0)
  ) {
    fiber.cec = 1;
  }

  if (fromUpdate && stop && !force) return;

  fiber.parent.cec += count;

  if (!fiber.parent.element) {
    fiber.parent.incCEC(count);
  }
}

function performFiber(fiber: Fiber, alternate: Fiber, instance: DarkElementInstance) {
  let isUpdate = false;

  fiber.parent.tag === EffectTag.C && (fiber.tag = fiber.parent.tag);

  if (fiber.tag !== EffectTag.C) {
    isUpdate =
      alternate &&
      detectAreSameInstanceTypes(alternate.inst, instance) &&
      (alternate ? getElementKey(alternate.inst) : null) === getElementKey(instance);
  }

  fiber.inst = instance;
  fiber.alt = alternate || null;
  fiber.element = fiber.element || (isUpdate ? alternate.element : null);
  fiber.tag = isUpdate ? EffectTag.U : EffectTag.C;

  if (alternate && alternate.move) {
    fiber.move = alternate.move;
    alternate.move = false;
  }

  if (hasChildrenProp(fiber.inst)) {
    fiber.cc = fiber.inst.children.length;
  }

  if (!fiber.element && detectIsVirtualNode(fiber.inst)) {
    fiber.element = platform.createElement(fiber.inst);
    fiber.tag = EffectTag.C;
  }

  fiber.element && fiber.incCEC();
}

function insertToFiber(idx: number, fiber: Fiber, child: Fiber) {
  if (idx === 0 || (fiber.child && fiber.child.tag === EffectTag.D)) {
    fiber.child = child;
    child.parent = fiber;
  } else {
    fiber.next = child;
    child.parent = fiber.parent;
  }

  return child;
}

function createConditionalFiber(alternate: Fiber, marker?: DarkElementKey) {
  return new Fiber().mutate({
    tag: EffectTag.C,
    inst: createReplacer(),
    parent: alternate,
    marker: marker + '',
  });
}

function canAddToDeletions(fiber: Fiber) {
  let nextFiber = fiber.parent;

  while (nextFiber) {
    if (nextFiber.tag === EffectTag.D) return false;
    nextFiber = nextFiber.parent;
  }

  return true;
}

function performAlternate(alternate: Fiber, instance: DarkElementInstance) {
  const areSameTypes = detectAreSameInstanceTypes(alternate.inst, instance);
  const flag = getElementFlag(instance);
  const hasNoMovesFlag = flag && flag[Flag.HNM];

  alternate.used = true;

  if (!areSameTypes) {
    if (canAddToDeletions(alternate)) {
      alternate.tag = EffectTag.D;
      deletionsStore.add(alternate);
    }
  } else if (
    hasChildrenProp(alternate.inst) &&
    hasChildrenProp(instance) &&
    alternate.cc !== 0 &&
    (hasNoMovesFlag ? alternate.cc !== instance.children.length : true)
  ) {
    const { prevKeys, nextKeys, prevKeysMap, nextKeysMap, keyedFibersMap } = extractKeys(
      alternate.child,
      instance.children,
    );
    const flush = nextKeys.length === 0;
    let result: Array<[DarkElement | [DarkElementKey, DarkElementKey], string]> = [];
    let size = Math.max(prevKeys.length, nextKeys.length);
    let nextFiber = alternate;
    let idx = 0;
    let p = 0;
    let n = 0;

    for (let i = 0; i < size; i++) {
      const nextKey = nextKeys[i - n] ?? null;
      const prevKey = prevKeys[i - p] ?? null;
      const prevKeyFiber = keyedFibersMap[prevKey] || null;
      const nextKeyFiber = keyedFibersMap[nextKey] || createConditionalFiber(alternate, nextKey);

      if (nextKey !== prevKey) {
        if (nextKey !== null && !prevKeysMap[nextKey]) {
          if (prevKey !== null && !nextKeysMap[prevKey]) {
            process.env.NODE_ENV !== 'production' && result.push([[nextKey, prevKey], 'replace']);
            nextKeyFiber.tag = EffectTag.C;
            prevKeyFiber.tag = EffectTag.D;
            deletionsStore.add(prevKeyFiber);
          } else {
            process.env.NODE_ENV !== 'production' && result.push([nextKey, 'insert']);
            nextKeyFiber.tag = EffectTag.C;
            p++;
            size++;
          }
          nextFiber = insertToFiber(i, nextFiber, nextKeyFiber);
        } else if (!nextKeysMap[prevKey]) {
          process.env.NODE_ENV !== 'production' && result.push([prevKey, 'remove']);
          prevKeyFiber.tag = EffectTag.D;
          deletionsStore.add(prevKeyFiber);
          flush && (prevKeyFiber.flush = true);
          n++;
          idx--;
          size++;
        } else if (nextKeysMap[prevKey] && nextKeysMap[nextKey]) {
          process.env.NODE_ENV !== 'production' && result.push([[nextKey, prevKey], 'move']);
          nextKeyFiber.tag = EffectTag.U;
          prevKeyFiber.tag = EffectTag.U;
          nextKeyFiber.move = true;
          nextFiber = insertToFiber(i, nextFiber, nextKeyFiber);
        }
      } else if (nextKey !== null) {
        process.env.NODE_ENV !== 'production' && result.push([nextKey, 'stable']);
        nextKeyFiber.tag = EffectTag.U;
        nextFiber = insertToFiber(i, nextFiber, nextKeyFiber);
      }

      nextKeyFiber.idx = idx;
      idx++;
    }

    result = [];
  }
}

function performMemo(fiber: Fiber) {
  if (process.env.NODE_ENV !== 'production') {
    if (hot.get()) return;
  }

  const alternate = fiber.alt;
  const prevComponent = alternate.inst as Component;
  const nextComponent = fiber.inst as Component;

  if (
    fiber.move ||
    nextComponent.type !== prevComponent.type ||
    nextComponent.su(prevComponent.props, nextComponent.props)
  )
    return;

  mountStore.deep.set(false);
  fiber.tag = EffectTag.S;
  fiber.alt = alternate;
  fiber.element = alternate.element;
  fiber.child = alternate.child;
  fiber.hook = alternate.hook;
  fiber.provider = alternate.provider;
  fiber.cc = alternate.cc;
  fiber.cec = alternate.cec;
  fiber.catch = alternate.catch;
  fiber.child && (fiber.child.parent = fiber);

  const diff = fiber.eidx - alternate.eidx;
  const deep = diff !== 0;

  if (deep) {
    walkFiber(fiber.child, (nextFiber, _, __, stop) => {
      if (nextFiber === fiber.next || nextFiber === fiber.parent) return stop();
      nextFiber.eidx += diff;
      if (nextFiber.parent !== fiber && nextFiber.element) return stop();
    });
  }

  fiber.incCEC(alternate.cec);
  alternate.efHost && fiber.markEFHost();
  alternate.lefHost && fiber.markLEFHost();
  alternate.iefHost && fiber.markIEFHost();
  alternate.pHost && fiber.markPHost();
}

function pertformInstance(instance: DarkElementInstance, idx: number, fiber: Fiber) {
  let instance$: DarkElementInstance = null;

  if (hasChildrenProp(instance)) {
    if (detectIsArray(instance.children[idx])) {
      instance.children.splice(idx, 1, ...flatten(instance.children[idx] as unknown as Array<DarkElementInstance>));
    }

    instance$ = mountInstance(fiber, instance.children[idx]);

    if (detectIsComponent(instance$)) {
      hasEffects(fiber) && fiber.markEFHost();
      hasLayoutEffects(fiber) && fiber.markLEFHost();
      hasInsertionEffects(fiber) && fiber.markIEFHost();
      platform.detectIsPortal(instance$) && fiber.markPHost();
    }
  }

  return instance$;
}

function mountInstance(fiber: Fiber, instance: DarkElementInstance) {
  let instance$ = instance;
  const isComponent = detectIsComponent(instance$);
  const component = instance$ as Component;

  if (isComponent) {
    try {
      let result = component.type(component.props, component.ref);

      if (detectIsArray(result) && !detectIsFragment(component)) {
        result = Fragment({ slot: result });
      } else if (detectIsString(result) || detectIsNumber(result)) {
        result = Text(result);
      }

      component.children = (detectIsArray(result) ? flatten(result) : [result]) as Array<DarkElementInstance>;
    } catch (err) {
      component.children = [];
      fiber.setError(err);
      error(err);
    }
  } else if (detectIsVirtualNodeFactory(instance$)) {
    instance$ = instance$();
  }

  if (hasChildrenProp(instance$)) {
    instance$.children = isComponent
      ? instance$.children
      : detectIsArray(instance$.children)
      ? flatten(instance$.children)
      : [instance$.children];

    for (let i = 0; i < instance$.children.length; i++) {
      if (instance$.children[i]) continue;
      instance$.children[i] = supportConditional(instance$.children[i]);
    }

    if (isComponent && component.children.length === 0) {
      component.children.push(createReplacer());
    }
  }

  return instance$;
}

function extractKeys(alternate: Fiber, children: Array<DarkElementInstance>) {
  let nextFiber = alternate;
  let idx = 0;
  const prevKeys: Array<DarkElementKey> = [];
  const nextKeys: Array<DarkElementKey> = [];
  const prevKeysMap: Record<DarkElementKey, boolean> = {};
  const nextKeysMap: Record<DarkElementKey, boolean> = {};
  const keyedFibersMap: Record<DarkElementKey, Fiber> = {};
  const usedKeysMap: Record<DarkElementKey, boolean> = {};

  while (nextFiber || idx < children.length) {
    if (nextFiber) {
      const key = getElementKey(nextFiber.inst);
      const prevKey = detectIsEmpty(key) ? createIndexKey(idx) : key;

      prevKeys.push(prevKey);
      prevKeysMap[prevKey] = true;
      keyedFibersMap[prevKey] = nextFiber;
    }

    if (children[idx]) {
      const instance = children[idx];
      const key = getElementKey(instance);
      const nextKey = detectIsEmpty(key) ? createIndexKey(idx) : key;

      if (process.env.NODE_ENV !== 'production') {
        if (usedKeysMap[nextKey]) {
          error(`[Dark]: The key of node [${nextKey}] already has been used!`, [instance]);
        }

        usedKeysMap[nextKey] = true;
      }

      nextKeys.push(nextKey);
      nextKeysMap[nextKey] = true;
    }

    nextFiber = nextFiber ? nextFiber.next : null;
    idx++;
  }

  return {
    prevKeys,
    nextKeys,
    prevKeysMap,
    nextKeysMap,
    keyedFibersMap,
  };
}

function createIndexKey(idx: number) {
  return `${INDEX_KEY}:${idx}`;
}

function getElementKey(instance: DarkElementInstance): DarkElementKey | null {
  const key = detectIsComponent(instance)
    ? getComponentKey(instance)
    : detectIsVirtualNodeFactory(instance)
    ? getVirtualNodeFactoryKey(instance)
    : detectIsTagVirtualNode(instance)
    ? getTagVirtualNodeKey(instance)
    : null;

  return key;
}

function getElementFlag(instance: DarkElementInstance): Record<Flag, boolean> | null {
  const flag = detectIsComponent(instance)
    ? getComponentFlag(instance)
    : detectIsVirtualNodeFactory(instance)
    ? getVirtualNodeFactoryFlag(instance)
    : detectIsTagVirtualNode(instance)
    ? getTagVirtualNodeFlag(instance)
    : null;

  return flag;
}

function supportConditional(instance: DarkElementInstance) {
  return detectIsFalsy(instance) ? createReplacer() : instance;
}

function getInstanceType(instance: DarkElementInstance): string | Function {
  return detectIsVirtualNodeFactory(instance)
    ? instance[TYPE]
    : detectIsTagVirtualNode(instance)
    ? instance.name
    : detectIsVirtualNode(instance)
    ? instance.type
    : detectIsComponent(instance)
    ? instance.type
    : null;
}

function hasChildrenProp(element: DarkElementInstance): element is TagVirtualNode | Component {
  return detectIsTagVirtualNode(element) || detectIsComponent(element);
}

function detectAreSameComponentTypesWithSameKeys(
  prevInstance: DarkElementInstance | null,
  nextInstance: DarkElementInstance | null,
) {
  if (
    prevInstance &&
    nextInstance &&
    detectIsComponent(prevInstance) &&
    detectIsComponent(nextInstance) &&
    detectAreSameInstanceTypes(prevInstance, nextInstance, true)
  ) {
    return getElementKey(prevInstance) === getElementKey(nextInstance);
  }

  return false;
}

function detectAreSameInstanceTypes(
  prevInstance: DarkElementInstance,
  nextInstance: DarkElementInstance,
  isComponentFactories = false,
) {
  if (process.env.NODE_ENV !== 'production') {
    if (process.env.NODE_ENV === 'development' && hot.get()) {
      if (detectIsComponent(prevInstance) && detectIsComponent(nextInstance)) {
        return prevInstance.dn === nextInstance.dn;
      }
    }
  }

  if (isComponentFactories) {
    const prevComponent = prevInstance as Component;
    const nextComponent = nextInstance as Component;

    return prevComponent.type === nextComponent.type;
  }

  return getInstanceType(prevInstance) === getInstanceType(nextInstance);
}

function getHook(alternate: Fiber, prevInstance: DarkElementInstance, nextInstance: DarkElementInstance): Hook | null {
  if (alternate && detectAreSameComponentTypesWithSameKeys(prevInstance, nextInstance)) return alternate.hook;
  if (detectIsComponent(nextInstance)) return createHook();

  return null;
}

function createHook(): Hook {
  return { idx: 0, values: [] };
}

function commitChanges() {
  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_ENV === 'development' && hot.set(false);
  }
  if (isHydrateZone.get() && detectHasRegisteredLazy()) return flush(null); // important order
  const wipFiber = wipRootStore.get();
  const isDynamic = platform.detectIsDynamic();
  const deletions = deletionsStore.get();
  const candidates = candidatesStore.get();
  const fromUpdate = isUpdateHookZone.get();

  // important order
  for (const fiber of deletions) {
    unmountFiber(fiber);
    platform.commit(fiber);
  }

  isDynamic && runInsertionEffects();
  fromUpdate && syncElementIndices(wipFiber);

  for (const fiber of candidates) {
    fiber.tag !== EffectTag.S && platform.commit(fiber);
    fiber.alt = null;
  }

  wipFiber.alt = null;
  platform.finishCommit();

  isDynamic && runLayoutEffects();
  isDynamic && runEffects();

  flush(wipFiber);
}

function runInsertionEffects() {
  isInsertionEffectsZone.set(true);
  insertionEffectsStore.get().forEach(fn => fn());
  isInsertionEffectsZone.set(false);
}

function runLayoutEffects() {
  isLayoutEffectsZone.set(true);
  layoutEffectsStore.get().forEach(fn => fn());
  isLayoutEffectsZone.set(false);
}

function runEffects() {
  const effects = effectsStore.get();

  effects.length > 0 && setTimeout(() => effects.forEach(fn => fn()));
}

function flush(wipFiber: Fiber) {
  wipRootStore.set(null); // important order
  candidatesStore.reset();
  deletionsStore.reset();
  insertionEffectsStore.reset();
  layoutEffectsStore.reset();
  effectsStore.reset();

  if (isUpdateHookZone.get()) {
    isUpdateHookZone.set(false);
  } else {
    currentRootStore.set(wipFiber);
  }
}

function getParentFiberWithNativeElement(fiber: Fiber) {
  let parentFiber = fiber;

  while (parentFiber) {
    parentFiber = parentFiber.parent;

    if (parentFiber && parentFiber.element) {
      break;
    }
  }

  return parentFiber;
}

function syncElementIndices(fiber: Fiber) {
  const diff = fiber.cec - fiber.alt.cec;
  if (diff === 0) return;
  const parentFiber = getParentFiberWithNativeElement(fiber);
  let isRight = false;

  fiber.incCEC(diff, true);

  walkFiber(parentFiber.child, (nextFiber, isReturn, resetIsDeepWalking, stop) => {
    if (nextFiber === parentFiber) return stop();
    if (nextFiber === fiber) {
      isRight = true;
      return resetIsDeepWalking();
    }

    if (nextFiber.element) {
      resetIsDeepWalking();
    }

    if (isRight && !isReturn) {
      nextFiber.eidx += diff;
    }
  });
}

type CreateUpdateCallbackOptions = {
  rootId: number;
  fiber: Fiber;
  forceStart?: boolean;
  onStart: () => void;
};

function createUpdateCallback(options: CreateUpdateCallbackOptions) {
  const { rootId, fiber, forceStart = false, onStart } = options;
  const callback = () => {
    if (fiber.tag === EffectTag.D) return;
    forceStart && onStart();
    if (fiber.used) return;
    !forceStart && onStart();
    rootStore.set(rootId); // important order!
    isUpdateHookZone.set(true);
    mountStore.reset();

    fiber.alt = new Fiber().mutate(fiber);
    fiber.marker = '🔥';
    fiber.tag = EffectTag.U;
    fiber.cec = 0;
    fiber.child = null;

    wipRootStore.set(fiber);
    currentFiberStore.set(fiber);
    fiber.inst = mountInstance(fiber, fiber.inst);
    nextUnitOfWorkStore.set(fiber);
  };

  return callback;
}

const detectIsBusy = () => Boolean(wipRootStore.get());

export { Fiber, workLoop, createUpdateCallback, detectIsBusy };
