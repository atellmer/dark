import { deepClone, flatten, isArray, isNull } from '@helpers';
import { getIsStatelessComponentFactory, StatelessComponentFactory } from '../../component';
import { isFragment } from '../../fragment';
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

  const mountedVDOM = mountVirtualDOM(sourceVNode, [...mountedNodeRoute, 0], [...mountedComponentRoute, 0]);

  vNode = createVirtualNode('TAG', {
    name: 'root',
    route: [...mountedNodeRoute],
    componentRoute: [...mountedComponentRoute],
    children: isArray(mountedVDOM) ? mountedVDOM : [mountedVDOM],
  });

  return vNode;
}

function flatVirtualDOM(element: VirtualDOM, mountedNodeRoute: Array<number>, mountedComponentRoute: Array<number>): VirtualDOM {
  let vNode = element;

  if (isArray(vNode)) {
    let shift = 0;
    let cmpShift = 0;
    const last = mountedNodeRoute.slice(-1)[0];
    const cmpLast = mountedComponentRoute.slice(-1)[0];
    const list = vNode.map((n, idx) => {
      const route = [...mountedNodeRoute.slice(0, -1), last + shift + idx];
      const componentRoute = [...mountedComponentRoute.slice(0, -1), cmpLast + cmpShift, idx];
      const mounted = mountVirtualDOM(n, route, componentRoute);

      cmpShift = getIsStatelessComponentFactory(vNode[idx + 1]) ? cmpShift + 1 : cmpShift;
      if (isArray(mounted)) {
        shift += flatten(mounted).length - 1;
      }

      return mounted;
    });

    vNode = flatten(list);
  } else if (getIsStatelessComponentFactory(vNode)) {
    vNode = mountVirtualDOM(vNode, mountedNodeRoute, mountedComponentRoute);
  } else if (Boolean(vNode)) {
    if (isVirtualNode(vNode)) {
      vNode.route = [...mountedNodeRoute];
      vNode.componentRoute = [...mountedComponentRoute];
      vNode.id = '';
    }

    let shift = 0;
    let cmpShift = 0;
    const list = vNode.children.map((n, idx) => {
      const route = [...mountedNodeRoute, shift + idx];
      const componentRoute = [...mountedComponentRoute, cmpShift + idx];
      const mounted = mountVirtualDOM(n, route, componentRoute);

      if (isArray(n)) {
        const length = flatten(n.filter(n => getIsStatelessComponentFactory(n))).length;
        cmpShift += (length > 0 ? length - 1 : 0);
      }

      if (isArray(mounted)) {
        shift += flatten(mounted).length - 1;
      }

      return mounted;
    });

    vNode.children = flatten(list);
  }

  return vNode;
}

function mountVirtualDOM(
  element: VirtualDOM | StatelessComponentFactory | null | undefined,
  mountedNodeRoute: Array<number>,
  mountedComponentRoute: Array<number>,
  fromRoot: boolean = false,
): VirtualDOM {
  const isStatelessComponentFactory = getIsStatelessComponentFactory(element);
  const statelessFactory = element as StatelessComponentFactory;
  let vNode = null;

  if (fromRoot) {
    vNode = wrapWithRoot(element, mountedNodeRoute, mountedComponentRoute);
  } else if (isStatelessComponentFactory) {
    const componentRoute = [...mountedComponentRoute, 0];
    // console.log('componentRoute', componentRoute);
    // console.log('fc', statelessFactory);
    
    vNode = statelessFactory.createElement();
    vNode = flatVirtualDOM(vNode, mountedNodeRoute, componentRoute);
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
