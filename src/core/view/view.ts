import { ViewDef, NodeType } from './model';
import { ComponentFactory } from '@core/component';
import {
  isArray,
  isNumber,
  isString,
  isFunction,
  isEmpty,
} from '@helpers';
import { EMPTY_NODE, ATTR_KEY } from '../constants';
import { ElementKey } from '../shared/model';


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
  public children: Array<VirtualNode | ComponentFactory> = [];

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

const createTagVirtualNode = (config: Partial<TagVirtualNode>): TagVirtualNode => new TagVirtualNode(config);

const createTextVirtualNode = (text: string): TextVirtualNode => new TextVirtualNode(text);

const createCommentVirtualNode = (text: string): CommentVirtualNode => new CommentVirtualNode(text);

const createEmptyVirtualNode = (): VirtualNode => createCommentVirtualNode(EMPTY_NODE);

const detectIsVirtualNode = (vNode: unknown): vNode is VirtualNode => vNode && vNode instanceof VirtualNode;

const detectIsTagVirtualNode = (vNode: unknown): vNode is TagVirtualNode => vNode && vNode instanceof TagVirtualNode;

const detectIsCommentVirtualNode = (vNode: unknown): vNode is CommentVirtualNode => vNode instanceof CommentVirtualNode;

const detectIsTextVirtualNode = (vNode: unknown): vNode is TextVirtualNode => vNode instanceof TextVirtualNode;

const detectIsEmptyVirtualNode = (vNode: CommentVirtualNode): boolean =>
  detectIsCommentVirtualNode(vNode) && vNode.value === EMPTY_NODE;

const Text = (text: string) => createTextVirtualNode(text);

const Comment = (text: string) => createCommentVirtualNode(text);

const getAttribute = (vNode: VirtualNode, attrName: string): any =>
  detectIsTagVirtualNode(vNode) && !isEmpty(vNode.attrs[attrName]) ? vNode.attrs[attrName] : undefined;

const setAttribute = (vNode: VirtualNode, name: string, value: any) =>
  detectIsTagVirtualNode(vNode) && (vNode.attrs[name] = value);

const View = (def: ViewDef) => {
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

  return createTagVirtualNode({
    name: as,
    isVoid,
    attrs: { ...rest },
    children: children as Array<VirtualNode>,
  });
};

function getChildren(children: Array<any>) {
  children = children.map(x => (isString(x) || isNumber(x) ? Text(x.toString()) : x));

  return Boolean(children) ? (Array.isArray(children) ? [...children] : [children]) : [];
}

function createElement(tag: string | Function, props: any, ...children: Array<any>) {
  if (isString(tag)) {
    return View({
      ...props,
      as: tag,
      slot: getChildren(children),
    });
  }

  if (isFunction(tag)) {
    const Component = tag;
    let slot = getChildren(children);

    slot = slot.length === 1 ? slot[0] : slot;

    return Component({
      ...props,
      slot,
    });
  }

  return null;
}

function getVirtualNodeKey(vNode: TagVirtualNode): ElementKey | null {
  const key = vNode && vNode.attrs[ATTR_KEY];

  return !isEmpty(key) ? key : null;
}


export {
  VirtualNode,
  TagVirtualNode,
  TextVirtualNode,
  CommentVirtualNode,
  createTagVirtualNode,
  createTextVirtualNode,
  createCommentVirtualNode,
  createEmptyVirtualNode,
  detectIsVirtualNode,
  detectIsTagVirtualNode,
  detectIsCommentVirtualNode,
  detectIsTextVirtualNode,
  detectIsEmptyVirtualNode,
  getAttribute,
  setAttribute,
  Text,
  Comment,
  View,
  createElement,
  getVirtualNodeKey,
};
