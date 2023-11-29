import { type RestoreOptions, platform, detectIsServer } from '../platform';
import { RESTART_TIMEOUT, Flag } from '../constants';
import {
  flatten,
  error,
  detectIsEmpty,
  detectIsFalsy,
  detectIsArray,
  detectIsFunction,
  detectIsTextBased,
  createIndexKey,
  trueFn,
} from '../helpers';
import { type Scope, setRootId, scope$$, replaceScope } from '../scope';
import { Fiber, EffectTag, Mask, getHook, Hook } from '../fiber';
import type { DarkElementKey as Key, DarkElementInstance } from '../shared';
import { type Component, detectIsComponent } from '../component';
import {
  Text,
  detectIsVirtualNode,
  detectIsVirtualNodeFactory,
  getElementKey,
  hasElementFlag,
  hasChildrenProp,
  detectIsReplacer,
  createReplacer,
  detectAreSameInstanceTypes,
} from '../view';
import { detectIsMemo } from '../memo/utils';
import { detectIsLazy, detectIsLoaded } from '../lazy/utils';
import {
  walk,
  getFiberWithElement,
  detectIsFiberAlive,
  notifyParents,
  tryOptStaticSlot,
  tryOptMemoSlot,
} from '../walk';
import { unmountFiber } from '../unmount';
import { Fragment, detectIsFragment } from '../fragment';

let hasRenderError = false;

export type WorkLoop = (isAsync: boolean) => boolean;

function workLoop(isAsync: boolean) {
  if (hasRenderError) return false;
  const scope$ = scope$$();
  const wipFiber = scope$.getWorkInProgress();
  let unit = scope$.getNextUnitOfWork();
  let shouldYield = false;
  let hasMoreWork = Boolean(unit);

  try {
    while (unit && !shouldYield) {
      unit = performUnitOfWork(unit, scope$);
      scope$.setNextUnitOfWork(unit);
      hasMoreWork = Boolean(unit);
      shouldYield = isAsync && platform.shouldYield();
      if (platform.hasPrimaryTask()) return fork(scope$);
    }

    if (!unit && wipFiber) {
      commit(scope$);
    }
  } catch (err) {
    if (err instanceof StopWork) {
      !isAsync && setTimeout(() => workLoop(false), RESTART_TIMEOUT);
    } else {
      hasRenderError = true;
      throw err;
    }
  }

  return hasMoreWork;
}

function performUnitOfWork(fiber: Fiber, scope$: Scope): Fiber | null {
  const wipFiber = scope$.getWorkInProgress();
  const isDeepWalking = scope$.getMountDeep();
  const isStream = scope$.getIsStreamZone();
  const hasChildren = isDeepWalking && hasChildrenProp(fiber.inst) && fiber.inst.children.length > 0;

  fiber.hook && (fiber.hook.idx = 0);

  if (hasChildren) {
    const child = mountChild(fiber, scope$);

    isStream && platform.chunk(child);

    return child;
  } else {
    while (fiber.parent && fiber !== wipFiber) {
      const next = mountSibling(fiber, scope$);

      isStream && platform.chunk(fiber);

      if (next) {
        isStream && platform.chunk(next);
        return next;
      }

      scope$.removeActionMap(fiber.id);
      fiber = fiber.parent;
    }
  }

  return null;
}

function mountChild(parent: Fiber, scope$: Scope) {
  scope$.navToChild();
  const inst$ = parent.inst;
  const idx = 0;
  const inst = hasChildrenProp(inst$) ? inst$.children[idx] : null;
  const alt = getAlternate(parent, inst, true, scope$);
  const fiber = createFiber(alt, inst, idx);

  fiber.parent = parent;
  parent.child = fiber;
  fiber.eidx = parent.element ? 0 : parent.eidx;

  share(fiber, inst, scope$);

  return fiber;
}

function mountSibling(left: Fiber, scope$: Scope) {
  scope$.navToSibling();
  const inst$ = left.parent.inst;
  const idx = scope$.getMountIndex();
  const inst = hasChildrenProp(inst$) && inst$.children ? inst$.children[idx] : null;
  const hasSibling = Boolean(inst);

  if (!hasSibling) {
    scope$.navToParent();
    scope$.setMountDeep(false);

    return null;
  }

  scope$.setMountDeep(true);
  const alt = getAlternate(left, inst, false, scope$);
  const fiber = createFiber(alt, inst, idx);

  fiber.parent = left.parent;
  left.next = fiber;
  fiber.eidx = left.eidx + (left.element ? 1 : left.cec);

  share(fiber, inst, scope$);

  return fiber;
}

