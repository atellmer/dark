import { flatten, isArray, isNull, isFunction, isEmpty } from '@helpers';
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
  setComponentVirtualNodesById,
  getComponentVirtualNodesById,
  setComponentPropsById,
} from '../../scope';
import { ATTR_KEY } from '../../constants';

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
    let shift = 0;
    const last = mountedNodeRoute.slice(-1)[0];
    const list = (mountedSource as Array<MountedSource>).map((source, idx) => {
      const nodeRoute = [...mountedNodeRoute.slice(0, -1), last + shift + idx];
      const componentRouteKey = generateComponentRouteKey(source, idx);
      const componentRoute = [...mountedComponentRoute, componentRouteKey];
      const mounted = mountVirtualDOM({
        mountedSource: source,
        mountedNodeRoute: nodeRoute,
        mountedComponentRoute: componentRoute,
      });

      if (isArray(mounted)) {
        shift += flatten(mounted).length - 1;
      }

      return mounted;
    });

    vNode = flatten(list);
  } else if (getIsComponentFactory(mountedSource)) {
    vNode = mountVirtualDOM({ mountedSource, mountedNodeRoute, mountedComponentRoute });
  } else if (Boolean(mountedSource) && isVirtualNode(mountedSource)) {
    vNode = mountedSource;
    vNode.nodeRoute = [...mountedNodeRoute];
    vNode.componentRoute = [...mountedComponentRoute];

    let shift = 0;
    const list = (vNode.children as Array<MountedSource>).map((source, idx) => {
      const nodeRoute = [...mountedNodeRoute, shift + idx];
      const componentRouteKey = generateComponentRouteKey(source, idx);
      const componentRoute = [...mountedComponentRoute, componentRouteKey];
      const mounted = mountVirtualDOM({
        mountedSource: source,
        mountedNodeRoute: nodeRoute,
        mountedComponentRoute: componentRoute,
      });

      if (isArray(mounted)) {
        shift += flatten(mounted).length - 1;
      }

      return mounted;
    });

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
    mountedComponentRoute.push(-1);
    const componentId = mountedComponentRoute.join('.');
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

    if (isArray(vNode) && !vNode[0]) {
      vNode = createVirtualEmptyNode();
      vNode.nodeRoute = nodeRoute;
      vNode.componentRoute = mountedComponentRoute;
    }

    setComponentVirtualNodesById(componentId, vNode as VirtualNode);
    setComponentPropsById(componentId, componentFactory.props);
  } else if (Boolean(mountedSource)) {
    vNode = flatVirtualDOM(mountedSource, mountedNodeRoute, mountedComponentRoute);
  }

  if (!vNode) {
    vNode = createVirtualEmptyNode();
    vNode.nodeRoute = mountedNodeRoute;
    vNode.componentRoute = mountedComponentRoute;
  }

  return vNode as VirtualDOM;
}

export {
  mountVirtualDOM,
  $$replaceNodeBeforeMountHook,
  $$replaceNodeAfterMountHook,
  $$skipNodeMountHook,
  $$nodeRouteHook,
};
