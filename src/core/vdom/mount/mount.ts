import { flatten, isArray, isNull, isFunction } from '@helpers';
import { getIsComponentFactory, ComponentFactory, $$renderHook, $$nodeRouteHook } from '../../component';
import { createVirtualEmptyNode, createVirtualNode, isVirtualNode, VirtualDOM, VirtualNode } from '../vnode/vnode';

export type MountedSource = VirtualDOM | ComponentFactory | Array<ComponentFactory> | null | undefined;

function wrapWithRoot(
  mountedSource: MountedSource,
  mountedNodeRoute: Array<number>,
  mountedComponentRoute: Array<number>,
): VirtualNode {
  let vNode = null;

  if (isNull(mountedSource)) {
    mountedSource = createVirtualEmptyNode();
  }

  const mountedVDOM = mountVirtualDOM({
    mountedSource,
    mountedNodeRoute: [...mountedNodeRoute, 0],
    mountedComponentRoute: [...mountedComponentRoute, 0],
  });

  vNode = createVirtualNode('TAG', {
    name: 'root',
    nodeRoute: [...mountedNodeRoute],
    componentRoute: [...mountedComponentRoute],
    children: isArray(mountedVDOM) ? mountedVDOM : [mountedVDOM],
  });

  return vNode;
}

function flatVirtualDOM(mountedSource: MountedSource, mountedNodeRoute: Array<number>, mountedComponentRoute: Array<number>): VirtualDOM {
  let vNode: VirtualDOM = null;

  if (isArray(mountedSource)) {
    let shift = 0;
    const last = mountedNodeRoute.slice(-1)[0];
    const list = (mountedSource as Array<MountedSource>).map((source, idx) => {
      const nodeRoute = [...mountedNodeRoute.slice(0, -1), last + shift + idx];
      const componentRoute = [...mountedComponentRoute, idx];
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
      const componentRoute = [...mountedComponentRoute, idx];
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
  mountedComponentRoute?: Array<number>;
  fromRoot?: boolean;
}

function mountVirtualDOM({
  mountedSource, mountedNodeRoute = [0], mountedComponentRoute = [0], fromRoot = false }: MountVirtualDOMOptions): VirtualDOM {
  const isComponentFactory = getIsComponentFactory(mountedSource);
  const componentFactory = mountedSource as ComponentFactory;
  let vNode: VirtualDOM = null;

  if (fromRoot) {
    vNode = wrapWithRoot(mountedSource, mountedNodeRoute, mountedComponentRoute);
  } else if (isComponentFactory) {
    mountedComponentRoute.push(-1);
    vNode = componentFactory.createElement();
    const nodeRoute = isFunction(componentFactory.props[$$nodeRouteHook])
      ? componentFactory.props[$$nodeRouteHook](mountedNodeRoute)
      : mountedNodeRoute;
    vNode = flatVirtualDOM(vNode, nodeRoute, mountedComponentRoute);
    if (isFunction(componentFactory.props[$$renderHook])) {
      const skipMount = componentFactory.props[$$renderHook](vNode);
      if (skipMount) {
        vNode = null;
      }
    }
  } else if (Boolean(mountedSource)) {
    vNode = flatVirtualDOM(mountedSource, mountedNodeRoute, mountedComponentRoute);
  }

  if (!vNode) {
    vNode = createVirtualEmptyNode();
    vNode.nodeRoute = mountedNodeRoute;
    vNode.componentRoute = mountedComponentRoute;
  }

  return vNode;
}

export {
  mountVirtualDOM, //
};
