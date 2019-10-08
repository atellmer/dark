import { flatten, isArray } from '@helpers';
import { getIsStatelessComponentFactory, StatelessComponentFactory } from '../../component';
import { createVirtualEmptyNode, VirtualNode } from '../vnode/vnode';

function mountVirtualDOM(
  element: VirtualNode | StatelessComponentFactory | null | undefined,
): VirtualNode | Array<VirtualNode> {
  const isStatelessComponentFactory = getIsStatelessComponentFactory(element);
  const statelessFactory = element as StatelessComponentFactory;
  let vNode = null;

  if (isStatelessComponentFactory) {
    vNode = statelessFactory.createElement();

    if (isArray(vNode)) {
      vNode = flatten(vNode.map(mountVirtualDOM));
    } else if (Boolean(vNode)) {
      vNode.children = flatten(vNode.children.map(mountVirtualDOM));
    }
  } else if (Boolean(element)) {
    vNode = element;

    if (isArray(vNode)) {
      vNode = flatten(vNode.map(mountVirtualDOM));
    } else if (Boolean(vNode)) {
      vNode.children = flatten(vNode.children.map(mountVirtualDOM));
    }
  }

  if (!vNode) {
    vNode = createVirtualEmptyNode();
  }

  return vNode;
}

export {
  mountVirtualDOM, //
};
