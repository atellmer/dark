import type { Fiber } from '../fiber';

let rootId: number = null;

const stores = new Map<number, Store>();

class Store {
  public wipRoot: Fiber = null;
  public currentRoot: Fiber = null;
  public nextUnitOfWork: Fiber = null;
  public events: Map<string, WeakMap<object, Function>> = new Map();
  public unsubscribers: Array<() => void> = [];
  public candidates: Set<Fiber> = new Set();
  public deletions: Set<Fiber> = new Set();
  public fiberMount: FiberMountStore = {
    level: 0,
    navigation: {},
    isDeepWalking: true,
  };
  public componentFiber: Fiber = null;
  public effects: Array<() => void> = [];
  public layoutEffects: Array<() => void> = [];
  public insertionEffects: Array<() => void> = [];
  public isLayoutEffectsZone = false;
  public isInserionEffectsZone = false;
  public isUpdateHookZone = false;
  public isBatchZone = false;
  public isHydrateZone = false;
  public isHot = false;
  public lazy: Set<number> = new Set();
}

type FiberMountStore = {
  level: number;
  navigation: Record<number, number>;
  isDeepWalking: boolean;
};

const rootStore = {
  set: (id: number) => {
    rootId = id;
    !stores.get(rootId) && stores.set(rootId, new Store());
  },
  remove: (id: number) => stores.delete(id),
};

const getRootId = () => rootId;

const store = {
  get: (id: number = rootId) => stores.get(id),
};

const wipRootStore = {
  get: () => store.get()?.wipRoot || null,
  set: (fiber: Fiber) => (store.get().wipRoot = fiber),
};

const currentRootStore = {
  get: (id?: number) => store.get(id)?.currentRoot || null,
  set: (fiber: Fiber) => (store.get().currentRoot = fiber),
};

const nextUnitOfWorkStore = {
  get: () => store.get()?.nextUnitOfWork || null,
  set: (fiber: Fiber) => (store.get().nextUnitOfWork = fiber),
};

const currentFiberStore = {
  get: () => store.get()?.componentFiber,
  set: (fiber: Fiber) => (store.get().componentFiber = fiber),
};

const eventsStore = {
  get: () => store.get().events,
  addUnsubscriber: (fn: () => void) => store.get().unsubscribers.push(fn),
  unsubscribe: (id: number) => store.get(id).unsubscribers.forEach(fn => fn()),
};

const candidatesStore = {
  get: () => store.get().candidates,
  add: (fiber: Fiber) => store.get().candidates.add(fiber),
  reset: () => (store.get().candidates = new Set()),
};

const deletionsStore = {
  get: () => store.get().deletions,
  add: (fiber: Fiber) => store.get().deletions.add(fiber),
  has: (fiber: Fiber) => store.get().deletions.has(fiber),
  set: (deletions: Set<Fiber>) => (store.get().deletions = deletions),
  reset: () => (store.get().deletions = new Set()),
};

const fiberMountStore = {
  reset: () => {
    store.get().fiberMount = {
      level: 0,
      navigation: {},
      isDeepWalking: true,
    };
  },
  getIndex: () => store.get().fiberMount.navigation[store.get().fiberMount.level],
  jumpToChild: () => {
    const { fiberMount } = store.get();
    const level = fiberMount.level;
    const nextLevel = level + 1;

    fiberMount.level = nextLevel;
    fiberMount.navigation[nextLevel] = 0;
  },
  jumpToParent: () => {
    const { fiberMount } = store.get();
    const level = fiberMount.level;
    const nextLevel = level - 1;

    fiberMount.navigation[level] = 0;
    fiberMount.level = nextLevel;
  },
  jumpToSibling: () => {
    const { fiberMount } = store.get();
    const level = fiberMount.level;
    const idx = fiberMount.navigation[level] + 1;

    fiberMount.navigation[level] = idx;
  },
  deepWalking: {
    get: () => store.get().fiberMount.isDeepWalking,
    set: (value: boolean) => (store.get().fiberMount.isDeepWalking = value),
  },
};

const effectsStore = {
  get: () => store.get().effects,
  reset: () => (store.get().effects = []),
  add: (effect: () => void) => store.get().effects.push(effect),
};

const layoutEffectsStore = {
  get: () => store.get().layoutEffects,
  reset: () => (store.get().layoutEffects = []),
  add: (effect: () => void) => store.get().layoutEffects.push(effect),
};

const insertionEffectsStore = {
  get: () => store.get().insertionEffects,
  reset: () => (store.get().insertionEffects = []),
  add: (effect: () => void) => store.get().insertionEffects.push(effect),
};

const isLayoutEffectsZone = {
  get: () => store.get()?.isLayoutEffectsZone || false,
  set: (value: boolean) => (store.get().isLayoutEffectsZone = value),
};

const isInsertionEffectsZone = {
  get: (id?: number) => store.get(id)?.isInserionEffectsZone || false,
  set: (value: boolean) => (store.get().isInserionEffectsZone = value),
};

const isUpdateHookZone = {
  get: () => store.get()?.isUpdateHookZone || false,
  set: (value: boolean) => (store.get().isUpdateHookZone = value),
};

const isBatchZone = {
  get: () => store.get()?.isBatchZone || false,
  set: (value: boolean) => (store.get().isBatchZone = value),
};

const isHydrateZone = {
  get: () => store.get()?.isHydrateZone || false,
  set: (value: boolean) => (store.get().isHydrateZone = value),
};

const hot = {
  get: () => store.get()?.isHot || false,
  set: (value: boolean) => (store.get().isHot = value),
};

const registerLazy = () => {
  const { id } = currentFiberStore.get();

  store.get().lazy.add(id);

  return id;
};

const unregisterLazy = (id: number) => store.get().lazy.delete(id);

const detectHasRegisteredLazy = () => store.get().lazy.size > 0;

export {
  getRootId,
  rootStore,
  wipRootStore,
  currentRootStore,
  nextUnitOfWorkStore,
  currentFiberStore,
  eventsStore,
  candidatesStore,
  deletionsStore,
  fiberMountStore,
  effectsStore,
  layoutEffectsStore,
  insertionEffectsStore,
  isLayoutEffectsZone,
  isInsertionEffectsZone,
  isUpdateHookZone,
  isBatchZone,
  isHydrateZone,
  hot,
  registerLazy,
  unregisterLazy,
  detectHasRegisteredLazy,
};
