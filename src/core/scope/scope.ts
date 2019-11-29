import { VirtualNode, VirtualDOM } from '../vdom';
import { ComponentFactory } from '../component';

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
    props: any;
    vdom: VirtualDOM;
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

const getComponentVirtualNodesById = (id: string) => {
  const { componentStore } = getRegistery().get(getAppUid());
  const nodes = componentStore[id] ? componentStore[id].vdom : null;
  
  return nodes;
};

const setComponentVirtualNodesById = (id: string, vdom: VirtualDOM) => {
  const { componentStore } = getRegistery().get(getAppUid());
  
  if (!componentStore[id]) {
    componentStore[id] = {
      props: null,
      vdom,
    }; 
  } else {
    componentStore[id].vdom = vdom;
  }
};

const getComponentPropsById = (id: string): any => {
  const { componentStore } = getRegistery().get(getAppUid());
  const props = componentStore[id] ? componentStore[id].props : null;
  
  return props;
};

const setComponentPropsById = (id: string, props: any) => {
  const { componentStore } = getRegistery().get(getAppUid());
  
  if (!componentStore[id]) {
    componentStore[id] = {
      props,
      vdom: null,
    }; 
  } else {
    componentStore[id].props = props;
  }
};

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
  setComponentVirtualNodesById,
  getComponentPropsById,
  setComponentPropsById,
};
