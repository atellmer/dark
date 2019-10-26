import { isArray, isEmpty } from '@helpers';
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
  componentRoute: Array<number>;
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
  return createVirtualNode('TAG', { ...config });
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
  const { as, slot, isVoid = false, ...rest } = def;

  return createVirtualTagNode({
    name: as,
    isVoid,
    attrs: { ...rest },
    children: (isVoid ? [] : isArray(slot) ? slot : [slot]) as Array<VirtualNode>,
  });
};

function isVirtualNode(o: any): o is VirtualNode {
  return o && o.isVirtualNode === true;
}

function isTagVirtualNode(vNode: VirtualNode): boolean {
  return vNode.type === 'TAG';
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
};
