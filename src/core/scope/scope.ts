import { VirtualNode, getPatchedNodeId } from '../vdom/vnode';
import { ComponentFactory } from '../component';
import { truncateComponentId } from '@helpers';
import { Context, ContextProviderStore } from '../context';
import { FiberInstance } from '../fiber';

type ScopeType = {
  registery: Map<number, AppType>;
  uid: number;
  mountedComponentFactory: ComponentFactory;
  mountedComponentId: string;
  currentUseStateComponentId: string;
};

type AppType = {
  nativeElement: unknown;
  vdom: VirtualNode;
  fiber: {
    current: FiberInstance;
  };
  componentStore: Record<string, {
    props?: any;
    vNodes?: Array<VirtualNode>;
    nestedComponentIdsMap?: Record<string, boolean>;
  }>;
  eventStore: Map<
    string,
    WeakMap<any, Function>
  >;
  memoStore: Record<string, {
    props: any;
  }>;
  hookStore: Record<string, {
    idx: number;
    values: Array<any>;
  }>;
  contextStore: Map<Context, ContextProviderStore>;
};

const scope = createScope();
const getRegistery = () => scope.registery;
const setRegistery = (registery: Map<number, any>) => scope.registery = registery;
const getAppUid = (): number => scope.uid;
const setAppUid = (uid: number) => (scope.uid = uid);
const getVirtualDOM = (uid: number): VirtualNode => getRegistery().get(uid).vdom;
const getMountedComponentId = () => scope.mountedComponentId;
const setMountedComponentId = (id: string) => scope.mountedComponentId = id;
const getMountedComponentFactory = () => scope.mountedComponentFactory;
const setMountedComponentFactory = (factory: ComponentFactory) => scope.mountedComponentFactory = factory;
const getCurrentUseStateComponentId = (): string => scope.currentUseStateComponentId;
const setCurrentUseStateComponentId = (id: string) => scope.currentUseStateComponentId = id;

function getParentComponentId(componentId: string): string {
  const parentComponentId = componentId
    .replace(/(\.-1)+$/g, '')
    .replace(/[^\-1][\.\[\]\d]+$/g, '');

  return parentComponentId;
}

function linkComponentIdToParentComponent(componentId: string) {
  const { componentStore } = getRegistery().get(getAppUid());
  const parentComponentId = getParentComponentId(componentId);
  const store = componentStore[parentComponentId];

  if (store) {
    if (!store.nestedComponentIdsMap) {
      store.nestedComponentIdsMap = {};
    }
    store.nestedComponentIdsMap[componentId] = true;
  } else if (parentComponentId) {
    componentStore[parentComponentId] = {
      nestedComponentIdsMap: {
        [componentId]: true,
      },
    }
  }
}

function getComponentVirtualNodesById(componentId: string): Array<VirtualNode> {
  const { componentStore } = getRegistery().get(getAppUid());
  const id = truncateComponentId(componentId);
  const vNodes = componentStore[id] ? componentStore[id].vNodes : [];

  return vNodes;
}

function setComponentVirtualNodesById(componentId: string, vNodes: Array<VirtualNode>, patchNodeIds: boolean = false) {
  const { componentStore } = getRegistery().get(getAppUid());
  const id = truncateComponentId(componentId);

  if (!componentStore[id]) {
    componentStore[id] = {};
  }

  const store = componentStore[id];

  store.vNodes = vNodes;

  if (patchNodeIds && store.nestedComponentIdsMap) {
    const nodeId = vNodes[0].nodeId;

    for (const nestedComponentId of Object.keys(store.nestedComponentIdsMap)) {
      const nestedStore = componentStore[nestedComponentId];

      if (nestedStore) {
        for (const vNode of nestedStore.vNodes) {
          if (vNode.nodeId.length > nodeId.length) {
            vNode.nodeId = getPatchedNodeId(nodeId, vNode.nodeId)
          }
        }
        setComponentVirtualNodesById(nestedComponentId, nestedStore.vNodes, true);
      }
    }
  }
}

function getComponentPropsById(id: string): any {
  const { componentStore } = getRegistery().get(getAppUid());
  const props = componentStore[id] ? componentStore[id].props : null;

  return props;
}

function setComponentPropsById(id: string, props: any) {
  const { componentStore } = getRegistery().get(getAppUid());

  if (!componentStore[id]) {
    componentStore[id] = {};
  }

  componentStore[id].props = props;
}

const getHooks = (componentId: string) => {
  const uid = getAppUid();
  const hookStore = getRegistery().get(uid).hookStore;

  if (!hookStore[componentId]) {
    hookStore[componentId] = {
      idx: 0,
      values: [],
    };
  }

  return hookStore[componentId];
};

const resetHooks = (componentId: string) => {
  const uid = getAppUid();
  const hookStore = getRegistery().get(uid) && getRegistery().get(uid).hookStore;

  if (Boolean(hookStore && hookStore[componentId])) {
    getHooks(componentId).idx = 0;
  }
};

function getContextProviderStore(context: Context): ContextProviderStore {
  const { contextStore } = getRegistery().get(getAppUid());

  return contextStore.get(context);
}

function setContextProviderStore(context: Context, contextProviderStore: ContextProviderStore) {
  const { contextStore } = getRegistery().get(getAppUid());

  if (!contextStore.get(context)) {
    contextStore.set(context, contextProviderStore);
  }
}

function createScope(): ScopeType {
  return {
    registery: new Map(),
    uid: 0,
    mountedComponentFactory: null,
    mountedComponentId: '',
    currentUseStateComponentId: '',
  };
}

function createApp(nativeElement: unknown): AppType {
  return {
    nativeElement,
    vdom: null,
    fiber: {
      current: null,
    },
    componentStore: {},
    eventStore: new Map(),
    memoStore: {},
    hookStore: {},
    contextStore: new Map(),
  };
}

export {
  ScopeType,
  AppType,
  getRegistery,
  setRegistery,
  getAppUid,
  setAppUid,
  getVirtualDOM,
  createScope,
  createApp,
  getMountedComponentId,
  setMountedComponentId,
  getMountedComponentFactory,
  setMountedComponentFactory,
  getHooks,
  resetHooks,
  getCurrentUseStateComponentId,
  setCurrentUseStateComponentId,
  getComponentPropsById,
  setComponentPropsById,
  getContextProviderStore,
  setContextProviderStore,
  linkComponentIdToParentComponent,
  getComponentVirtualNodesById,
  setComponentVirtualNodesById,
};
