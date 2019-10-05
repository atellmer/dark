type VirtualNodeType = 'TAG' | 'TEXT' | 'COMMENT';

export type VirtualNode = {
  isVirtualNode: boolean;
  type: VirtualNodeType;
  id: string;
  name?: string;
  isVoid?: boolean;
  attrs?: Record<string, string>;
  text?: string;
  children: Array<VirtualNode>;
  route: Array<number>;
};

export type ViewDefinition = {
  as: string;
  children?: Array<any>;
  isVoid?: boolean;
  [prop: string]: any;
};

const EMPTY_NODE = 'dark:empty';

function createVirtualNode(type: VirtualNodeType, config: Partial<VirtualNode> = {}) {
  return {
    isVirtualNode: true,
    id: '',
    name: null,
    isVoid: false,
    attrs: {},
    text: '',
    children: [],
    route: [],
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
  const { as, children, isVoid = false, ...rest } = def;

  return createVirtualTagNode({
    name: as,
    isVoid,
    attrs: { ...rest },
    children: isVoid ? [] : (children || []),
  });
}

export {
  createVirtualNode,
  createVirtualTextNode,
  createVirtualEmptyNode,
  createVirtualCommentNode,
  Text,
  Comment,
  View,
  EMPTY_NODE,
}
