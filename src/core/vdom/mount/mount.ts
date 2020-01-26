import { flatten, isArray, isNull, isFunction, isEmpty, createComponentId, deepClone } from '@helpers';
import { getIsComponentFactory, ComponentFactory } from '../../component';
import {
  createVirtualEmptyNode,
  createVirtualNode,
  isVirtualNode,
  VirtualDOM,
  VirtualNode,
  setAttribute,
  createNodeRouteFromId,
  getCompletedNodeIdFromEnd,
  getPatchedNodeId,
  getLastRouteIdFromNodeId,
  createComponentRouteFromId,
  completeComponentIdFromEnd,
  getLastRouteIdFromComponentId,
  getParentNodeId,
} from '../vnode/vnode';
import {
  setMountedComponentId,
  setMountedComponentRoute,
  setMountedComponentFactory,
  resetHooks,
  getComponentVirtualNodesById,
  setComponentPropsById,
  linkComponentIdToParentComponent,
  setComponentVirtualNodesById,
} from '../../scope';
import { ATTR_KEY, COMPONENT_MARKER } from '../../constants';
import { getIsMemo } from '../../memo/memo';

export type MountedSource = VirtualDOM | ComponentFactory | Array<ComponentFactory> | null | undefined;

const $$replaceNodeBeforeMountHook = Symbol('replaceNodeBeforeMountHook');
const $$replaceNodeAfterMountHook = Symbol('replaceNodeAfterMountHook');
const $$nodeRouteHook = Symbol('nodeRouteHook');
const $$skipNodeMountHook = Symbol('skipNodeMountHook');

type WrapWithRooOptions = {
  mountedSource: MountedSource;
  mountedNodeRoute: Array<number>;
  mountedComponentRoute: Array<number | string>;
  mountedNodeId: string;
  mountedComponentId: string;
};

function wrapWithRoot(options: WrapWithRooOptions): VirtualNode {
  const {
    mountedNodeRoute,
    mountedComponentRoute,
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
    mountedNodeRoute: [...mountedNodeRoute, 0],
    mountedComponentRoute,
    mountedNodeId: getCompletedNodeIdFromEnd(mountedNodeId, 0),
    mountedComponentId,
  });

  vNode = createVirtualNode('TAG', {
    name: 'root',
    componentRoute: mountedComponentRoute,
    nodeRoute: [0],
    nodeId: mountedNodeId,
    componentId: mountedComponentRoute.join('.'),
    children: isArray(mountedVDOM) ? mountedVDOM : [mountedVDOM],
  });

  return vNode;
}

function generateComponentRouteKey(source: MountedSource, fallback: number): number | string {
  const key = (getIsComponentFactory(source) && source.props.key) || null;
  const formattedKey = !isEmpty(key) ? `[${key}]` : fallback;

  return formattedKey;
}

type FlatVirtualDOMOptions = {
  mountedSource: MountedSource;
  mountedNodeRoute: Array<number>;
  mountedComponentRoute: Array<number | string>;
  mountedNodeId: string;
  mountedComponentId: string;
}

function flatVirtualDOM(options: FlatVirtualDOMOptions): VirtualDOM {
  const {
    mountedSource,
    mountedNodeRoute,
    mountedComponentRoute,
    mountedNodeId,
    mountedComponentId,
  } = options;
  let vNode: VirtualDOM = null;

  if (getIsComponentFactory(mountedSource)) {
    vNode = mountVirtualDOM({
      mountedSource,
      mountedNodeRoute,
      mountedComponentRoute,
      mountedNodeId,
      mountedComponentId,
    });
  } else if (Boolean(mountedSource)) {
    const isList = isArray(mountedSource);
    const isVNode = isVirtualNode(mountedSource);
    let mountedSourceList: Array<MountedSource> = [];

    if (isList) {
      mountedSourceList = mountedSource as Array<MountedSource>
    } else if (isVNode) {
      vNode = mountedSource as VirtualNode;
      vNode.nodeRoute = mountedNodeRoute;
      vNode.componentRoute = mountedComponentRoute;
      vNode.nodeId = mountedNodeId;
      vNode.componentId = mountedComponentId;
      mountedSourceList = vNode.children;
    }

    const list = [];
    const parentNodeRoute = isList ? mountedNodeRoute.slice(0, -1) : [];
    const parentNodeId = getParentNodeId(mountedNodeId);
    const lastId = mountedNodeRoute[mountedNodeRoute.length - 1];
    let shift = 0;

    for (let i = 0; i < mountedSourceList.length; i++) {
      const source = mountedSourceList[i];
      const nodeRoute = isList
        ? [...parentNodeRoute, lastId + shift + i]
        : [...mountedNodeRoute, shift + i];
      const nodeId = isList
        ? getCompletedNodeIdFromEnd(parentNodeId, Number(lastId + shift + i))
        : getCompletedNodeIdFromEnd(mountedNodeId, Number(shift + i))
      const componentRoute = [...mountedComponentRoute, generateComponentRouteKey(source, i)];
      const componentId = completeComponentIdFromEnd(mountedComponentId, generateComponentRouteKey(source, i))
      const mounted = mountVirtualDOM({
        mountedSource: source,
        mountedNodeRoute: nodeRoute,
        mountedComponentRoute: componentRoute,
        mountedNodeId: nodeId,
        mountedComponentId: componentId,
      });

      if (isArray(mounted)) {
        shift += flatten(mounted).length - 1;
      }

      list.push(mounted);
    }

    if (isList) {
      vNode = flatten(list);
    } else if (isVNode) {
      (vNode as VirtualNode).children = flatten(list);
    }
  }

  return vNode;
}

