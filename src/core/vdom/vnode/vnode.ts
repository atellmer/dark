import { isArray, isEmpty, deepClone } from '@helpers';
import { ATTR_KEY } from '../../constants';
import { MountedSource } from '../mount';

type VirtualNodeType = 'TAG' | 'TEXT' | 'COMMENT';

export type VirtualNode = {
  isVirtualNode: boolean;
  type: VirtualNodeType;
  name?: string;
  isVoid?: boolean;
  attrs?: Record<string, string>;
  text?: string;
  children: Array<VirtualNode>;
  nodeRoute: Array<number>;
  componentRoute: Array<number | string>;
};

export type VirtualDOM = VirtualNode | Array<VirtualNode>;

export type RenderProps = (...args: any) => VirtualDOM;

export type ViewDefinition = {
  as: string;
  slot?: MountedSource | RenderProps;
  isVoid?: boolean;
  [prop: string]: any;
};

const EMPTY_NODE = 'dark:empty';

function createVirtualNode(type: VirtualNodeType, config: Partial<VirtualNode> = {}) {
  return {
    isVirtualNode: true,
    name: null,
    isVoid: false,
    attrs: {},
    text: '',
    children: [],
    nodeRoute: [],
    componentRoute: [],
    ...config,
    type,
  };
}

function createVirtualTagNode(config: Partial<VirtualNode>): VirtualNode {
  return createVirtualNode('TAG', config);
}

function createVirtualTextNode(text: string): VirtualNode {
  return createVirtualNode('TEXT', {
    isVoid: true,
    text,
  });
}

function createVirtualCommentNode(text: string): VirtualNode {
  return createVirtualNode('COMMENT', {
    isVoid: true,
    text,
  });
}

function createVirtualEmptyNode(): VirtualNode {
  return createVirtualCommentNode(EMPTY_NODE);
}

const Text = (str: string) => createVirtualTextNode(str);
const Comment = (str: string) => createVirtualCommentNode(str);
const View = (def: ViewDefinition) => {
  const { as, slot, isVoid = false, ...attrs } = def;

  return createVirtualTagNode({
    name: as,
    isVoid,
    attrs,
    children: (isVoid ? [] : isArray(slot) ? slot : [slot]) as Array<VirtualNode>,
  });
};

function isVirtualNode(o: any): o is VirtualNode {
  return o && o.isVirtualNode === true;
}

function isTagVirtualNode(vNode: VirtualNode): boolean {
  return vNode.type === 'TAG';
}

function isCommentVirtualNode(vNode: VirtualNode): boolean {
  return vNode.type === 'COMMENT';
}

function isEmptyVirtualNode(vNode: VirtualNode): boolean {
  return isCommentVirtualNode(vNode) && vNode.text === EMPTY_NODE;
}

function createAttribute(name: string, value: string | number | boolean) {
  return { [name]: value };
}

function getAttribute(vNode: VirtualNode, attrName: string): any {
  return vNode && vNode.type === 'TAG' && !isEmpty(vNode.attrs[attrName]) ? vNode.attrs[attrName] : undefined;
}

function setAttribute(vNode: VirtualNode, name: string, value: any) {
  vNode.type === 'TAG' && (vNode.attrs[name] = value);
}

function removeAttribute(vNode: VirtualNode, name: string) {
  vNode.type === 'TAG' && delete vNode.attrs[name];
}

function getNodeKey(vNode: VirtualNode): string {
  return getAttribute(vNode, ATTR_KEY);
}

function replaceVirtualNode(replacedVNode: VirtualNode, vdom: VirtualNode) {
  const nodeRoute = replacedVNode.nodeRoute;
  let vNode = vdom;

  for (let i = 1; i < nodeRoute.length; i++) {
    const routeId = nodeRoute[i];
    if (i === nodeRoute.length - 1) {
      vNode.children[routeId] = replacedVNode;
    } else {
      vNode = vNode.children[routeId];
    }
  }
}

function getVirtualNodeByRoute(vdom: VirtualNode, nodeRoute: number[] = []): VirtualNode {
  let vNode = vdom;

  for (let i = 0; i < nodeRoute.length; i++) {
    const routeId = nodeRoute[i];

    vNode = i === 0
      ? vNode
      : Boolean(vNode)
        ? vNode.children[routeId]
        : vNode;
  }

  return vNode;
}

function patchNodeRoutes(vNode: VirtualDOM, nodeRoute: Array<number>, fromRoot: boolean = false) {
  const vDOM = isArray(vNode) ? vNode : [vNode];
  if (vDOM.length === 0) return;
  const routeId = nodeRoute[nodeRoute.length - 1];

  for (let i = 0; i < vDOM.length; i++) {
    const vNode = vDOM[i];
    let isDifferent = false;

    if (fromRoot) {
      isDifferent = vNode.nodeRoute.slice(0, nodeRoute.length).toString() !== nodeRoute.toString();
      nodeRoute[nodeRoute.length - 1] = routeId + i;
    }

    if (isDifferent || !fromRoot) {
      vNode.nodeRoute.splice(0, nodeRoute.length, ...nodeRoute);
      patchNodeRoutes(vNode.children, nodeRoute);
    }
  }
}

function createRoot(componentRoute: Array<string | number>, nodeRoute: Array<number>, children: VirtualDOM): VirtualNode {
  return createVirtualNode('TAG', {
    name: 'root',
    componentRoute,
    nodeRoute,
    children: isArray(children) ? children : [children],
  });
}

function getLastRouteId(route: Array<number>) {
  return route.slice(-1)[0];
}

export {
  createVirtualNode,
  createVirtualTextNode,
  createVirtualCommentNode,
  createVirtualEmptyNode,
  Text,
  Comment,
  View,
  EMPTY_NODE,
  isTagVirtualNode,
  createAttribute,
  getAttribute,
  setAttribute,
  removeAttribute,
  getNodeKey,
  isVirtualNode,
  isCommentVirtualNode,
  isEmptyVirtualNode,
  replaceVirtualNode,
  getVirtualNodeByRoute,
  patchNodeRoutes,
  createRoot,
  getLastRouteId,
};
