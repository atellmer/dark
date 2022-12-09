import { EMPTY_NODE, ATTR_KEY, ATTR_TYPE } from '../constants';
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

  constructor(options: Partial<VirtualNode>) {
    this.type = options.type;
  }
}

class TagVirtualNode extends VirtualNode {
  public type = NodeType.TAG;
  public name: string = null;
  public isVoid = false;
  public attrs: Record<string, any> = {};
  public children: Array<VirtualNodeFactory | ComponentFactory> = [];

  constructor(options: Partial<TagVirtualNode>) {
    super(options);
    this.name = options.name || this.name;
    this.isVoid = options.isVoid || this.isVoid;
    this.attrs = options.attrs || this.attrs;
    this.children = options.children || this.children;
  }
}

class TextVirtualNode extends VirtualNode {
  public type = NodeType.TEXT;
  public value = '';

  constructor(text: string) {
    super({});
    this.value = text;
  }
}

class CommentVirtualNode extends VirtualNode {
  public type = NodeType.COMMENT;
  public value = '';

  constructor(text: string) {
    super({});
    this.value = text;
  }
}

const detectIsVirtualNode = (vNode: unknown): vNode is VirtualNode => vNode instanceof VirtualNode;

const detectIsTagVirtualNode = (vNode: unknown): vNode is TagVirtualNode => vNode instanceof TagVirtualNode;

const detectIsCommentVirtualNode = (vNode: unknown): vNode is CommentVirtualNode => vNode instanceof CommentVirtualNode;

const detectIsTextVirtualNode = (vNode: unknown): vNode is TextVirtualNode => vNode instanceof TextVirtualNode;

const detectIsVirtualNodeFactory = (factory: unknown): factory is VirtualNodeFactory =>
  detectIsFunction(factory) && factory[$$virtualNode] === true;

const detectIsEmptyVirtualNode = (vNode: unknown): boolean =>
  detectIsCommentVirtualNode(vNode) && vNode.value === EMPTY_NODE;

const getTagVirtualNodeKey = (vNode: TagVirtualNode): DarkElementKey | null =>
  !detectIsEmpty(vNode.attrs[ATTR_KEY]) ? vNode.attrs[ATTR_KEY] : null;

const getVirtualNodeFactoryKey = (factory: VirtualNodeFactory): DarkElementKey | null =>
  !detectIsEmpty(factory[ATTR_KEY]) ? factory[ATTR_KEY] : null;

const createEmptyVirtualNode = () => new CommentVirtualNode(EMPTY_NODE);

function View(def: ViewDef): TagVirtualNodeFactory {
  const factory = () => {
    const { as, slot, isVoid = false, ...rest } = def;
    const children = isVoid ? [] : detectIsArray(slot) ? slot : slot ? [slot] : [];

    return new TagVirtualNode({
      name: as,
      isVoid,
      attrs: { ...rest },
      children: children as Array<VirtualNodeFactory>,
    });
  };

  factory[$$virtualNode] = true;
  factory[ATTR_KEY] = def.key;
  factory[ATTR_TYPE] = def.as;

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
  detectIsEmptyVirtualNode,
  getVirtualNodeFactoryKey,
  createEmptyVirtualNode,
  detectIsVirtualNodeFactory,
  View,
  Text,
  Comment,
};
