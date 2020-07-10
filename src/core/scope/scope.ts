import { Fiber } from '../fiber';


class Store {
  public wipRoot: Fiber = null;
  public currentRoot: Fiber = null;
  public nextUnitOfWork: Fiber = null;
  public currentMountedFiber: Fiber = null;
  public events: Map<string, WeakMap<object, Function>> = new Map();
  public deletions: Array<Fiber> = [];
  public fiberMount = {
    level: 0,
    navigation: {},
  };
}

let rootId = null;
const stores = new Map<number, Store>();

const effectStoreHelper = {
  set: (id: number) => effectStore(id),
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
  get: () => storeHelper.get()?.currentRoot || null,
  set: (fiber: Fiber) => (storeHelper.get().currentRoot = fiber),
};

const nextUnitOfWorkHelper = {
  get: () => storeHelper.get()?.nextUnitOfWork || null,
  set: (fiber: Fiber) => (storeHelper.get().nextUnitOfWork = fiber),
};

const currentMountedFiberHelper = {
  get: () => storeHelper.get()?.currentMountedFiber || null,
  set: (fiber: Fiber) => (storeHelper.get().currentMountedFiber = fiber),
};

const eventsHelper = {
  get: () => storeHelper.get().events,
};

const rootLinkHelper = {
  get: () => storeHelper.get().wipRoot.link,
};

const deletionsHelper = {
  get: () => storeHelper.get().deletions,
  set: (deletions: Array<Fiber>) => storeHelper.get().deletions = deletions,
};

const fiberMountHelper = {
  reset: () => {
    storeHelper.get().fiberMount = {
      level: 0,
      navigation: {},
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
};

export {
  getRootId,
  effectStoreHelper,
  wipRootHelper,
  currentRootHelper,
  nextUnitOfWorkHelper,
  currentMountedFiberHelper,
  eventsHelper,
  rootLinkHelper,
  deletionsHelper,
  fiberMountHelper,
};
