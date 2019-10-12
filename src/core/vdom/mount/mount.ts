import { flatten, isArray } from '@helpers';
import { getIsStatelessComponentFactory, StatelessComponentFactory } from '../../component';
import { createVirtualEmptyNode, VirtualNode } from '../vnode/vnode';


type VirtualDOM = VirtualNode | Array<VirtualNode>;

function flatVirtualDOM(
  vNode: VirtualDOM,
  mount: (element: VirtualNode | StatelessComponentFactory | null | undefined) => VirtualDOM): VirtualDOM {
  let flatVNode = vNode;

  if (isArray(flatVNode)) {
    flatVNode = flatten(flatVNode.map(mount));
  } else if (getIsStatelessComponentFactory(flatVNode)) {
    flatVNode = mount(flatVNode);
  } else if (Boolean(flatVNode)) {
    flatVNode.children = flatten(flatVNode.children.map(mount));
  }

  return flatVNode;
}

function mountVirtualDOM(element: VirtualNode | StatelessComponentFactory | null | undefined): VirtualDOM {
  const isStatelessComponentFactory = getIsStatelessComponentFactory(element);
  const statelessFactory = element as StatelessComponentFactory;
  let vNode = null;

  if (isStatelessComponentFactory) {
    vNode = statelessFactory.createElement();
    vNode = flatVirtualDOM(vNode, mountVirtualDOM);
  } else if (Boolean(element)) {
    vNode = element;
    vNode = flatVirtualDOM(vNode, mountVirtualDOM);
  }

  if (!vNode) {
    vNode = createVirtualEmptyNode();
  }

  return vNode;
}

export {
  mountVirtualDOM, //
};
