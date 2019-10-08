import { VirtualNode } from '../vdom';

type ScopeType = {
  registery: Map<number, AppType>;
  uid: number;
  mountedRoute: Array<number>;
};

type AppType = {
  nativeElement: HTMLElement;
  vdom: VirtualNode;
  eventHandlersCache: Array<(e) => void>;
  eventHandlers: WeakMap<
    any,
    {
      addEvent?: Function;
      removeEvent?: Function;
    }
  >;
  refs: Array<Function>;
  queue: Array<Function>;
};

const scope = createScope();
const getRegistery = () => scope.registery;
const setRegistery = (registery: Map<number, any>) => (scope.registery = registery);
const getAppUid = (): number => scope.uid;
const setAppUid = (uid: number) => (scope.uid = uid);
const getMountedRoute = (): Array<number> => [...scope.mountedRoute];
const setMountedRoute = (route: Array<number>) => (scope.mountedRoute = [...route]);
const getVirtualDOM = (uid: number): VirtualNode => ({ ...getRegistery().get(uid).vdom });

function createScope(): ScopeType {
  return {
    registery: new Map(),
    uid: 0,
    mountedRoute: [],
  };
}

function createApp(nativeElement: HTMLElement): AppType {
  return {
    nativeElement,
    vdom: null,
    eventHandlersCache: [],
    eventHandlers: new WeakMap(),
    refs: [],
    queue: [],
  };
}

export {
  ScopeType,
  AppType,
  getRegistery,
  setRegistery,
  getAppUid,
  setAppUid,
  getMountedRoute,
  setMountedRoute,
  getVirtualDOM,
  createScope,
  createApp,
};
