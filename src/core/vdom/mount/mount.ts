import { flatten, isArray, isNull, isFunction, isEmpty, deepClone } from '@helpers';
import { getIsComponentFactory, ComponentFactory } from '../../component';
import {
  createVirtualEmptyNode,
  createVirtualNode,
  isVirtualNode,
  VirtualDOM,
  VirtualNode,
  setAttribute,
  getCompletedNodeIdFromEnd,
  getLastRouteIdFromNodeId,
  completeComponentIdFromEnd,
  getParentNodeId,
} from '../vnode/vnode';
import {
  setMountedComponentId,
  setMountedComponentFactory,
  resetHooks,
  getComponentVirtualNodesById,
  setComponentPropsById,
  linkComponentIdToParentComponent,
  setComponentVirtualNodesById,
} from '../../scope';
import { ATTR_KEY, COMPONENT_MARKER } from '../../constants';
import { getIsMemo } from '../../memo/memo';
import { getIsPortal } from '../../../platform/browser/portal'; // temp
import createFiber, { FiberOptions } from '../../fiber';

export type MountedSource = VirtualDOM | ComponentFactory | Array<ComponentFactory> | null | undefined;

const $$replaceNodeBeforeMountHook = Symbol('replaceNodeBeforeMountHook');
const $$replaceNodeAfterMountHook = Symbol('replaceNodeAfterMountHook');
const $$skipNodeMountHook = Symbol('skipNodeMountHook');


type SharedOptions = {
  mountedSource: MountedSource;
  mountedNodeId: string;
  mountedComponentId: string;
}

type WrapWithRooOptions = {} & SharedOptions;

function wrapWithRoot(options: WrapWithRooOptions, fiberOptions: FiberOptions): VirtualNode {
  const {
    mountedNodeId,
    mountedComponentId,
  } = options;
  let {
    mountedSource,
  } = options;
  let vNode = null;

  if (isNull(mountedSource)) {
    mountedSource = createVirtualEmptyNode();
  }

  const mountedVDOM = mountVirtualDOM({
    mountedSource,
    mountedNodeId: getCompletedNodeIdFromEnd(mountedNodeId, 0),
    mountedComponentId,
  }, fiberOptions);

  vNode = createVirtualNode('TAG', {
    name: 'root',
    nodeId: mountedNodeId,
    componentId: '0.-1',
    children: isArray(mountedVDOM) ? mountedVDOM : [mountedVDOM],
  });

  return vNode;
}

function generateComponentRouteKey(source: MountedSource, fallback: number): number | string {
  const key = (getIsComponentFactory(source) && source.props.key) || null;
  const formattedKey = !isEmpty(key) ? `[${key}]` : fallback;

  return formattedKey;
}

type FlatVirtualDOMOptions = {} & SharedOptions;

let pool = [];

function flatVirtualDOM(options: FlatVirtualDOMOptions, fiberOptions: FiberOptions): VirtualDOM {
  const {
    scheduleNextFrame,
    putToCache,
    takeFromCache,
  } = (fiberOptions || {});
  const isAsync = Boolean(scheduleNextFrame);
  const {
    mountedSource,
    mountedNodeId,
    mountedComponentId,
  } = options;

  if (isAsync) {
    const cache = takeFromCache(`${mountedComponentId}:node`);

    if (cache) return cache;
  }

  let vNode: VirtualDOM = null;
  const isList = isArray(mountedSource);
  const isVNode = isVirtualNode(mountedSource);
  let mountedSourceList: Array<MountedSource> = [];

  if (isList) {
    mountedSourceList = mountedSource as Array<MountedSource>
  } else if (isVNode) {
    vNode = mountedSource as VirtualNode;
    vNode.nodeId = mountedNodeId;
    vNode.componentId = mountedComponentId;
    mountedSourceList = vNode.children;

    pool = [pool[pool.length - 2], pool[pool.length - 1]];

    if (mountedNodeId === '0.0') {
      pool.push(vNode);
    }
  }

  const list =  isAsync
    ? takeFromCache(`${mountedComponentId}:list`) || []
    : [];
  const start = isAsync
    ? takeFromCache(`${mountedComponentId}:index`) || 0
    : 0;

  const parentNodeId = getParentNodeId(mountedNodeId);
  const lastId = getLastRouteIdFromNodeId(mountedNodeId);
  let shift = 0;

  for (let i = start; i < mountedSourceList.length; i++) {
    const source = mountedSourceList[i];
    const nodeId = isList
      ? parentNodeId + '.' + +(lastId + shift + i)
      : mountedNodeId + '.' + +(shift + i)
    const componentId = mountedComponentId + '.' + generateComponentRouteKey(source, i)
    const vDOM = mountVirtualDOM({
      mountedSource: source,
      mountedNodeId: nodeId,
      mountedComponentId: componentId,
    }, fiberOptions);

    if (isArray(vDOM)) {
      shift += flatten(vDOM).length - 1;
    }

    list.push(vDOM);

    if (isAsync) {
      putToCache(`${mountedComponentId}:index`, i + 1);
      putToCache(`${mountedComponentId}:list`, list);
    }
  }

  if (isList) {
    vNode = flatten(list);
  } else if (isVNode) {
    (vNode as VirtualNode).children = flatten(list);
  }

  if (isAsync) {
    putToCache(`${mountedComponentId}:node`, vNode);
  }

  return vNode;
}

type MountVirtualDOMOptions = {
  mountedSource: MountedSource;
  fromRoot?: boolean;
} & Partial<Omit<SharedOptions, 'mountedSource'>>;

