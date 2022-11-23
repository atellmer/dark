import type { Fiber } from '../fiber';

let rootId: number = null;

const stores = new Map<number, Store>();

class Store {
  public wipRoot: Fiber = null;
  public currentRoot: Fiber = null;
  public nextUnitOfWork: Fiber = null;
  public events: Map<string, WeakMap<object, Function>> = new Map();
  public unsubscribers: Array<() => void> = [];
  public deletions: Array<Fiber> = [];
  public fiberMount: FiberMountStore = {
    level: 0,
    navigation: {},
    isDeepWalking: true,
  };
  public componentFiber: Fiber = null;
  public effects: Array<() => void> = [];
  public layoutEffects: Array<() => void> = [];
  public isLayoutEffectsZone = false;
  public isUpdateHookZone = false;
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

const deletionsStore = {
  get: () => store.get().deletions,
  set: (deletions: Array<Fiber>) => (store.get().deletions = deletions),
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

const isLayoutEffectsZone = {
  get: () => store.get()?.isLayoutEffectsZone || false,
  set: (value: boolean) => (store.get().isLayoutEffectsZone = value),
};

const isUpdateHookZone = {
  get: () => store.get()?.isUpdateHookZone || false,
  set: (value: boolean) => (store.get().isUpdateHookZone = value),
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
  isLayoutEffectsZone,
  isUpdateHookZone,
};
