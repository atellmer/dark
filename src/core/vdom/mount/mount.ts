import { flatten, isArray, isNull } from '@helpers';
import { getIsStatelessComponentFactory, StatelessComponentFactory } from '../../component';
import { createVirtualEmptyNode, createVirtualNode, VirtualDOM, VirtualNode } from '../vnode/vnode';

function wrapWithRoot(
  sourceVNode: VirtualNode | Array<VirtualNode> | StatelessComponentFactory | null | undefined,
): VirtualNode {
  let vNode = null;

  if (isNull(sourceVNode)) {
    sourceVNode = createVirtualEmptyNode();
  }

  const mountedVDOM = mountVirtualDOM(sourceVNode);

  vNode = createVirtualNode('TAG', {
    name: 'root',
    children: isArray(mountedVDOM) ? mountedVDOM : [mountedVDOM],
  });

  return vNode;
}

function flatVirtualDOM(
  vNode: VirtualDOM,
  mount: (element: VirtualNode | StatelessComponentFactory | null | undefined) => VirtualDOM,
): VirtualDOM {
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

function mountVirtualDOM(
  element: VirtualNode | Array<VirtualNode> | StatelessComponentFactory | null | undefined,
  fromRoot: boolean = false,
): VirtualDOM {
  const isStatelessComponentFactory = getIsStatelessComponentFactory(element);
  const statelessFactory = element as StatelessComponentFactory;
  let vNode = null;

  if (fromRoot) {
    vNode = wrapWithRoot(element);
  } else if (isStatelessComponentFactory) {
    vNode = statelessFactory.createElement();
    vNode = flatVirtualDOM(vNode, el => mountVirtualDOM(el));
  } else if (Boolean(element)) {
    vNode = element;
    vNode = flatVirtualDOM(vNode, el => mountVirtualDOM(el));
  }

  if (!vNode) {
    vNode = createVirtualEmptyNode();
  }

  return vNode;
}

export {
  mountVirtualDOM, //
};
