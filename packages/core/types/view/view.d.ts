import type { DarkElementKey, DarkElement } from '../shared';
import type { ComponentFactory } from '../component';
import { NodeType, type ViewDef } from './types';
export declare type VirtualNodeFactory = () => VirtualNode;
export declare type TagVirtualNodeFactory = () => TagVirtualNode;
export declare type TextVirtualNodeFactory = () => TextVirtualNode;
export declare type CommentVirtualNodeFactory = () => CommentVirtualNode;
declare class VirtualNode {
  type: NodeType;
  constructor(options: Partial<VirtualNode>);
}
declare class TagVirtualNode extends VirtualNode {
  type: NodeType;
  name: string;
  isVoid: boolean;
  attrs: Record<string, any>;
  children: Array<VirtualNodeFactory | ComponentFactory>;
  constructor(options: Partial<TagVirtualNode>);
}
declare class TextVirtualNode extends VirtualNode {
  type: NodeType;
  value: string;
  constructor(text: string);
}
declare class CommentVirtualNode extends VirtualNode {
  type: NodeType;
  value: string;
  constructor(text: string);
}
declare const detectIsVirtualNode: (vNode: unknown) => vNode is VirtualNode;
declare const detectIsTagVirtualNode: (vNode: unknown) => vNode is TagVirtualNode;
declare const detectIsCommentVirtualNode: (vNode: unknown) => vNode is CommentVirtualNode;
declare const detectIsTextVirtualNode: (vNode: unknown) => vNode is TextVirtualNode;
declare const detectIsEmptyVirtualNode: (vNode: unknown) => boolean;
declare function getVirtualNodeKey(vNode: TagVirtualNode): DarkElementKey | null;
declare const createEmptyVirtualNode: () => CommentVirtualNode;
declare const detectIsVirtualNodeFactory: (factory: unknown) => factory is VirtualNodeFactory;
declare function View(def: ViewDef): TagVirtualNodeFactory;
declare function Text(source: string | number): TextVirtualNode;
declare namespace Text {
  var from: (source: DarkElement) => string;
}
declare function Comment(text: string): CommentVirtualNodeFactory;
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
  getVirtualNodeKey,
  createEmptyVirtualNode,
  detectIsVirtualNodeFactory,
  View,
  Text,
  Comment,
};
