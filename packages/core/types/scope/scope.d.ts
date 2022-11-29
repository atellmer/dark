import type { Fiber } from '../fiber';
declare const rootStore: {
  set: (id: number) => void;
  remove: (id: number) => boolean;
};
declare const getRootId: () => number;
declare const wipRootStore: {
  get: () => Fiber<unknown>;
  set: (fiber: Fiber) => Fiber<unknown>;
};
declare const currentRootStore: {
  get: (id?: number) => Fiber<unknown>;
  set: (fiber: Fiber) => Fiber<unknown>;
};
declare const nextUnitOfWorkStore: {
  get: () => Fiber<unknown>;
  set: (fiber: Fiber) => Fiber<unknown>;
};
declare const currentFiberStore: {
  get: () => Fiber<unknown>;
  set: (fiber: Fiber) => Fiber<unknown>;
};
declare const eventsStore: {
  get: () => Map<string, WeakMap<object, Function>>;
  addUnsubscriber: (fn: () => void) => number;
  unsubscribe: (id: number) => void;
};
declare const deletionsStore: {
  get: () => Fiber<unknown>[];
  set: (deletions: Array<Fiber>) => Fiber<unknown>[];
};
declare const fiberMountStore: {
  reset: () => void;
  getIndex: () => number;
  jumpToChild: () => void;
  jumpToParent: () => void;
  jumpToSibling: () => void;
  deepWalking: {
    get: () => boolean;
    set: (value: boolean) => boolean;
  };
};
declare const effectsStore: {
  get: () => (() => void)[];
  reset: () => any[];
  add: (effect: () => void) => number;
};
declare const layoutEffectsStore: {
  get: () => (() => void)[];
  reset: () => any[];
  add: (effect: () => void) => number;
};
declare const insertionEffectsStore: {
  get: () => (() => void)[];
  reset: () => any[];
  add: (effect: () => void) => number;
};
declare const isLayoutEffectsZone: {
  get: () => boolean;
  set: (value: boolean) => boolean;
};
declare const isInsertionEffectsZone: {
  get: (id?: number) => boolean;
  set: (value: boolean) => boolean;
};
declare const isUpdateHookZone: {
  get: () => boolean;
  set: (value: boolean) => boolean;
};
declare const isBatchZone: {
  get: () => boolean;
  set: (value: boolean) => boolean;
};
export {
  getRootId,
  rootStore,
  wipRootStore,
  currentRootStore,
  nextUnitOfWorkStore,
  currentFiberStore,
  eventsStore,
  deletionsStore,
  fiberMountStore,
  effectsStore,
  layoutEffectsStore,
  insertionEffectsStore,
  isLayoutEffectsZone,
  isInsertionEffectsZone,
  isUpdateHookZone,
  isBatchZone,
};