function share(fiber: Fiber, inst: DarkElementInstance, scope$: Scope) {
  const { alt } = fiber;
  const shouldMount = alt && detectIsMemo(inst) ? shouldUpdate(fiber, inst, scope$) : true;

  scope$.setCursorFiber(fiber);
  scope$.addCandidate(fiber);
  fiber.inst = inst;

  if (alt && alt.mask & Mask.MOVE) {
    fiber.mask |= Mask.MOVE;
    alt.mask &= ~Mask.MOVE;
  }

  fiber.hook && (fiber.hook.owner = fiber); // !

  if (shouldMount) {
    fiber.inst = mount(fiber, scope$);
    alt && reconcile(fiber, alt, scope$);
    setup(fiber, alt);
  } else if (fiber.mask & Mask.MOVE) {
    fiber.tag = EffectTag.U;
  }
}

function createFiber(alt: Fiber, inst: DarkElementInstance, idx: number) {
  const fiber = new Fiber(getHook(alt, alt ? alt.inst : null, inst), alt ? alt.provider : null, idx);

  fiber.alt = alt || null;

  return fiber;
}

function getAlternate(fiber: Fiber, inst: DarkElementInstance, fromChild: boolean, scope$: Scope) {
  const key = getElementKey(inst);

  if (key !== null) {
    const parentId = fromChild ? fiber.id : fiber.parent.id;
    const actions = scope$.getActionsById(parentId);

    if (actions) {
      const isMove = actions.move && Boolean(actions.move[key]);
      const isStable = actions.stable && Boolean(actions.stable[key]);

      if (isMove || isStable) {
        const alt = actions.map[key];

        isMove && (alt.mask |= Mask.MOVE);

        return alt;
      }

      return null;
    }
  }

  const alt = fiber.alt ? (fromChild ? fiber.alt.child || null : fiber.alt.next || null) : null;

  return alt;
}

function reconcile(fiber: Fiber, alt: Fiber, scope$: Scope) {
  const { id, inst } = fiber;
  const areSameTypes = detectAreSameInstanceTypes(alt.inst, inst);

  if (!areSameTypes) {
    scope$.addDeletion(alt);
  } else if (hasChildrenProp(alt.inst) && hasChildrenProp(inst) && alt.cc !== 0) {
    const hasSameCount = alt.cc === inst.children.length;
    const check = hasElementFlag(inst, Flag.SKIP_SCAN_OPT) ? !hasSameCount : true;

    if (check) {
      const { prevKeys, nextKeys, prevKeysMap, nextKeysMap, keyedFibersMap } = extractKeys(alt.child, inst.children);
      const flush = nextKeys.length === 0;
      let size = Math.max(prevKeys.length, nextKeys.length);
      let p = 0;
      let n = 0;

      scope$.addActionMap(id, keyedFibersMap);

      for (let i = 0; i < size; i++) {
        const nextKey = nextKeys[i - n] ?? null;
        const prevKey = prevKeys[i - p] ?? null;
        const prevKeyFiber = keyedFibersMap[prevKey] || null;

        if (nextKey !== prevKey) {
          if (nextKey !== null && !prevKeysMap[nextKey]) {
            if (prevKey !== null && !nextKeysMap[prevKey]) {
              scope$.addReplaceAction(id, nextKey);
              scope$.addDeletion(prevKeyFiber);
            } else {
              scope$.addInsertAction(id, nextKey);
              p++;
              size++;
            }
          } else if (!nextKeysMap[prevKey]) {
            scope$.addRemoveAction(id, prevKey);
            scope$.addDeletion(prevKeyFiber);
            flush && (prevKeyFiber.mask |= Mask.FLUSH);
            n++;
            size++;
          } else if (nextKeysMap[prevKey] && nextKeysMap[nextKey]) {
            scope$.addMoveAction(id, nextKey);
          }
        } else if (nextKey !== null) {
          scope$.addStableAction(id, nextKey);
        }
      }

      hasElementFlag(inst, Flag.STATIC_SLOT_OPT) && tryOptStaticSlot(fiber, alt, scope$);
      hasElementFlag(inst, Flag.MEMO_SLOT_OPT) && tryOptMemoSlot(fiber, alt, scope$);
    }
  }
}

function setup(fiber: Fiber, alt: Fiber) {
  const inst = fiber.inst;
  let isUpdate = false;

  fiber.parent.tag === EffectTag.C && (fiber.tag = fiber.parent.tag);
  fiber.parent.mask & Mask.SHADOW && !fiber.parent.element && !detectIsReplacer(inst) && (fiber.mask |= Mask.SHADOW);
  isUpdate =
    alt &&
    fiber.tag !== EffectTag.C &&
    detectAreSameInstanceTypes(alt.inst, inst) &&
    getElementKey(alt.inst) === getElementKey(inst);
  isUpdate && !fiber.element && alt.element && (fiber.element = alt.element);
  fiber.tag = isUpdate ? EffectTag.U : EffectTag.C;
  hasChildrenProp(fiber.inst) && (fiber.cc = fiber.inst.children.length);
  !fiber.element && detectIsVirtualNode(fiber.inst) && (fiber.element = platform.createElement(fiber.inst));
  fiber.element && fiber.incChildElementCount();
}

