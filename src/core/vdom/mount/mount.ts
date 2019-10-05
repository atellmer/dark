import { flatten, isArray } from '@helpers';
import { getIsStatelessComponentFactory, StatelessComponentFactoryType } from '../../component';
import { createVirtualEmptyNode, VirtualNode } from '../vnode/vnode';

function mount(
  element: VirtualNode | StatelessComponentFactoryType | null | undefined,
): VirtualNode | Array<VirtualNode> {
  const isStatelessComponentFactory = getIsStatelessComponentFactory(element);
  const statelessFactory = element as StatelessComponentFactoryType;
  let vNode = null;

  if (isStatelessComponentFactory) {
    vNode = statelessFactory.createElement();

    if (isArray(vNode)) {
      vNode = flatten(vNode.map(mount));
    } else if (Boolean(vNode)) {
      vNode.children = flatten(vNode.children.map(mount));
    }
  } else if (Boolean(element)) {
    vNode = element;

    if (isArray(vNode)) {
      vNode = flatten(vNode.map(mount));
    } else if (Boolean(vNode)) {
      vNode.children = flatten(vNode.children.map(mount));
    }
  }

  if (!vNode) {
    vNode = createVirtualEmptyNode();
  }

  return vNode;
}

export {
  mount, //
};
