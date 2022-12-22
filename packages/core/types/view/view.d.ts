import { Flag } from '../constants';
import type { DarkElementKey, DarkElement } from '../shared';
import type { ComponentFactory } from '../component';
import { NodeType, type ViewDef } from './types';
export type VirtualNodeFactory = () => VirtualNode;
export type TagVirtualNodeFactory = () => TagVirtualNode;
export type TextVirtualNodeFactory = () => TextVirtualNode;
export type CommentVirtualNodeFactory = () => CommentVirtualNode;
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
declare const detectIsVirtualNodeFactory: (factory: unknown) => factory is VirtualNodeFactory;
declare const getTagVirtualNodeKey: (vNode: TagVirtualNode) => DarkElementKey | null;
declare const getTagVirtualNodeFlag: (vNode: TagVirtualNode) => Record<Flag, boolean> | null;
declare const getVirtualNodeFactoryKey: (factory: VirtualNodeFactory) => DarkElementKey | null;
declare const getVirtualNodeFactoryFlag: (factory: VirtualNodeFactory) => Record<Flag, boolean> | null;
declare const createReplacer: () => CommentVirtualNode;
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
