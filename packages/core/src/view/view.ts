import { REPLACER, ATTR_KEY } from '../constants';
import { detectIsArray, detectIsFunction } from '../helpers';
import type { DarkElementKey as Key, DarkElement, DarkElementInstance } from '../shared';
import {
  type Component,
  type ComponentFactory,
  detectIsComponent,
  getComponentKey,
  hasComponentFlag,
} from '../component';
import { scope$$ } from '../scope';
import { NodeType, type ViewDef } from './types';

export type VirtualNodeFactory = () => VirtualNode;
export type TagVirtualNodeFactory = () => TagVirtualNode;
export type PlainVirtualNode = TextVirtualNode | CommentVirtualNode;

const $$vNode = Symbol('vNode');
const ATTR_TYPE = 'type';

class VirtualNode {
  public type: NodeType = null;

  constructor(type: NodeType) {
    this.type = type;
  }
}

class TagVirtualNode extends VirtualNode {
  public name: string;
  public attrs: Record<string, any>;
  public children: Array<TextVirtualNode | CommentVirtualNode | VirtualNodeFactory | ComponentFactory> = [];

  constructor(name: string, attrs: TagVirtualNode['attrs'], children: TagVirtualNode['children']) {
    super(NodeType.TAG);
    this.name = name || this.name;
    attrs && (this.attrs = attrs);
    children && (this.children = children);
  }
}

class TextVirtualNode extends VirtualNode {
  public value = '';

  constructor(text: string) {
    super(NodeType.TEXT);
    this.value = text;
  }
}

class CommentVirtualNode extends VirtualNode {
  public value = '';

  constructor(text: string) {
    super(NodeType.COMMENT);
    this.value = text;
  }
}

function View(def: ViewDef): TagVirtualNodeFactory {
  const factory = () => {
    const { as: name, slot, _void = false, ...attrs } = def;
    const children = (_void ? [] : detectIsArray(slot) ? slot : slot ? [slot] : []) as TagVirtualNode['children'];

    return new TagVirtualNode(name, attrs, children);
  };

  factory[$$vNode] = true;
  factory[ATTR_TYPE] = def.as;
  factory[ATTR_KEY] = def.key;

  return factory;
}

const Text = (source: string | number) => new TextVirtualNode(source + '');

Text.from = (source: DarkElement) => (detectIsTextVirtualNode(source) ? source.value : source + '');

const Comment = (text: string) => new CommentVirtualNode(text);

const detectIsVirtualNode = (vNode: unknown): vNode is VirtualNode => vNode instanceof VirtualNode;

const detectIsTagVirtualNode = (vNode: unknown): vNode is TagVirtualNode => vNode instanceof TagVirtualNode;

const detectIsCommentVirtualNode = (vNode: unknown): vNode is CommentVirtualNode => vNode instanceof CommentVirtualNode;

const detectIsTextVirtualNode = (vNode: unknown): vNode is TextVirtualNode => vNode instanceof TextVirtualNode;

const detectIsVirtualNodeFactory = (factory: unknown): factory is VirtualNodeFactory =>
  detectIsFunction(factory) && factory[$$vNode] === true;

const getTagVirtualNodeKey = (vNode: TagVirtualNode): Key | null =>
  vNode.attrs ? vNode.attrs[ATTR_KEY] ?? null : null;

const hasTagVirtualNodeFlag = (vNode: TagVirtualNode, flag: string) => Boolean(vNode.attrs && vNode.attrs[flag]);

const getVirtualNodeFactoryKey = (factory: VirtualNodeFactory): Key | null => factory[ATTR_KEY] ?? null;

const hasVirtualNodeFactoryFlag = (factory: VirtualNodeFactory, flag: string) => Boolean(factory[flag]);

const detectIsPlainVirtualNode = (vNode: unknown): vNode is PlainVirtualNode =>
  detectIsTextVirtualNode(vNode) || detectIsCommentVirtualNode(vNode);

const createReplacer = () => new CommentVirtualNode(REPLACER);

const detectIsReplacer = (vNode: unknown) => detectIsCommentVirtualNode(vNode) && vNode.value === REPLACER;

function getElementKey(inst: DarkElementInstance): Key | null {
  return detectIsComponent(inst)
    ? getComponentKey(inst)
    : detectIsVirtualNodeFactory(inst)
    ? getVirtualNodeFactoryKey(inst)
    : detectIsTagVirtualNode(inst)
    ? getTagVirtualNodeKey(inst)
    : null;
}

function hasElementFlag(inst: DarkElementInstance, flag: string) {
  return detectIsComponent(inst)
    ? hasComponentFlag(inst, flag)
    : detectIsVirtualNodeFactory(inst)
    ? hasVirtualNodeFactoryFlag(inst, flag)
    : detectIsTagVirtualNode(inst)
    ? hasTagVirtualNodeFlag(inst, flag)
    : false;
}

function getElementType(inst: DarkElementInstance): string | Function {
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

function hasChildrenProp(inst: DarkElementInstance): inst is TagVirtualNode | Component {
  return detectIsTagVirtualNode(inst) || detectIsComponent(inst);
}

function detectAreSameInstanceTypes(
  prevInst: DarkElementInstance,
  nextInst: DarkElementInstance,
  isComponentFactories = false,
) {
  if (process.env.NODE_ENV !== 'production') {
    if (process.env.NODE_ENV === 'development' && scope$$().getIsHot()) {
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

function detectAreSameComponentTypesWithSameKeys(
  prevInst: DarkElementInstance | null,
  nextInst: DarkElementInstance | null,
) {
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

export {
  VirtualNode,
  TagVirtualNode,
  TextVirtualNode,
  CommentVirtualNode,
  View,
  Text,
  Comment,
  detectIsVirtualNode,
  detectIsTagVirtualNode,
  detectIsCommentVirtualNode,
  detectIsTextVirtualNode,
  detectIsPlainVirtualNode,
  detectIsVirtualNodeFactory,
  createReplacer,
  detectIsReplacer,
  getElementKey,
  hasElementFlag,
  getElementType,
  hasChildrenProp,
  detectAreSameInstanceTypes,
  detectAreSameComponentTypesWithSameKeys,
};