function mountVirtualDOM(options: MountVirtualDOMOptions, fiberOptions: FiberOptions = null): VirtualDOM {
  const {
    scheduleNextFrame,
    putToCache,
    takeFromCache,
  } = (fiberOptions || {});
  const isAsync = Boolean(scheduleNextFrame);
  const {
    mountedSource,
    mountedComponentId = '0',
    fromRoot = false,
  } = options;
  let {
    mountedNodeId = '0',
  } = options;
  let vNode: MountedSource = null;
  let isList = false;

  if (isAsync) {
    const cache = takeFromCache(mountedComponentId);

    //if (cache) return cache;
  }

  if (fromRoot) {
    vNode = wrapWithRoot({
      mountedSource,
      mountedNodeId,
      mountedComponentId,
    }, fiberOptions);
  } else if (getIsComponentFactory(mountedSource)) {
    const componentFactory = mountedSource as ComponentFactory;

    if (getIsPortal(componentFactory)) {
      mountedNodeId = '0';
    }

    const key = componentFactory.props[ATTR_KEY];
    const componentId = completeComponentIdFromEnd(mountedComponentId, COMPONENT_MARKER);

    setMountedComponentFactory(componentFactory);
    setMountedComponentId(componentId);

    const nodeId: string = mountedNodeId;
    const skipMount = isFunction(componentFactory.props[$$skipNodeMountHook])
      ? componentFactory.props[$$skipNodeMountHook](componentId)
      : false;
    const isMemo = getIsMemo(mountedSource);
    let isDifferentNodeIds = false;

    if (skipMount) {
      vNode = getComponentVirtualNodesById(componentId);
      isDifferentNodeIds = vNode[0] ? vNode[0].nodeId !== nodeId : false;
      isList = isArray(vNode);

      if (isList && vNode.length === 1) {
        vNode = vNode[0];
      }
    } else {
      vNode = componentFactory.createElement();
      isList = isArray(vNode);

      if (!isMemo) {
        if (!vNode || isList && !vNode[0]) {
          vNode = getEmptyVirtualNodeIfNodeNotExists(vNode as VirtualDOM, nodeId, mountedComponentId);
        }

        if (!isEmpty(key) && getIsComponentFactory(vNode)) {
          vNode.props[ATTR_KEY] = key;
        }
      }
    }

    !isMemo && resetHooks(componentId);

    vNode = isFunction(componentFactory.props[$$replaceNodeBeforeMountHook])
      ? componentFactory.props[$$replaceNodeBeforeMountHook](vNode, componentId, nodeId, skipMount, isDifferentNodeIds)
      : vNode;

    if (!skipMount) {
      if (getIsComponentFactory(vNode)) {
        vNode = mountVirtualDOM({
          mountedSource: vNode,
          mountedNodeId: nodeId,
          mountedComponentId: componentId,
        }, fiberOptions);
      } else if (Boolean(vNode)) {
        vNode = flatVirtualDOM({
          mountedSource: vNode,
          mountedNodeId: nodeId,
          mountedComponentId: componentId,
        }, fiberOptions);
      }
    }

    vNode = isFunction(componentFactory.props[$$replaceNodeAfterMountHook])
      ? componentFactory.props[$$replaceNodeAfterMountHook](vNode, componentId)
      : vNode;
    isList = isArray(vNode);

    if (!isMemo) {
      if (!skipMount) {
        if (!isList && !isEmpty(key) && !isEmpty(vNode)) {
          setAttribute(vNode as VirtualNode, ATTR_KEY, key);
        }
        setComponentPropsById(componentId, componentFactory.props);
        linkComponentIdToParentComponent(componentId);
      }

      if (!skipMount || isDifferentNodeIds) {
        const vNodes = (isList ? vNode : [vNode]) as Array<VirtualNode>;

        setComponentVirtualNodesById(componentId, vNodes.filter(Boolean));
      }
    }
  } else if (Boolean(mountedSource)) {
    vNode = flatVirtualDOM({
      mountedSource,
      mountedNodeId,
      mountedComponentId,
    }, fiberOptions);
  }

  if (!vNode || isList && !vNode[0]) {
    vNode = getEmptyVirtualNodeIfNodeNotExists(vNode as VirtualDOM, mountedNodeId, mountedComponentId);
  }

  if (isAsync) {
    putToCache(mountedComponentId, vNode);
  }

  if (isAsync && pool[pool.length - 2]) {
    // console.log('pool', deepClone(pool));
    scheduleNextFrame(() => {
      const vNode = createVirtualNode('TAG', {
        name: 'root',
        nodeId: mountedNodeId,
        componentId: '0.-1',
        children: [pool[pool.length - 2]],
      });

      return vNode;
    });
  }

  return vNode as VirtualDOM;
}

function getEmptyVirtualNodeIfNodeNotExists(
  vNode: VirtualDOM | null | undefined, nodeId: string, componentId: string): VirtualDOM {
  let vdom = vNode;

  if (isArray(vdom) && !vdom[0]) {
    vdom[0] = createVirtualEmptyNode();
    vdom[0].nodeId = nodeId;
    vdom[0].componentId = componentId;
  } else if (!vdom) {
    vdom = createVirtualEmptyNode();
    vdom.nodeId = nodeId;
    vdom.componentId = componentId;
  }

  return vdom;
}

type AsyncMountVirtualDOMCallback = (nextVNode: VirtualNode, complete: boolean) => void;

type AsyncMountVirtualDOM = (options: MountVirtualDOMOptions, cb: AsyncMountVirtualDOMCallback) => void;

const mountFiber = createFiber(16);

const asyncMountVirtualDOM =  mountFiber.make(mountVirtualDOM) as AsyncMountVirtualDOM;

export {
  $$replaceNodeBeforeMountHook,
  $$replaceNodeAfterMountHook,
  $$skipNodeMountHook,
  mountVirtualDOM,
  asyncMountVirtualDOM,
  mountFiber,
};
