import { deepClone, flatten, isArray, isNull } from '@helpers';
import { getIsStatelessComponentFactory, StatelessComponentFactory } from '../../component';
import { isFragment } from '../../fragment';
import { createVirtualEmptyNode, createVirtualNode, isVirtualNode, VirtualDOM, VirtualNode } from '../vnode/vnode';

function wrapWithRoot(
  sourceVNode: VirtualNode | Array<VirtualNode> | StatelessComponentFactory | null | undefined,
  currRoute: Array<number>,
): VirtualNode {
  let vNode = null;

  if (isNull(sourceVNode)) {
    sourceVNode = createVirtualEmptyNode();
  }

  const mountedVDOM = mountVirtualDOM(sourceVNode, [...currRoute, 0]);

  vNode = createVirtualNode('TAG', {
    name: 'root',
    route: [...currRoute],
    children: isArray(mountedVDOM) ? mountedVDOM : [mountedVDOM],
  });

  return vNode;
}

function flatVirtualDOM(element: VirtualDOM, currRoute: Array<number>): VirtualDOM {
  let vNode = element;

  if (isArray(vNode)) {
    let shift = 0;
    const last = currRoute.slice(-1)[0];
    const list = vNode.map((n, idx) => {
      const route = [...currRoute.slice(0, -1), last + shift + idx];
      const mounted = mountVirtualDOM(n, route);

      if (isArray(mounted)) {
        shift += flatten(mounted).length - 1;
      }

      return mounted;
    });

    vNode = flatten(list);
  } else if (getIsStatelessComponentFactory(vNode)) {
    vNode = mountVirtualDOM(vNode, currRoute);
  } else if (Boolean(vNode)) {
    if (isVirtualNode(vNode)) {
      vNode.route = [...currRoute];
    }

    let shift = 0;
    const list = vNode.children.map((n, idx) => {
      const route = [...currRoute, shift + idx];
      const mounted = mountVirtualDOM(n, route);

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
  currRoute: Array<number>,
  fromRoot: boolean = false,
): VirtualDOM {
  const isStatelessComponentFactory = getIsStatelessComponentFactory(element);
  const statelessFactory = element as StatelessComponentFactory;
  let vNode = null;

  if (fromRoot) {
    vNode = wrapWithRoot(element, currRoute);
  } else if (isStatelessComponentFactory) {
    vNode = statelessFactory.createElement();
    vNode = flatVirtualDOM(vNode, currRoute);
  } else if (Boolean(element)) {
    vNode = element;
    vNode = flatVirtualDOM(vNode, currRoute);
  }

  if (!vNode) {
    vNode = createVirtualEmptyNode();
    vNode.route = currRoute;
  }

  return vNode;
}

export {
  mountVirtualDOM, //
};