function shouldUpdate(fiber: Fiber, inst: DarkElementInstance, scope$: Scope) {
  if (process.env.NODE_ENV !== 'production') {
    if (scope$.getIsHot()) return true;
  }

  const alt = fiber.alt;
  const pc = alt.inst as Component;
  const nc = inst as Component;

  if (nc.type !== pc.type || nc.shouldUpdate(pc.props, nc.props)) return true;

  scope$.setMountDeep(false);
  fiber.tag = EffectTag.S;
  fiber.child = alt.child;
  fiber.child.parent = fiber;
  fiber.hook = alt.hook;
  fiber.cc = alt.cc;
  fiber.cec = alt.cec;
  alt.element && (fiber.element = alt.element);
  alt.provider && (fiber.provider = alt.provider);
  alt.catch && (fiber.catch = alt.catch);
  alt.atoms && (fiber.atoms = alt.atoms);

  const diff = fiber.eidx - alt.eidx;
  const deep = diff !== 0;

  if (deep) {
    walk(fiber.child, (fiber$, skip) => {
      fiber$.eidx += diff;
      if (fiber$.element) return skip();
    });
  }

  notifyParents(fiber, alt);

  return false;
}

function mount(fiber: Fiber, scope$: Scope) {
  let inst = fiber.inst;
  const isComponent = detectIsComponent(inst);
  const component = inst as Component;

  if (isComponent) {
    try {
      let result = component.type(component.props, component.ref);

      if (detectIsLazy(component) && !detectIsLoaded(component) && (scope$.getIsHydrateZone() || detectIsServer())) {
        scope$.navToParent();
        scope$.setNextUnitOfWork(fiber.parent);
        Fiber.setNextId(fiber.parent.id);
        throw new StopWork();
      }

      if (detectIsArray(result)) {
        !detectIsFragment(component) && (result = Fragment({ slot: result }));
      } else if (detectIsTextBased(result)) {
        result = Text(result);
      }

      component.children = result as Array<DarkElementInstance>;
      platform.detectIsPortal(inst) && fiber.markPortalHost();
    } catch (err) {
      if (err instanceof StopWork) {
        throw err;
      }

      component.children = [];
      fiber.setError(err);
      error(err);
    }
  } else if (detectIsVirtualNodeFactory(inst)) {
    inst = inst();
  }

  if (hasChildrenProp(inst)) {
    inst.children = flatten(inst.children, x => (detectIsTextBased(x) ? Text(x) : x || supportConditional(x)));
    isComponent && component.children.length === 0 && component.children.push(createReplacer());
  }

  return inst;
}

