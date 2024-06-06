import type { ElementKey, ElementKind, DarkElement, Instance, SlotProps, RefProps, KeyProps } from '../shared';
import { REPLACER, KEY_ATTR, FLAG_ATTR, Flag } from '../constants';
import { type Component, detectIsComponent } from '../component';
import { detectIsArray, detectIsEmpty } from '../utils';
import { $$scope } from '../scope';

const $$vNode = Symbol('vNode');

class VirtualNode {
  type: NodeType = null;

  constructor(type: NodeType) {
    this.type = type;
  }
}

class TagVirtualNode extends VirtualNode {
  kind: string;
  attrs: Record<string, any>;
  children: Array<Instance>;

  constructor(kind: string, attrs: TagVirtualNode['attrs'], children: TagVirtualNode['children']) {
    super(NodeType.TAG);
    this.kind = kind;
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
  value: string;

  constructor(source: TextSource) {
    super(NodeType.COMMENT);
    this.value = String(source);
  }
}

function View(options: ViewOptions) {
  const factory: VirtualNodeFactory = () => {
    const { as: name, slot, _void = false, ...attrs } = options;
    const children = (
      _void ? [] : detectIsArray(slot) ? slot : !detectIsEmpty(slot) ? [slot] : []
    ) as TagVirtualNode['children'];

    return new TagVirtualNode(name, attrs, children);
  };

  factory[$$vNode] = true;
  factory.kind = options.as;
  factory.key = options.key;
  options[FLAG_ATTR] && (factory[FLAG_ATTR] = options[FLAG_ATTR]);

  return factory;
}

const Text = (source: TextSource) => new TextVirtualNode(source);

Text.from = (source: DarkElement) => (detectIsTextVirtualNode(source) ? source.value : String(source));

const Comment = (text: string) => new CommentVirtualNode(text);

const detectIsVirtualNode = (vNode: unknown): vNode is VirtualNode => vNode instanceof VirtualNode;

const detectIsTagVirtualNode = (vNode: unknown): vNode is TagVirtualNode => vNode instanceof TagVirtualNode;

const detectIsCommentVirtualNode = (vNode: unknown): vNode is CommentVirtualNode => vNode instanceof CommentVirtualNode;

const detectIsTextVirtualNode = (vNode: unknown): vNode is TextVirtualNode => vNode instanceof TextVirtualNode;

const detectIsVirtualNodeFactory = (factory: unknown): factory is VirtualNodeFactory =>
  factory && factory[$$vNode] === true;

const detectIsPlainVirtualNode = (vNode: unknown): vNode is PlainVirtualNode =>
  detectIsTextVirtualNode(vNode) || detectIsCommentVirtualNode(vNode);

const createReplacer = () => new CommentVirtualNode(REPLACER);

const detectIsReplacer = (vNode: unknown) => detectIsCommentVirtualNode(vNode) && vNode.value === REPLACER;

const getElementType = (inst: Instance): ElementKind | null =>
  inst ? (inst as Component | TagVirtualNode | VirtualNodeFactory).kind : null;

const getElementKey = (inst: Instance): ElementKey | null =>
  inst
    ? inst[KEY_ATTR] ?? (inst as Component).props?.[KEY_ATTR] ?? (inst as TagVirtualNode).attrs?.[KEY_ATTR] ?? null
    : null;

function hasElementFlag(inst: Instance, flag: Flag) {
  const res = inst
    ? inst[FLAG_ATTR] & flag ||
      (inst as Component).props?.[FLAG_ATTR] & flag ||
      (inst as TagVirtualNode).attrs?.[FLAG_ATTR] & flag
    : 0;

  return Boolean(res);
}

function hasChildrenProp(inst: Instance): inst is TagVirtualNode | Component {
  return detectIsTagVirtualNode(inst) || detectIsComponent(inst);
}

function detectAreSameInstanceTypes(prevInst: Instance, nextInst: Instance, isComponentFactories = false) {
  if (process.env.NODE_ENV !== 'production') {
    if (process.env.NODE_ENV === 'development' && $$scope().getIsHot()) {
      if (detectIsComponent(prevInst) && detectIsComponent(nextInst)) {
        return prevInst.displayName === nextInst.displayName;
      }
    }
  }

  return isComponentFactories
    ? (prevInst as Component).kind === (nextInst as Component).kind
    : getElementType(prevInst) === getElementType(nextInst);
}

function detectAreSameComponentTypesWithSameKeys(prevInst: Instance | null, nextInst: Instance | null) {
  return (
    detectIsComponent(prevInst) &&
    detectAreSameInstanceTypes(prevInst, nextInst, true) &&
    getElementKey(prevInst) === getElementKey(nextInst)
  );
}

type TextSource = string | number;

export type VirtualNodeFactory = {
  (): TagVirtualNode;
  [$$vNode]: true;
  kind: string;
  key: ElementKey;
  [FLAG_ATTR]: number;
};

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
  detectIsReplacer,
  getElementKey,
  hasElementFlag,
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
