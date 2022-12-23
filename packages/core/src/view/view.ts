import { REPLACER, ATTR_KEY, ATTR_FLAG, TYPE, Flag } from '../constants';
import { detectIsArray, detectIsEmpty, detectIsFunction } from '../helpers';
import type { DarkElementKey, DarkElement } from '../shared';
import type { ComponentFactory } from '../component';
import { NodeType, type ViewDef } from './types';

export type VirtualNodeFactory = () => VirtualNode;
export type TagVirtualNodeFactory = () => TagVirtualNode;
export type TextVirtualNodeFactory = () => TextVirtualNode;
export type CommentVirtualNodeFactory = () => CommentVirtualNode;

const $$virtualNode = Symbol('virtual-node');

class VirtualNode {
  public type: NodeType = null;

  constructor(type: NodeType) {
    this.type = type;
  }
}

class TagVirtualNode extends VirtualNode {
  public name: string = null;
  public attrs: Record<string, any> = {};
  public children: Array<VirtualNodeFactory | ComponentFactory> = [];

  constructor(name: string, attrs: TagVirtualNode['attrs'], children: TagVirtualNode['children']) {
    super(NodeType.TAG);
    this.name = name || this.name;
    this.attrs = attrs || this.attrs;
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
  detectIsFunction(factory) && factory[$$virtualNode] === true;

const getTagVirtualNodeKey = (vNode: TagVirtualNode): DarkElementKey | null =>
  !detectIsEmpty(vNode.attrs[ATTR_KEY]) ? vNode.attrs[ATTR_KEY] : null;

const getTagVirtualNodeFlag = (vNode: TagVirtualNode): Record<Flag, boolean> | null => vNode.attrs[ATTR_FLAG] || null;

const getVirtualNodeFactoryKey = (factory: VirtualNodeFactory): DarkElementKey | null =>
  !detectIsEmpty(factory[ATTR_KEY]) ? factory[ATTR_KEY] : null;

const getVirtualNodeFactoryFlag = (factory: VirtualNodeFactory): Record<Flag, boolean> | null =>
  factory[ATTR_FLAG] || null;

const createReplacer = () => new CommentVirtualNode(REPLACER);

function View(def: ViewDef): TagVirtualNodeFactory {
  const factory = () => {
    const { as: name, slot, _void = false, ...attrs } = def;
    const children = (_void ? [] : detectIsArray(slot) ? slot : slot ? [slot] : []) as TagVirtualNode['children'];

    return new TagVirtualNode(name, attrs, children);
  };

  factory[$$virtualNode] = true;
  factory[ATTR_KEY] = def.key;
  factory[ATTR_FLAG] = def.flag;
  factory[TYPE] = def.as;

  return factory;
}

function Text(source: string | number): TextVirtualNode {
  return new TextVirtualNode(source + '');
}

Text.from = (source: DarkElement) => (detectIsTextVirtualNode(source) ? source.value : source + '');

function Comment(text: string): CommentVirtualNodeFactory {
  const factory = () => new CommentVirtualNode(text);

  factory[$$virtualNode] = true;

  return factory;
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
  getTagVirtualNodeKey,
  getTagVirtualNodeFlag,
  getVirtualNodeFactoryKey,
  getVirtualNodeFactoryFlag,
  createReplacer,
  detectIsVirtualNodeFactory,
  View,
  Text,
  Comment,
};
