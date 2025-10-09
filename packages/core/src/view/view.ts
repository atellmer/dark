import { type Component, detectIsComponent } from '../component';
import type { ElementKey, DarkElement, Instance, SlotProps, RefProps, KeyProps } from '../shared';
import { detectIsArray, detectIsEmpty } from '../utils';
import { REPLACER, KEY_ATTR } from '../constants';
import { $$scope } from '../scope';

const $$vNode = Symbol('vNode');
const PROP_PROPS = 'props';
const PROP_ATTRS = 'attrs';
const PROP_NAME = 'name';
const PROP_TYPE = 'type';
const PROP_CHILDREN = 'children';

class VirtualNode {
  type: NodeType = null;

  constructor(type: NodeType) {
    this.type = type;
  }
}

class TagVirtualNode extends VirtualNode {
  name: string;
  attrs: Record<string, any>;
  children: Array<Instance>;

  constructor(name: string, attrs: TagVirtualNode['attrs'], children: TagVirtualNode['children']) {
    super(NodeType.TAG);
    this.name = name;
    this.attrs = attrs;
    this.children = children;
  }
}

class TextVirtualNode extends VirtualNode {
  value: string;

  constructor(source: TextSource) {
    super(NodeType.TEXT);
    this.value = String(source);
  }
}

class CommentVirtualNode extends VirtualNode {
  value = '';

  constructor(text: string) {
    super(NodeType.COMMENT);
    this.value = text;
  }
}

const View = (options: ViewOptions) => {
  const factory: TagVirtualNodeFactory = () => {
    const { as: name, slot, _void = false, ...attrs } = options;
    const children = (
      _void ? [] : detectIsArray(slot) ? slot : !detectIsEmpty(slot) ? [slot] : []
    ) as TagVirtualNode['children'];

    return new TagVirtualNode(name, attrs, children);
  };

  factory[$$vNode] = true;
  factory[PROP_TYPE] = options.as;
  factory[KEY_ATTR] = options.key;

  return factory;
};

const Text = (source: TextSource) => new TextVirtualNode(source);

Text.from = (x: unknown) => (detectIsTextVirtualNode(x) ? x.value : String(x));

const Comment = (text: string) => new CommentVirtualNode(text);

const createReplacer = () => new CommentVirtualNode(REPLACER);

const detectIsVirtualNode = (x: unknown): x is VirtualNode => x instanceof VirtualNode;

const detectIsTagVirtualNode = (x: unknown): x is TagVirtualNode => x instanceof TagVirtualNode;

const detectIsCommentVirtualNode = (x: unknown): x is CommentVirtualNode => x instanceof CommentVirtualNode;

const detectIsTextVirtualNode = (x: unknown): x is TextVirtualNode => x instanceof TextVirtualNode;

const detectIsVirtualNodeFactory = (x: unknown): x is VirtualNodeFactory => x?.[$$vNode];

const detectIsPlainVirtualNode = (x: unknown): x is PlainVirtualNode => !detectIsTagVirtualNode(x);

const getElementType = (inst: Instance): string | Function => inst[PROP_NAME] ?? inst[PROP_TYPE] ?? null;

const getElementKey = (inst: Instance): ElementKey | null => {
  return inst
    ? inst[PROP_PROPS]
      ? inst[PROP_PROPS][KEY_ATTR] ?? null
      : inst[PROP_ATTRS]
      ? inst[PROP_ATTRS][KEY_ATTR] ?? null
      : inst[KEY_ATTR] ?? null
    : null;
};

const hasChildrenProp = (inst: Instance): inst is TagVirtualNode | Component => {
  return inst?.[PROP_CHILDREN] !== undefined;
};

const detectAreSameInstanceTypes = (prevInst: Instance, nextInst: Instance) => {
  if (process.env.NODE_ENV !== 'production') {
    if (process.env.NODE_ENV === 'development' && $$scope().getIsHot()) {
      if (detectIsComponent(prevInst) && detectIsComponent(nextInst)) {
        return prevInst.displayName === nextInst.displayName;
      }
    }
  }

  return getElementType(prevInst) === getElementType(nextInst);
};

const detectAreSameComponentTypesWithSameKeys = (prevInst: Instance | null, nextInst: Instance | null) => {
  return (
    detectIsComponent(prevInst) &&
    detectIsComponent(nextInst) &&
    detectAreSameInstanceTypes(prevInst, nextInst) &&
    getElementKey(prevInst) === getElementKey(nextInst)
  );
};

type TextSource = string | number;

export type VirtualNodeFactory = () => VirtualNode;

export type TagVirtualNodeFactory = () => TagVirtualNode;

export type PlainVirtualNode = TextVirtualNode | CommentVirtualNode;

export type CanHaveChildren = TagVirtualNode | Component;

export type ViewOptions = {
  as: string;
  _void?: boolean;
  [prop: string]: any;
} & Partial<SlotProps> &
  RefProps &
  KeyProps;

export enum NodeType {
  TAG = 'TAG',
  TEXT = 'TEXT',
  COMMENT = 'COMMENT',
}

export {
  View,
  Text,
  Comment,
  VirtualNode,
  TagVirtualNode,
  TextVirtualNode,
  CommentVirtualNode,
  createReplacer,
  getElementKey,
  getElementType,
  hasChildrenProp,
  detectIsVirtualNode,
  detectIsTagVirtualNode,
  detectIsCommentVirtualNode,
  detectIsTextVirtualNode,
  detectIsPlainVirtualNode,
  detectIsVirtualNodeFactory,
  detectAreSameInstanceTypes,
  detectAreSameComponentTypesWithSameKeys,
};
