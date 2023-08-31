import type { Fiber } from '../fiber';

let rootId: number = null;

const stores = new Map<number, Store>();

class Store {
  public root: Fiber = null; // root fiber for app
  public wip: Fiber = null; // root work-in-progress fiber (component)
  public unit: Fiber = null; // unit of work fiber (part of wip)
  public cur: Fiber = null; // current mounting fiber
  public events: Map<string, WeakMap<object, Function>> = new Map();
  public off: Array<() => void> = [];
  public candidates: Set<Fiber> = new Set();
  public deletions: Set<Fiber> = new Set();
  public mount: MountStore = {
    level: 0,
    nav: {},
    deep: true,
  };
  public effects: Array<() => void> = [];
  public lEffects: Array<() => void> = [];
  public iEffects: Array<() => void> = [];
  public isLEFZone = false;
  public isIEFZone = false;
  public uZone = false;
  public bZone = false;
  public hZone = false;
  public sZone = false;
  public tZone = false;
  public isHot = false;
}

type MountStore = {
  level: number;
  nav: Record<number, number>;
  deep: boolean;
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
  get: () => store.get()?.wip || null,
  set: (fiber: Fiber) => (store.get().wip = fiber),
};

const currentRootStore = {
  get: (id?: number) => store.get(id)?.root || null,
  set: (fiber: Fiber) => (store.get().root = fiber),
};

const nextUnitOfWorkStore = {
  get: () => store.get()?.unit || null,
  set: (fiber: Fiber) => (store.get().unit = fiber),
};

const currentFiberStore = {
  get: () => store.get()?.cur,
  set: (fiber: Fiber) => (store.get().cur = fiber),
};

const eventsStore = {
  get: () => store.get().events,
  addUnsubscriber: (fn: () => void) => store.get().off.push(fn),
  unsubscribe: (id: number) => store.get(id).off.forEach(fn => fn()),
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

const mountStore = {
  reset: () => {
    store.get().mount = {
      level: 0,
      nav: {},
      deep: true,
    };
  },
  getIndex: () => {
    const { mount } = store.get();

    return mount.nav[mount.level];
  },
  toChild: () => {
    const { mount } = store.get();

    mount.level = mount.level + 1;
    mount.nav[mount.level] = 0;
  },
  toParent: () => {
    const { mount } = store.get();

    mount.nav[mount.level] = 0;
    mount.level = mount.level - 1;
  },
  toSibling: () => {
    const { mount } = store.get();

    mount.nav[mount.level] = mount.nav[mount.level] + 1;
  },
  deep: {
    get: () => store.get().mount.deep,
    set: (value: boolean) => (store.get().mount.deep = value),
  },
};

const effectsStore = {
  get: () => store.get().effects,
  reset: () => (store.get().effects = []),
  add: (effect: () => void) => store.get().effects.push(effect),
};

const layoutEffectsStore = {
  get: () => store.get().lEffects,
  reset: () => (store.get().lEffects = []),
  add: (effect: () => void) => store.get().lEffects.push(effect),
};

const insertionEffectsStore = {
  get: () => store.get().iEffects,
  reset: () => (store.get().iEffects = []),
  add: (effect: () => void) => store.get().iEffects.push(effect),
};

const isLayoutEffectsZone = {
  get: () => store.get()?.isLEFZone || false,
  set: (value: boolean) => (store.get().isLEFZone = value),
};

const isInsertionEffectsZone = {
  get: (id?: number) => store.get(id)?.isIEFZone || false,
  set: (value: boolean) => (store.get().isIEFZone = value),
};

const isUpdateHookZone = {
  get: () => store.get()?.uZone || false,
  set: (value: boolean) => (store.get().uZone = value),
};

const isBatchZone = {
  get: () => store.get()?.bZone || false,
  set: (value: boolean) => (store.get().bZone = value),
};

const isHydrateZone = {
  get: () => store.get()?.hZone || false,
  set: (value: boolean) => (store.get().hZone = value),
};

const isStreamZone = {
  get: () => store.get()?.sZone || false,
  set: (value: boolean) => (store.get().sZone = value),
};

const isTransitionZone = {
  get: () => store.get()?.tZone || false,
  set: (value: boolean) => (store.get().tZone = value),
};

const hot = {
  get: () => store.get()?.isHot || false,
  set: (value: boolean) => (store.get().isHot = value),
};

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
  mountStore,
  effectsStore,
  layoutEffectsStore,
  insertionEffectsStore,
  isLayoutEffectsZone,
  isInsertionEffectsZone,
  isUpdateHookZone,
  isBatchZone,
  isHydrateZone,
  isStreamZone,
  isTransitionZone,
  hot,
};
