import { DarkElementKey } from '@core/shared/model';
import { EMPTY_NODE, ATTR_KEY } from '@core/constants';
import { ComponentFactory, StandardComponentProps } from '@core/component';
import { ViewDef, NodeType } from './model';
import { isArray, isEmpty, isFunction } from '@helpers';


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
  public isVoid: boolean = false;
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
const detectIsEmptyVirtualNode = (vNode: CommentVirtualNode): boolean =>
  detectIsCommentVirtualNode(vNode) && vNode.value === EMPTY_NODE;

function getVirtualNodeKey(vNode: TagVirtualNode): DarkElementKey | null {
  const key = vNode && vNode.attrs[ATTR_KEY];

  return !isEmpty(key) ? key : null;
}

function getAttribute(vNode: VirtualNode, attrName: string) {
  return detectIsTagVirtualNode(vNode) && !isEmpty(vNode.attrs[attrName]) ? vNode.attrs[attrName] : undefined;
}

function setAttribute(vNode: VirtualNode, name: string, value: any) {
  detectIsTagVirtualNode(vNode) && (vNode.attrs[name] = value);
}

function Text(source: string | StandardComponentProps['slot']): string | TextVirtualNodeFactory {
  if (typeof source === 'string') {
    const factory = () => new TextVirtualNode(source);

    factory[$$virtualNode] = true;

    return factory;
  }

  const text = detectIsTextVirtualNode(source) ? source.value : '';

  return text;
}

function Comment(text: string): CommentVirtualNodeFactory {
  const factory = () => new CommentVirtualNode(text);

  factory[$$virtualNode] = true;

  return factory;
}

function View(def: ViewDef): TagVirtualNodeFactory {
  const factory = () => {
    const {
      as,
      slot,
      isVoid = false,
      ...rest
    } = def;
    const children = isVoid
      ? []
      : isArray(slot)
        ? slot
        : Boolean(slot)
          ? [slot]
          : [];

    return new TagVirtualNode({
      name: as,
      isVoid,
      attrs: { ...rest },
      children: children as Array<VirtualNodeFactory>,
    });
  }

  factory[$$virtualNode] = true;

  return factory;
};

const createEmptyVirtualNode = () => new CommentVirtualNode(EMPTY_NODE);

const detectIsVirtualNodeFactory = (factory: unknown): factory is VirtualNodeFactory =>
  isFunction(factory) && factory[$$virtualNode] === true;

export {
  VirtualNode,
  TagVirtualNode,
  TextVirtualNode,
  CommentVirtualNode,
  detectIsVirtualNode,
  detectIsTagVirtualNode,
  detectIsCommentVirtualNode,
  detectIsTextVirtualNode,
  detectIsEmptyVirtualNode,
  getAttribute,
  setAttribute,
  getVirtualNodeKey,
  Text,
  Comment,
  View,
  createEmptyVirtualNode,
  detectIsVirtualNodeFactory,
};
