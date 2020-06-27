import { Fiber } from '../fiber';


class Store {
  public wipRoot: Fiber = null;
  public currentRoot: Fiber = null;
  public nextUnitOfWork: Fiber = null;
  public currentMountedFiber: Fiber = null;
  public events: Map<string, WeakMap<object, Function>> = new Map();
  public deletions: Array<Fiber> = [];
  public isCommitPhase: boolean = false;
  public isForceUpdatePhase: boolean = false;
  public isViewportUpdatePhase: boolean = true;
  public lastUpdateFn: () => void = null;
  public updateTimerId: number = null;
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

const commitPhaseHelper = {
  get: () => storeHelper.get().isCommitPhase,
  set: (isCommitPhase: boolean) => storeHelper.get().isCommitPhase = isCommitPhase,
};

const forceUpdatePhaseHelper = {
  get: () => storeHelper.get()?.isForceUpdatePhase || null,
  set: (isForceUpdatePhase: boolean) => (storeHelper.get().isForceUpdatePhase = isForceUpdatePhase),
};

const viewportUpdatePhaseHelper = {
  get: () => storeHelper.get()?.isViewportUpdatePhase || null,
  set: (isViewportUpdatePhase: boolean) => (storeHelper.get().isViewportUpdatePhase = isViewportUpdatePhase),
};

const lastUpdateFnHelper = {
  get: () => storeHelper.get()?.lastUpdateFn || null,
  set: (lastUpdateFn: () => void) => (storeHelper.get().lastUpdateFn = lastUpdateFn),
};

const updateTimerIdHelper = {
  get: () => storeHelper.get()?.updateTimerId || null,
  set: (updateTimerId: number) => (storeHelper.get().updateTimerId = updateTimerId),
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
  commitPhaseHelper,
  forceUpdatePhaseHelper,
  viewportUpdatePhaseHelper,
  lastUpdateFnHelper,
  updateTimerIdHelper,
};
