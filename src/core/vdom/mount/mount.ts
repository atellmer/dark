import { flatten, isArray, isNull, isFunction } from '@helpers';
import { getIsStatelessComponentFactory, StatelessComponentFactory, $$renderHook, $$nodeRouteHook } from '../../component';
import { createVirtualEmptyNode, createVirtualNode, isVirtualNode, VirtualDOM, VirtualNode } from '../vnode/vnode';

function wrapWithRoot(
  sourceVNode: VirtualNode | Array<VirtualNode> | StatelessComponentFactory | null | undefined,
  mountedNodeRoute: Array<number>,
  mountedComponentRoute: Array<number>,
): VirtualNode {
  let vNode = null;

  if (isNull(sourceVNode)) {
    sourceVNode = createVirtualEmptyNode();
  }

  const mountedVDOM = mountVirtualDOM({
    element: sourceVNode,
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

function flatVirtualDOM(element: VirtualDOM, mountedNodeRoute: Array<number>, mountedComponentRoute: Array<number>): VirtualDOM {
  let vNode = element;

  if (isArray(vNode)) {
    let shift = 0;
    const last = mountedNodeRoute.slice(-1)[0];
    const list = vNode.map((element, idx) => {
      const nodeRoute = [...mountedNodeRoute.slice(0, -1), last + shift + idx];
      const componentRoute = [...mountedComponentRoute, idx];
      const mounted = mountVirtualDOM({
        element,
        mountedNodeRoute: nodeRoute,
        mountedComponentRoute: componentRoute,
      });

      if (isArray(mounted)) {
        shift += flatten(mounted).length - 1;
      }

      return mounted;
    });

    vNode = flatten(list);
  } else if (getIsStatelessComponentFactory(vNode)) {
    vNode = mountVirtualDOM({ element: vNode, mountedNodeRoute, mountedComponentRoute });
  } else if (Boolean(vNode)) {
    if (isVirtualNode(vNode)) {
      vNode.nodeRoute = [...mountedNodeRoute];
      vNode.componentRoute = [...mountedComponentRoute];
    }

    let shift = 0;
    const list = vNode.children.map((element, idx) => {
      const nodeRoute = [...mountedNodeRoute, shift + idx];
      const componentRoute = [...mountedComponentRoute, idx];
      const mounted = mountVirtualDOM({
        element,
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
  element: VirtualDOM | StatelessComponentFactory | null | undefined;
  mountedNodeRoute?: Array<number>;
  mountedComponentRoute?: Array<number>;
  fromRoot?: boolean;
}

function mountVirtualDOM({
  element, mountedNodeRoute = [0], mountedComponentRoute = [0], fromRoot = false }: MountVirtualDOMOptions): VirtualDOM {
  const isComponentFactory = getIsStatelessComponentFactory(element);
  const componentFactory = element as StatelessComponentFactory;
  let vNode = null;

  if (fromRoot) {
    vNode = wrapWithRoot(element, mountedNodeRoute, mountedComponentRoute);
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
  } else if (Boolean(element)) {
    vNode = element;
    vNode = flatVirtualDOM(vNode, mountedNodeRoute, mountedComponentRoute);
  }

  if (!vNode) {
    vNode = createVirtualEmptyNode();
    vNode.route = mountedNodeRoute;
    vNode.componentRoute = mountedComponentRoute;
  }

  return vNode;
}

export {
  mountVirtualDOM, //
};