type MountVirtualDOMOptions = {
  mountedSource: MountedSource;
  mountedNodeRoute?: Array<number>;
  mountedComponentRoute?: Array<number | string>;
  mountedNodeId?: string;
  mountedComponentId?: string;
  fromRoot?: boolean;
};

function mountVirtualDOM({
  mountedSource,
  mountedNodeRoute = [0],
  mountedComponentRoute = [0],
  mountedNodeId = '0',
  mountedComponentId = '0',
  fromRoot = false,
}: MountVirtualDOMOptions): VirtualDOM {
  let vNode: MountedSource = null;

  if (fromRoot) {
    vNode = wrapWithRoot({
      mountedSource,
      mountedNodeRoute,
      mountedComponentRoute,
      mountedNodeId,
      mountedComponentId,
    });
  } else if (getIsComponentFactory(mountedSource)) {
    const componentFactory = mountedSource as ComponentFactory;
    const key = componentFactory.props[ATTR_KEY];
    mountedComponentRoute.push(COMPONENT_MARKER);
    const componentId = createComponentId(mountedComponentRoute);

    setMountedComponentFactory(componentFactory);
    setMountedComponentId(componentId);
    setMountedComponentRoute(mountedComponentRoute);

    const nodeRoute = isFunction(componentFactory.props[$$nodeRouteHook])
      ? componentFactory.props[$$nodeRouteHook](mountedNodeRoute)
      : mountedNodeRoute;
    const skipMount = isFunction(componentFactory.props[$$skipNodeMountHook])
      ? componentFactory.props[$$skipNodeMountHook](componentId)
      : false;
    const isMemo = getIsMemo(mountedSource);
    let isDifferentRoutes = false;

    if (skipMount) {
      vNode = getComponentVirtualNodesById(componentId);
      isDifferentRoutes = vNode[0]
        ? vNode[0].nodeRoute.slice(0, nodeRoute.length).toString() !== nodeRoute.toString()
        : false;

      if (isArray(vNode) && vNode.length === 1) {
        vNode = vNode[0];
      }
    } else {
      vNode = componentFactory.createElement();

      if (!isMemo) {
        vNode = getEmptyVirtualNodeIfNodeNotExists(vNode as VirtualDOM, nodeRoute, mountedComponentRoute);

        if (!isEmpty(key) && getIsComponentFactory(vNode)) {
          vNode.props[ATTR_KEY] = key;
        }
      }
    }

    !isMemo && resetHooks(componentId);

    vNode = isFunction(componentFactory.props[$$replaceNodeBeforeMountHook])
      ? componentFactory.props[$$replaceNodeBeforeMountHook](
        vNode, componentId, mountedNodeRoute, skipMount, isDifferentRoutes)
      : vNode;
    vNode = !skipMount ? flatVirtualDOM({
      mountedSource: vNode,
      mountedNodeRoute: nodeRoute,
      mountedComponentRoute,
      mountedNodeId: nodeRoute.join('.'),
      mountedComponentId: componentId,
    }) : vNode;
    vNode = isFunction(componentFactory.props[$$replaceNodeAfterMountHook])
      ? componentFactory.props[$$replaceNodeAfterMountHook](vNode, componentId)
      : vNode;

    if (!isMemo) {
      if (!skipMount) {
        if (!isArray(vNode) && !isEmpty(key) && !isEmpty(vNode)) {
          setAttribute(vNode as VirtualNode, ATTR_KEY, key);
        }
        setComponentPropsById(componentId, componentFactory.props);
        linkComponentIdToParentComponent(componentId);
      }

      if (!skipMount || isDifferentRoutes) {
        const vNodes = (isArray(vNode) ? vNode : [vNode]) as Array<VirtualNode>;

        setComponentVirtualNodesById(componentId, vNodes.filter(Boolean));
      }
    }
  } else if (Boolean(mountedSource)) {
    vNode = flatVirtualDOM({
      mountedSource,
      mountedNodeRoute,
      mountedComponentRoute,
      mountedNodeId,
      mountedComponentId,
    });
  }

  vNode = getEmptyVirtualNodeIfNodeNotExists(vNode as VirtualDOM, mountedNodeRoute, mountedComponentRoute);

  return vNode as VirtualDOM;
}

function getEmptyVirtualNodeIfNodeNotExists(
  vNode: VirtualDOM | null | undefined, nodeRoute: Array<number>, componentRoute: Array<number | string>): VirtualDOM {
  let vdom = vNode;

  if (isArray(vdom) && !vdom[0]) {
    vdom[0] = createVirtualEmptyNode();
    vdom[0].nodeRoute = nodeRoute;
    vdom[0].componentRoute = componentRoute;
    vdom[0].nodeId = nodeRoute.join('.');
    vdom[0].componentId = componentRoute.join('.');
  } else if (!vdom) {
    vdom = createVirtualEmptyNode();
    vdom.nodeRoute = nodeRoute;
    vdom.componentRoute = componentRoute;
    vdom.nodeId = nodeRoute.join('.');
    vdom.componentId = componentRoute.join('.');
  }

  return vdom;
}

export {
  mountVirtualDOM,
  $$replaceNodeBeforeMountHook,
  $$replaceNodeAfterMountHook,
  $$skipNodeMountHook,
  $$nodeRouteHook,
};
