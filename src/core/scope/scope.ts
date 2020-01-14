import { VirtualNode } from '../vdom/vnode';
import { ComponentFactory } from '../component';
import { truncateComponentId, createComponentId } from '@helpers';
import { COMPONENT_MARKER_STRING } from '../constants';
import { Context, ContextProviderStore } from '../context';

type ScopeType = {
  registery: Map<number, AppType>;
  uid: number;
  mountedComponentFactory: ComponentFactory;
  mountedComponentId: string;
  mountedComponentRoute: Array<string | number>;
  currentUseStateComponentId: string;
};

type AppType = {
  nativeElement: unknown;
  vdom: VirtualNode;
  componentStore: Record<string, {
    props?: any;
    nodeRoutes?: Array<Array<number>>;
    vNodes?: Array<VirtualNode>;
    nestedComponentIdsMap?: Record<string, boolean>;
  }>
  eventStore: Map<
    string,
    WeakMap<any, Function>
  >;
  portalStore: Record<string, {
    vNode: VirtualNode;
    unmountContainer: Function;
    time: number;
  }>;
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
const getMountedComponentRoute = () => scope.mountedComponentRoute;
const setMountedComponentRoute = (route: Array<string | number>) => scope.mountedComponentRoute = route;
const getMountedComponentFactory = () => scope.mountedComponentFactory;
const setMountedComponentFactory = (factory: ComponentFactory) => scope.mountedComponentFactory = factory;
const getCurrentUseStateComponentId = (): string => scope.currentUseStateComponentId;
const setCurrentUseStateComponentId = (id: string) => scope.currentUseStateComponentId = id;

function getParentComponentId(componentRoute: Array<string | number>): string {
  let idx = componentRoute.length;
  let parentComponentId = '';

  for (let i = componentRoute.length - 1; i >= 0; i--) {
    const part = componentRoute[i];

    if (part === COMPONENT_MARKER_STRING) {
      idx--;
    } else {
      break;
    }
  }

  const transitIdx = idx;

  for (let i = transitIdx - 1; i >= 0; i--) {
    const part = componentRoute[i];

    if (part !== COMPONENT_MARKER_STRING) {
      idx--;
    } else {
      if (componentRoute[i - 1] && componentRoute[i - 1] === COMPONENT_MARKER_STRING) {
        idx--;
      } else {
        break;
      }
    }
  }

  parentComponentId = createComponentId(componentRoute.slice(0, idx));

  return parentComponentId;
}

function linkComponentIdToParentComponent(componentId: string) {
  const { componentStore } = getRegistery().get(getAppUid());
  const componentRoute = componentId.split('.');

  if (componentRoute[componentRoute.length - 2] === COMPONENT_MARKER_STRING &&
    componentRoute[componentRoute.length - 1] === COMPONENT_MARKER_STRING) {
      return;
  };

  const parentComponentId = getParentComponentId(componentRoute);
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

function setComponentVirtualNodesById(componentId: string, vNodes: Array<VirtualNode>, patchNodeRoutes: boolean = false) {
  const { componentStore } = getRegistery().get(getAppUid());
  const id = truncateComponentId(componentId);

  if (!componentStore[id]) {
    componentStore[id] = {};
  }

  const store = componentStore[id];

  store.vNodes = vNodes;

  if (patchNodeRoutes && store.nestedComponentIdsMap) {
    const nodeRoute = vNodes[0].nodeRoute;

    for (const nestedComponentId of Object.keys(store.nestedComponentIdsMap)) {
      const nestedStore = componentStore[nestedComponentId];

      if (nestedStore) {
        for (const vNode of nestedStore.vNodes) {
          if (vNode.nodeRoute.length > nodeRoute.length) {
            vNode.nodeRoute.splice(0, nodeRoute.length, ...nodeRoute);
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
    mountedComponentRoute: [],
    currentUseStateComponentId: '',
  };
}

function createApp(nativeElement: unknown): AppType {
  return {
    nativeElement,
    vdom: null,
    componentStore: {},
    eventStore: new Map(),
    portalStore: {},
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
  getMountedComponentRoute,
  setMountedComponentRoute,
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
