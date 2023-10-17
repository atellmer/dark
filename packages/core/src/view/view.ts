import { REPLACER, ATTR_KEY, FLAGS } from '../constants';
import { detectIsArray, detectIsEmpty, detectIsFunction } from '../helpers';
import type { DarkElementKey as Key, DarkElement, DarkElementInstance } from '../shared';
import {
  type Component,
  type ComponentFactory,
  detectIsComponent,
  getComponentKey,
  hasComponentFlag,
} from '../component';
import { NodeType, type ViewDef } from './types';

export type VirtualNodeFactory = () => VirtualNode;
export type TagVirtualNodeFactory = () => TagVirtualNode;
export type PlainVirtualNode = TextVirtualNode | CommentVirtualNode;

const $$vNode = Symbol('vNode');
const TYPE = 'type';

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
    Object.keys(attrs).length > 0 && (this.attrs = attrs);
    this.children = children || this.children;
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

const detectIsVirtualNode = (vNode: unknown): vNode is VirtualNode => vNode instanceof VirtualNode;

const detectIsTagVirtualNode = (vNode: unknown): vNode is TagVirtualNode => vNode instanceof TagVirtualNode;

const detectIsCommentVirtualNode = (vNode: unknown): vNode is CommentVirtualNode => vNode instanceof CommentVirtualNode;

const detectIsTextVirtualNode = (vNode: unknown): vNode is TextVirtualNode => vNode instanceof TextVirtualNode;

const detectIsVirtualNodeFactory = (factory: unknown): factory is VirtualNodeFactory =>
  detectIsFunction(factory) && factory[$$vNode] === true;

const getTagVirtualNodeKey = (vNode: TagVirtualNode): Key | null =>
  vNode.attrs && !detectIsEmpty(vNode.attrs[ATTR_KEY]) ? vNode.attrs[ATTR_KEY] : null;

const hasTagVirtualNodeFlag = (vNode: TagVirtualNode, flag: string) => Boolean(vNode.attrs && vNode.attrs[flag]);

const getVirtualNodeFactoryKey = (factory: VirtualNodeFactory): Key | null =>
  !detectIsEmpty(factory[ATTR_KEY]) ? factory[ATTR_KEY] : null;

const hasVirtualNodeFactoryFlag = (factory: VirtualNodeFactory, flag: string) => Boolean(factory[flag]);

const createReplacer = () => new CommentVirtualNode(REPLACER);

const detectIsPlainVirtualNode = (vNode: unknown): vNode is PlainVirtualNode =>
  detectIsTextVirtualNode(vNode) || detectIsCommentVirtualNode(vNode);

const detectIsReplacer = (vNode: unknown) => detectIsCommentVirtualNode(vNode) && vNode.value === REPLACER;

function getElementKey(instance: DarkElementInstance): Key | null {
  const key = detectIsComponent(instance)
    ? getComponentKey(instance)
    : detectIsVirtualNodeFactory(instance)
    ? getVirtualNodeFactoryKey(instance)
    : detectIsTagVirtualNode(instance)
    ? getTagVirtualNodeKey(instance)
    : null;

  return key;
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

function getInstanceType(instance: DarkElementInstance): string | Function {
  return detectIsVirtualNodeFactory(instance)
    ? instance[TYPE]
    : detectIsTagVirtualNode(instance)
    ? instance.name
    : detectIsVirtualNode(instance)
    ? instance.type
    : detectIsComponent(instance)
    ? instance.type
    : null;
}

function hasChildrenProp(element: DarkElementInstance): element is TagVirtualNode | Component {
  return detectIsTagVirtualNode(element) || detectIsComponent(element);
}

function View(def: ViewDef): TagVirtualNodeFactory {
  const factory = () => {
    const { as: name, slot, _void = false, ...attrs } = def;
    const children = (_void ? [] : detectIsArray(slot) ? slot : slot ? [slot] : []) as TagVirtualNode['children'];

    return new TagVirtualNode(name, attrs, children);
  };

  factory[$$vNode] = true;
  factory[TYPE] = def.as;
  !detectIsEmpty(def.key) && (factory[ATTR_KEY] = def.key);
  FLAGS[def.flag] && (factory[def.flag] = true);

  return factory;
}

function Text(source: string | number): TextVirtualNode {
  return new TextVirtualNode(source + '');
}

Text.from = (source: DarkElement) => (detectIsTextVirtualNode(source) ? source.value : source + '');

function Comment(text: string): CommentVirtualNode {
  return new CommentVirtualNode(text);
}

export {
  VirtualNode,
  TagVirtualNode,
  TextVirtualNode,
  CommentVirtualNode,
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
  getInstanceType,
  hasChildrenProp,
  View,
  Text,
  Comment,
};
