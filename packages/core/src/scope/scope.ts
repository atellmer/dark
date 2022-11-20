import type { Fiber } from '../fiber';

class Store {
  public wipRoot: Fiber = null;
  public currentRoot: Fiber = null;
  public nextUnitOfWork: Fiber = null;
  public fromHookUpdate = false;
  public events: Map<string, WeakMap<object, Function>> = new Map();
  public unsubscribers: Array<() => void> = [];
  public deletions: Array<Fiber> = [];
  public fiberMount = {
    level: 0,
    navigation: {},
    isDeepWalking: true,
  };
  public componentFiber: Fiber = null;
  public effects: Array<() => void> = [];
  public layoutEffects: Array<() => void> = [];
}

let rootId = null;
const stores = new Map<number, Store>();

const effectStoreHelper = {
  set: (id: number) => effectStore(id),
  remove: (id: number) => stores.delete(id),
};

const getRootId = (): number => rootId;

const effectStore = (id: number) => {
  rootId = id;
  !stores.get(rootId) && stores.set(rootId, new Store());
};

const storeHelper = {
  get: (id: number = rootId) => stores.get(id),
};

const wipRootHelper = {
  get: () => storeHelper.get()?.wipRoot || null,
  set: (fiber: Fiber) => (storeHelper.get().wipRoot = fiber),
};

const currentRootHelper = {
  get: (id?: number) => storeHelper.get(id)?.currentRoot || null,
  set: (fiber: Fiber) => (storeHelper.get().currentRoot = fiber),
};

const nextUnitOfWorkHelper = {
  get: () => storeHelper.get()?.nextUnitOfWork || null,
  set: (fiber: Fiber) => (storeHelper.get().nextUnitOfWork = fiber),
};

const componentFiberHelper = {
  get: () => storeHelper.get()?.componentFiber,
  set: (fiber: Fiber) => (storeHelper.get().componentFiber = fiber),
};

const fromHookUpdateHelper = {
  get: () => storeHelper.get()?.fromHookUpdate || false,
  set: (value: boolean) => (storeHelper.get().fromHookUpdate = value),
};

const eventsHelper = {
  get: () => storeHelper.get().events,
  addUnsubscriber: (fn: () => void) => storeHelper.get().unsubscribers.push(fn),
  mapUnsubscribers: (id: number) => storeHelper.get(id).unsubscribers.forEach(fn => fn()),
};

const deletionsHelper = {
  get: () => storeHelper.get().deletions,
  set: (deletions: Array<Fiber>) => (storeHelper.get().deletions = deletions),
};

const fiberMountHelper = {
  reset: () => {
    storeHelper.get().fiberMount = {
      level: 0,
      navigation: {},
      isDeepWalking: true,
    };
  },
  getIndex: () => storeHelper.get().fiberMount.navigation[storeHelper.get().fiberMount.level],
  jumpToChild: () => {
    const { fiberMount } = storeHelper.get();
    const level = fiberMount.level;
    const nextLevel = level + 1;

    fiberMount.level = nextLevel;
    fiberMount.navigation[nextLevel] = 0;
  },
  jumpToParent: () => {
    const { fiberMount } = storeHelper.get();
    const level = fiberMount.level;
    const nextLevel = level - 1;

    fiberMount.navigation[level] = 0;
    fiberMount.level = nextLevel;
  },
  jumpToSibling: () => {
    const { fiberMount } = storeHelper.get();
    const level = fiberMount.level;
    const idx = fiberMount.navigation[level] + 1;

    fiberMount.navigation[level] = idx;
  },
  deepWalking: {
    get: () => storeHelper.get().fiberMount.isDeepWalking,
    set: (value: boolean) => (storeHelper.get().fiberMount.isDeepWalking = value),
  },
};

const effectsHelper = {
  get: () => storeHelper.get().effects,
  reset: () => (storeHelper.get().effects = []),
  add: (effect: () => void) => storeHelper.get().effects.push(effect),
};

const layoutEffectsHelper = {
  get: () => storeHelper.get().layoutEffects,
  reset: () => (storeHelper.get().layoutEffects = []),
  add: (effect: () => void) => storeHelper.get().layoutEffects.push(effect),
};

export {
  getRootId,
  effectStoreHelper,
  wipRootHelper,
  currentRootHelper,
  nextUnitOfWorkHelper,
  componentFiberHelper,
  fromHookUpdateHelper,
  eventsHelper,
  deletionsHelper,
  fiberMountHelper,
  effectsHelper,
  layoutEffectsHelper,
};
