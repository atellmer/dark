import { isEmpty, isFunction } from '@helpers';
import { ATTR_KEY } from '../../constants';
import { createAttribute, getNodeKey, VirtualNode } from '../vnode';

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

export type VirtualDOMDiff = {
  action: VirtualDOMActions;
  route: Array<number>;
  oldValue: VirtualNode | Record<string, number | string | boolean>;
  nextValue: VirtualNode | Record<string, number | string | boolean>;
};

const createDiffAction = (action: VirtualDOMActions, route: Array<number> = [], oldValue: any, nextValue: any): VirtualDOMDiff => ({
  action,
  route,
  oldValue,
  nextValue,
});

function getVirtualDOMDiff(
  vdom: VirtualNode,
  nextVDOM: VirtualNode,
  prevDiff: Array<VirtualDOMDiff> = [],
  prevRoute: Array<number> = [],
  level: number = 0,
  idx: number = 0,
): Array<VirtualDOMDiff> {
  let diff = [...prevDiff];
  const route = [...prevRoute];
  const key = getNodeKey(vdom);
  const nextKey = getNodeKey(nextVDOM);

  route[level] = idx;

  if (!vdom && !nextVDOM) return diff;

  if (!vdom) {
    diff.push(createDiffAction(ADD_NODE, route, null, nextVDOM));
    return diff;
  } else if (!nextVDOM || (!isEmpty(key) && !isEmpty(nextKey) && key !== nextKey)) {
    diff.push(createDiffAction(REMOVE_NODE, route, vdom, null));
    return diff;
  } else if (
    vdom.type !== nextVDOM.type ||
    vdom.name !== nextVDOM.name ||
    vdom.text !== nextVDOM.text ||
    key !== nextKey
  ) {
    diff.push(createDiffAction(REPLACE_NODE, route, vdom, nextVDOM));
    return diff;
  } else {
    if (vdom.attrs && nextVDOM.attrs) {
      const mapOldAttr = (attrName: string) => {
        if (attrName === ATTR_KEY) return;
        if (isEmpty(nextVDOM.attrs[attrName])) {
          diff.push(createDiffAction(REMOVE_ATTRIBUTE, route, createAttribute(attrName, vdom.attrs[attrName]), null));
        } else if (nextVDOM.attrs[attrName] !== vdom.attrs[attrName] && !isFunction(nextVDOM.attrs[attrName])) {
          const diffAction = createDiffAction(
            REPLACE_ATTRIBUTE,
            route,
            createAttribute(attrName, vdom.attrs[attrName]),
            createAttribute(attrName, nextVDOM.attrs[attrName]),
          );

          diff.push(diffAction);
        }
      };
      const mapNewAttr = (attrName: string) => {
        if (attrName === ATTR_KEY) return;
        if (isEmpty(vdom.attrs[attrName]) && !isFunction(nextVDOM.attrs[attrName])) {
          diff.push(createDiffAction(ADD_ATTRIBUTE, route, null, createAttribute(attrName, nextVDOM.attrs[attrName])));
        }
      };

      Object.keys(vdom.attrs).forEach(mapOldAttr);
      Object.keys(nextVDOM.attrs).forEach(mapNewAttr);
    }

    level++;

    const iterateVDOM = (vNode: VirtualNode, nextVNode: VirtualNode) => {
      const iterations = Math.max(vNode.children.length, nextVNode.children.length);

      for (let i = 0; i < iterations; i++) {
        const childVNode = vdom.children[i];
        const childNextVNode = nextVDOM.children[i];
        const key = getNodeKey(childVNode);
        const nextKey = getNodeKey(childNextVNode);

        if (childVNode && childVNode.processed) continue;

        diff = [...getVirtualDOMDiff(childVNode, childNextVNode, diff, route, level, i)];

        childVNode && (childVNode.processed = true);

        if (!isEmpty(key) && !isEmpty(nextKey) && key !== nextKey) {
          vdom.children.splice(i, 1);
          iterateVDOM(vdom, nextVDOM);
          break;
        }
      }
    };

    iterateVDOM(vdom, nextVDOM);
  }

  return diff;
}

export {
  ADD_NODE, //
  REMOVE_NODE,
  REPLACE_NODE,
  ADD_ATTRIBUTE,
  REMOVE_ATTRIBUTE,
  REPLACE_ATTRIBUTE,
  getVirtualDOMDiff,
};