function extractKeys(alt: Fiber, children: Array<DarkElementInstance>) {
  let nextFiber = alt;
  let idx = 0;
  const prevKeys: Array<Key> = [];
  const nextKeys: Array<Key> = [];
  const prevKeysMap: Record<Key, boolean> = {};
  const nextKeysMap: Record<Key, boolean> = {};
  const keyedFibersMap: Record<Key, Fiber> = {};
  const usedKeysMap: Record<Key, boolean> = {};

  while (nextFiber || idx < children.length) {
    if (nextFiber) {
      const key = getElementKey(nextFiber.inst);
      const prevKey = detectIsEmpty(key) ? createIndexKey(idx) : key;

      if (!prevKeysMap[prevKey]) {
        prevKeysMap[prevKey] = true; // !
        prevKeys.push(prevKey);
      }

      keyedFibersMap[prevKey] = nextFiber;
    }

    if (children[idx]) {
      const inst = children[idx];
      const key = getElementKey(inst);
      const nextKey = detectIsEmpty(key) ? createIndexKey(idx) : key;

      if (process.env.NODE_ENV !== 'production') {
        if (usedKeysMap[nextKey]) {
          error(`[Dark]: The key of node [${nextKey}] already has been used!`, [inst]);
        }
      }

      if (!nextKeysMap[nextKey]) {
        nextKeysMap[nextKey] = true; // !
        nextKeys.push(nextKey);
      }

      usedKeysMap[nextKey] = true;
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

function supportConditional(inst: DarkElementInstance) {
  return detectIsFalsy(inst) ? createReplacer() : inst;
}

function commit(scope$: Scope) {
  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_ENV === 'development' && scope$.setIsHot(false);
  }

  const wipFiber = scope$.getWorkInProgress();
  const deletions = scope$.getDeletions();
  const candidates = scope$.getCandidates();
  const isUpdateZone = scope$.getIsUpdateZone();
  const unmounts: Array<Fiber> = [];
  const combinedMask = Mask.INSERTION_EFFECT_HOST | Mask.LAYOUT_EFFECT_HOST | Mask.ASYNC_EFFECT_HOST | Mask.PORTAL_HOST;

  // !
  for (const fiber of deletions) {
    const withNextTick = fiber.mask & Mask.ATOM_HOST && !(fiber.mask & combinedMask);

    withNextTick ? unmounts.push(fiber) : unmountFiber(fiber);
    fiber.tag = EffectTag.D;
    platform.commit(fiber);
  }

  isUpdateZone && sync(wipFiber);
  scope$.runInsertionEffects();

  for (const fiber of candidates) {
    fiber.tag !== EffectTag.S && platform.commit(fiber);
    fiber.alt = null;
    hasChildrenProp(fiber.inst) && (fiber.inst.children = null);
  }

  wipFiber.alt = null;
  platform.finishCommit(); // !
  scope$.runLayoutEffects();
  scope$.runAsyncEffects();
  unmounts.length > 0 && setTimeout(() => unmounts.forEach(x => unmountFiber(x)));
  flush(scope$);
}

function flush(scope$: Scope, cancel = false) {
  scope$.flush();
  !cancel && scope$.getEmitter().emit('finish');
}

function sync(fiber: Fiber) {
  const diff = fiber.cec - fiber.alt.cec;
  if (diff === 0) return;
  const parentFiber = getFiberWithElement(fiber.parent);
  let isRight = false;

  fiber.incChildElementCount(diff, true);

  walk(parentFiber.child, (fiber$, skip) => {
    if (fiber$ === fiber) {
      isRight = true;
      return skip();
    }

    fiber$.element && skip();
    isRight && (fiber$.eidx += diff);
  });
}

function fork(scope$: Scope): false {
  const scope$$$ = scope$.copy();
  const wipFiber = scope$.getWorkInProgress();
  const child = wipFiber.child;

  child && (child.parent = null);

  const restore = (options: RestoreOptions) => {
    const { fiber: wipFiber, setValue, resetValue } = options;
    const scope$ = scope$$();

    detectIsFunction(setValue) && setValue();
    detectIsFunction(resetValue) && scope$$$.addCancel(resetValue);

    wipFiber.alt = new Fiber().mutate(wipFiber);
    wipFiber.tag = EffectTag.U;
    wipFiber.child = child;
    child && (child.parent = wipFiber);

    if (process.env.NODE_ENV !== 'production') {
      wipFiber.marker = '✌️';
    }

    scope$$$.setRoot(scope$.getRoot());
    scope$$$.setWorkInProgress(wipFiber);
    replaceScope(scope$$$);
  };

  wipFiber.child = wipFiber.alt.child;
  wipFiber.alt = null;
  scope$.applyCancels();
  flush(scope$, true);
  platform.cancelTask(restore);

  return false;
}

export type CreateUpdateOptions = {
  rootId: number;
  isTransition?: boolean;
  hook: Hook;
  createChanger?: () => UpdateChanger;
};

export type UpdateChanger = {
  shouldUpdate: () => boolean;
} & Pick<RestoreOptions, 'setValue' | 'resetValue'>;

function createUpdate(options: CreateUpdateOptions) {
  const { rootId, hook, isTransition, createChanger = createChanger$ } = options;
  const callback = (restore?: (options: RestoreOptions) => void) => {
    setRootId(rootId); // !
    const fromRestore = detectIsFunction(restore);
    const { shouldUpdate, setValue, resetValue } = createChanger();
    const scope$ = scope$$();
    const owner = hook.owner;
    const fiber = owner.alt || owner;

    if (!shouldUpdate() || !detectIsFiberAlive(fiber) || fromRestore) {
      fromRestore && restore({ fiber, setValue, resetValue });
      return;
    }

    detectIsFunction(setValue) && setValue();
    detectIsFunction(resetValue) && isTransition && scope$.addCancel(resetValue);

    fiber.alt = new Fiber().mutate(fiber);
    fiber.tag = EffectTag.U;
    fiber.cc = 0;
    fiber.cec = 0;
    fiber.child = null;

    if (process.env.NODE_ENV !== 'production') {
      fiber.marker = '🔥';
    }

    scope$.setIsUpdateZone(true);
    scope$.resetMount();
    scope$.setWorkInProgress(fiber);
    scope$.setCursorFiber(fiber);
    fiber.inst = mount(fiber, scope$);
    scope$.setNextUnitOfWork(fiber);
  };

  return callback;
}

const createChanger$ = (): UpdateChanger => ({
  shouldUpdate: trueFn,
  setValue: null,
  resetValue: null,
});

const detectIsBusy = () => Boolean(scope$$()?.getWorkInProgress());

class StopWork extends Error {}

export { Fiber, workLoop, createUpdate, detectIsBusy };
