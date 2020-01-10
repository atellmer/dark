import { flatten, isArray, isNull, isFunction, isEmpty, createComponentId, deepClone } from '@helpers';
import { getIsComponentFactory, ComponentFactory } from '../../component';
import {
  createVirtualEmptyNode,
  createVirtualNode,
  isVirtualNode,
  VirtualDOM,
  VirtualNode,
  setAttribute,
} from '../vnode/vnode';
import {
  setMountedComponentId,
  setMountedComponentRoute,
  setMountedComponentFactory,
  resetHooks,
  setComponentNodeRoutesById,
  getComponentVirtualNodesById,
  setComponentPropsById,
  linkComponentIdToParentComponent,
} from '../../scope';
import { ATTR_KEY, COMPONENT_MARKER } from '../../constants';

export type MountedSource = VirtualDOM | ComponentFactory | Array<ComponentFactory> | null | undefined;

const $$replaceNodeBeforeMountHook = Symbol('replaceNodeBeforeMountHook');
const $$replaceNodeAfterMountHook = Symbol('replaceNodeAfterMountHook');
const $$nodeRouteHook = Symbol('nodeRouteHook');
const $$skipNodeMountHook = Symbol('skipNodeMountHook');

function wrapWithRoot(
  mountedSource: MountedSource,
  mountedNodeRoute: Array<number>,
  mountedComponentRoute: Array<number | string>,
): VirtualNode {
  let vNode = null;

  if (isNull(mountedSource)) {
    mountedSource = createVirtualEmptyNode();
  }

  const mountedVDOM = mountVirtualDOM({
    mountedSource,
    mountedComponentRoute,
    mountedNodeRoute: [...mountedNodeRoute, 0],
  });

  vNode = createVirtualNode('TAG', {
    name: 'root',
    componentRoute: mountedComponentRoute,
    nodeRoute: [0],
    children: isArray(mountedVDOM) ? mountedVDOM : [mountedVDOM],
  });

  return vNode;
}

function generateComponentRouteKey(source: MountedSource, fallback: number): number | string {
  const key = (getIsComponentFactory(source) && source.props.key) || null;
  const formattedKey = !isEmpty(key) ? `[${key}]` : fallback;

  return formattedKey;
}

function flatVirtualDOM(
  mountedSource: MountedSource,
  mountedNodeRoute: Array<number>,
  mountedComponentRoute: Array<number | string>,
): VirtualDOM {
  let vNode: VirtualDOM = null;

  if (isArray(mountedSource)) {
    const list = [];
    const mountedSourceList = mountedSource as Array<MountedSource>;
    const last = mountedNodeRoute.slice(-1)[0];
    let shift = 0;

    for (let i = 0; i < mountedSourceList.length; i++) {
      const source = mountedSourceList[i];
      const nodeRoute = [...mountedNodeRoute.slice(0, -1), last + shift + i];
      const componentRouteKey = generateComponentRouteKey(source, i);
      const componentRoute = [...mountedComponentRoute, componentRouteKey];
      const mounted = mountVirtualDOM({
        mountedSource: source,
        mountedNodeRoute: nodeRoute,
        mountedComponentRoute: componentRoute,
      });

      if (isArray(mounted)) {
        shift += flatten(mounted).length - 1;
      }

      list.push(mounted);
    }

    vNode = flatten(list);
  } else if (getIsComponentFactory(mountedSource)) {
    vNode = mountVirtualDOM({ mountedSource, mountedNodeRoute, mountedComponentRoute });
  } else if (Boolean(mountedSource) && isVirtualNode(mountedSource)) {
    vNode = mountedSource;
    vNode.nodeRoute = [...mountedNodeRoute];
    vNode.componentRoute = [...mountedComponentRoute];

    const mountedSourceList = vNode.children as Array<MountedSource>;
    const list = [];
    let shift = 0;

    for (let i = 0; i < mountedSourceList.length; i++) {
      const source = mountedSourceList[i];
      const nodeRoute = [...mountedNodeRoute, shift + i];
      const componentRouteKey = generateComponentRouteKey(source, i);
      const componentRoute = [...mountedComponentRoute, componentRouteKey];
      const mounted = mountVirtualDOM({
        mountedSource: source,
        mountedNodeRoute: nodeRoute,
        mountedComponentRoute: componentRoute,
      });

      if (isArray(mounted)) {
        shift += flatten(mounted).length - 1;
      }

      list.push(mounted);
    }

    vNode.children = flatten(list);
  }

  return vNode;
}

type MountVirtualDOMOptions = {
  mountedSource: MountedSource;
  mountedNodeRoute?: Array<number>;
  mountedComponentRoute?: Array<number | string>;
  fromRoot?: boolean;
};

function mountVirtualDOM({
  mountedSource,
  mountedNodeRoute = [0],
  mountedComponentRoute = [0],
  fromRoot = false,
}: MountVirtualDOMOptions): VirtualDOM {
  let vNode: MountedSource = null;

  if (fromRoot) {
    vNode = wrapWithRoot(mountedSource, mountedNodeRoute, mountedComponentRoute);
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

    if (skipMount) {
      vNode = getComponentVirtualNodesById(componentId);
    } else {
      vNode = componentFactory.createElement();
      vNode = getEmptyVirtualNodeIfNodeNotExists(vNode as VirtualDOM, nodeRoute, mountedComponentRoute);

      if (!isEmpty(key) && getIsComponentFactory(vNode)) {
        vNode.props[ATTR_KEY] = key;
      }
    }

    resetHooks(componentId);

    vNode = isFunction(componentFactory.props[$$replaceNodeBeforeMountHook])
      ? componentFactory.props[$$replaceNodeBeforeMountHook](vNode, componentId, mountedNodeRoute, skipMount)
      : vNode;
    vNode = !skipMount ? flatVirtualDOM(vNode, nodeRoute, mountedComponentRoute) : vNode;

    vNode = isFunction(componentFactory.props[$$replaceNodeAfterMountHook])
      ? componentFactory.props[$$replaceNodeAfterMountHook](vNode, componentId)
      : vNode;

    if (!isEmpty(key) && !isArray(vNode) && !isEmpty(vNode)) {
      setAttribute(vNode as VirtualNode, ATTR_KEY, key);
    }

    const vNodes = isArray(vNode) ? vNode : [vNode];
    const mapNodeRoute = (vNode: VirtualNode) => vNode.nodeRoute;
    const nodeRoutes = vNodes.filter(Boolean).map(mapNodeRoute);

    setComponentNodeRoutesById(componentId, nodeRoutes);
    setComponentPropsById(componentId, componentFactory.props);
    !skipMount && linkComponentIdToParentComponent(componentId);
  } else if (Boolean(mountedSource)) {
    vNode = flatVirtualDOM(mountedSource, mountedNodeRoute, mountedComponentRoute);
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
  } else if (!vdom) {
    vdom = createVirtualEmptyNode();
    vdom.nodeRoute = nodeRoute;
    vdom.componentRoute = componentRoute;
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
