type VirtualNodeType = 'TAG' | 'TEXT' | 'COMMENT';

export type VirtualNode = {
  isVirtualNode: boolean;
  type: VirtualNodeType;
  id: string;
  name?: string;
  isVoid?: boolean;
  attrs?: Record<string, string>;
  children: Array<string | VirtualNode>;
  props?: any;
  route: Array<number>;
};

export type ViewDefinition = {
  as: string;
  child?: any;
  children?: Array<any>;
  isVoid?: boolean;
  [prop: string]: any;
};

function createVirtualNode(type: VirtualNodeType, config: Partial<VirtualNode> = {}) {
  return {
    isVirtualNode: true,
    id: '',
    name: null,
    isVoid: false,
    attrs: {},
    children: [],
    props: {},
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
    children: [text],
  });
}

function createVirtualCommentNode(text: string): VirtualNode {
  return createVirtualNode('COMMENT', {
    isVoid: true,
    children: [text],
  });
}

const Text = (str: string) => createVirtualTextNode(str);
const Comment = (str: string) => createVirtualCommentNode(str);
const View = (def: ViewDefinition) => {
  const { as, child, children, isVoid = false, ...rest } = def;

  return createVirtualTagNode({
    name: as,
    isVoid,
    attrs: { ...rest },
    children: (child ? [child] : children) || [],
  });
}

export {
  createVirtualNode,
  createVirtualTextNode,
  createVirtualCommentNode,
  Text,
  Comment,
  View,
}
