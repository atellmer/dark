import { Fiber } from '../fiber';


class Store {
  public wipRoot: Fiber = null;
  public currentRoot: Fiber = null;
  public nextUnitOfWork: Fiber = null;
  public currentMountedFiber: Fiber = null;
  public events: Map<string, WeakMap<object, Function>> = new Map();
  public deletions: Array<Fiber> = [];
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
};
