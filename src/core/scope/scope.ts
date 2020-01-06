import { VirtualNode, getVirtualNodeByRoute } from '../vdom/vnode';
import { ComponentFactory } from '../component';
import { truncateComponentId, deepClone } from '@helpers';
import { COMPONENT_MARKER_STRING } from '../constants';

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

  parentComponentId = componentRoute.slice(0, idx).join('.');

  return parentComponentId;
}

function linkComponentIdToParentComponent(componentId: string, componentStore: AppType['componentStore']) {
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

  // console.log('componentStore', deepClone(componentStore));
}

function getComponentVirtualNodesById(componentId: string): Array<VirtualNode> {
  const vdom = getVirtualDOM(getAppUid());
  const nodeRoutes = getComponentNodeRoutesById(componentId);
  const vNodes = nodeRoutes.map(nodeRoute => getVirtualNodeByRoute(vdom, nodeRoute)); // need optimization

  return vNodes;
}

function getComponentNodeRoutesById(componentId: string): Array<Array<number>> {
  const { componentStore } = getRegistery().get(getAppUid());
  const id = truncateComponentId(componentId);
  const nodes = componentStore[id] ? componentStore[id].nodeRoutes : null;

  // console.log('componentStore', deepClone(componentStore));

  return nodes;
}

function setComponentNodeRoutesById(
  componentId: string, nodeRoutes: Array<Array<number>>) {
  const { componentStore } = getRegistery().get(getAppUid());
  const id = truncateComponentId(componentId);

  if (!componentStore[id]) {
    componentStore[id] = {};
  }

  const store = componentStore[id];

  linkComponentIdToParentComponent(componentId, componentStore);

  store.nodeRoutes = nodeRoutes;
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
  getComponentVirtualNodesById,
  getComponentNodeRoutesById,
  setComponentNodeRoutesById,
  getComponentPropsById,
  setComponentPropsById,
};
