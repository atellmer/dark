import { isEmpty, isFunction } from '@helpers';
import { ATTR_KEY } from '../../constants';
import { createAttribute, getNodeKey, isTagVirtualNode, VirtualNode } from '../vnode';

const ADD_NODE = 'ADD_NODE';
const REMOVE_NODE = 'REMOVE_NODE';
const REPLACE_NODE = 'REPLACE_NODE';
const ADD_ATTRIBUTE = 'ADD_ATTRIBUTE';
const REMOVE_ATTRIBUTE = 'REMOVE_ATTRIBUTE';
const REPLACE_ATTRIBUTE = 'REPLACE_ATTRIBUTE';

export type VirtualDOMActions =
  | 'ADD_NODE'
  | 'REMOVE_NODE'
  | 'REPLACE_NODE'
  | 'ADD_ATTRIBUTE'
  | 'REMOVE_ATTRIBUTE'
  | 'REPLACE_ATTRIBUTE';

export type Diff = {
  action: VirtualDOMActions;
  route: Array<number>;
  oldValue: VirtualNode | Record<string, number | string | boolean>;
  nextValue: VirtualNode | Record<string, number | string | boolean>;
};

const createDiffAction = (
  action: VirtualDOMActions,
  route: Array<number> = [],
  oldValue: any,
  nextValue: any,
): Diff => ({
  action,
  route,
  oldValue,
  nextValue,
});

function mapPrevAttributes(attrName: string, vNode: VirtualNode, nextVNode: VirtualNode, diff: Array<Diff>) {
  if (attrName === ATTR_KEY) return;
  if (isEmpty(nextVNode.attrs[attrName])) {
    diff.push(
      createDiffAction(REMOVE_ATTRIBUTE, nextVNode.nodeRoute, createAttribute(attrName, vNode.attrs[attrName]), null),
    );
  } else if (nextVNode.attrs[attrName] !== vNode.attrs[attrName] && !isFunction(nextVNode.attrs[attrName])) {
    const diffAction = createDiffAction(
      REPLACE_ATTRIBUTE,
      nextVNode.nodeRoute,
      createAttribute(attrName, vNode.attrs[attrName]),
      createAttribute(attrName, nextVNode.attrs[attrName]),
    );

    diff.push(diffAction);
  }
}

function mapNewAttributes(attrName: string, vNode: VirtualNode, nextVNode: VirtualNode, diff: Array<Diff>) {
  if (attrName === ATTR_KEY) return;
  if (isEmpty(vNode.attrs[attrName]) && !isFunction(nextVNode.attrs[attrName])) {
    diff.push(
      createDiffAction(ADD_ATTRIBUTE, nextVNode.nodeRoute, null, createAttribute(attrName, nextVNode.attrs[attrName])),
    );
  }
}

function iterateNodes(vNode: VirtualNode, nextVNode: VirtualNode, diff: Array<Diff>) {
  const iterations = Math.max(vNode.children.length, nextVNode.children.length);
  const diffCount = vNode.children.length - nextVNode.children.length;
  let shift = 0;

  for (let i = 0; i < iterations; i++) {
    const childVNode = vNode.children[i];
    const childNextVNode = nextVNode.children[i - shift];
    const key = getNodeKey(childVNode);
    const nextKey = getNodeKey(childNextVNode);
    const isRemovingNodeByKey = shift < diffCount && !isEmpty(key) && !isEmpty(nextKey) && key !== nextKey;

    diff = getDiff(childVNode, childNextVNode, diff, isRemovingNodeByKey);

    if (isRemovingNodeByKey) {
      shift++;
    }
  }

  return diff;
}

function getDiff(
  vNode: VirtualNode,
  nextVNode: VirtualNode,
  prevDiff: Array<Diff> = [],
  isRemovingNodeByKey = false,
): Array<Diff> {
  if (!vNode && !nextVNode) return prevDiff;
  let diff = [...prevDiff];
  const key = getNodeKey(vNode);
  const nextKey = getNodeKey(nextVNode);

  if (!vNode) {
    diff.push(createDiffAction(ADD_NODE, nextVNode.nodeRoute, null, nextVNode));
    return diff;
  }

  if (!nextVNode || isRemovingNodeByKey) {
    diff.push(createDiffAction(REMOVE_NODE, vNode.nodeRoute, vNode, null));
    return diff;
  }

  if (
    key !== nextKey ||
    vNode.type !== nextVNode.type ||
    vNode.name !== nextVNode.name ||
    vNode.text !== nextVNode.text
  ) {
    diff.push(createDiffAction(REPLACE_NODE, nextVNode.nodeRoute, vNode, nextVNode));
    return diff;
  }

  if (isTagVirtualNode(vNode)) {
    const prevAttrs = Object.keys(vNode.attrs);
    const newAttrs = Object.keys(nextVNode.attrs);

    for (const attrName of prevAttrs) {
      mapPrevAttributes(attrName, vNode, nextVNode, diff);
    }
    for (const attrName of newAttrs) {
      mapNewAttributes(attrName, vNode, nextVNode, diff);
    }
  }

  diff = iterateNodes(vNode, nextVNode, diff);

  return diff;
}

export {
  ADD_NODE, //
  REMOVE_NODE,
  REPLACE_NODE,
  ADD_ATTRIBUTE,
  REMOVE_ATTRIBUTE,
  REPLACE_ATTRIBUTE,
  getDiff,
};
