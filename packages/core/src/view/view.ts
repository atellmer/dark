import type { ElementKey, DarkElement, Instance, SlotProps, RefProps, KeyProps, FlagProps } from '../shared';
import { type Component, detectIsComponent, getComponentKey, hasComponentFlag } from '../component';
import { detectIsArray, detectIsFunction } from '../utils';
import { REPLACER, KEY_ATTR } from '../constants';
import { $$scope } from '../scope';

const $$vNode = Symbol('vNode');
const ATTR_TYPE = 'type';

class VirtualNode {
  type: NodeType = null;

  constructor(type: NodeType) {
    this.type = type;
  }
}

class TagVirtualNode extends VirtualNode {
  name: string;
  attrs: Record<string, any>;
  children: Array<TextVirtualNode | CommentVirtualNode | TagVirtualNode | VirtualNodeFactory | Component>;

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

function View(options: ViewOptions) {
  const factory: TagVirtualNodeFactory = () => {
    const { as: name, slot, _void = false, ...attrs } = options;
    const children = (_void ? [] : detectIsArray(slot) ? slot : slot ? [slot] : []) as TagVirtualNode['children'];

    return new TagVirtualNode(name, attrs, children);
  };

  factory[$$vNode] = true;
  factory[ATTR_TYPE] = options.as;
  factory[KEY_ATTR] = options.key;

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
  detectIsFunction(factory) && factory[$$vNode] === true;

const getTagVirtualNodeKey = (vNode: TagVirtualNode): ElementKey | null =>
  vNode.attrs ? vNode.attrs[KEY_ATTR] ?? null : null;

const hasTagVirtualNodeFlag = (vNode: TagVirtualNode, flag: string) => Boolean(vNode.attrs && vNode.attrs[flag]);

const getVirtualNodeFactoryKey = (factory: VirtualNodeFactory): ElementKey | null => factory[KEY_ATTR] ?? null;

const hasVirtualNodeFactoryFlag = (factory: VirtualNodeFactory, flag: string) => Boolean(factory[flag]);

const detectIsPlainVirtualNode = (vNode: unknown): vNode is PlainVirtualNode =>
  detectIsTextVirtualNode(vNode) || detectIsCommentVirtualNode(vNode);

const createReplacer = () => new CommentVirtualNode(REPLACER);

const detectIsReplacer = (vNode: unknown) => detectIsCommentVirtualNode(vNode) && vNode.value === REPLACER;

function getElementKey(inst: Instance): ElementKey | null {
  return detectIsComponent(inst)
    ? getComponentKey(inst)
    : detectIsVirtualNodeFactory(inst)
    ? getVirtualNodeFactoryKey(inst)
    : detectIsTagVirtualNode(inst)
    ? getTagVirtualNodeKey(inst)
    : null;
}

function hasElementFlag(inst: Instance, flag: string) {
  return detectIsComponent(inst)
    ? hasComponentFlag(inst, flag)
    : detectIsVirtualNodeFactory(inst)
    ? hasVirtualNodeFactoryFlag(inst, flag)
    : detectIsTagVirtualNode(inst)
    ? hasTagVirtualNodeFlag(inst, flag)
    : false;
}

function getElementType(inst: Instance): string | Function {
  return detectIsComponent(inst)
    ? inst.type
    : detectIsVirtualNodeFactory(inst)
    ? inst[ATTR_TYPE]
    : detectIsTagVirtualNode(inst)
    ? inst.name
    : detectIsVirtualNode(inst)
    ? inst.type
    : null;
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

  if (isComponentFactories) {
    const pc = prevInst as Component;
    const nc = nextInst as Component;

    return pc.type === nc.type;
  }

  return getElementType(prevInst) === getElementType(nextInst);
}

function detectAreSameComponentTypesWithSameKeys(prevInst: Instance | null, nextInst: Instance | null) {
  if (
    prevInst &&
    nextInst &&
    detectIsComponent(prevInst) &&
    detectIsComponent(nextInst) &&
    detectAreSameInstanceTypes(prevInst, nextInst, true)
  ) {
    return getElementKey(prevInst) === getElementKey(nextInst);
  }

  return false;
}

type TextSource = string | number;

export type VirtualNodeFactory = () => VirtualNode;

export type TagVirtualNodeFactory = () => TagVirtualNode;

export type PlainVirtualNode = TextVirtualNode | CommentVirtualNode;

export type ViewOptions = {
  as: string;
  _void?: boolean;
  [prop: string]: any;
} & Partial<SlotProps> &
  RefProps &
  KeyProps &
  FlagProps;

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
