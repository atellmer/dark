import { ComponentFactory } from '../component';
import { VirtualNode } from '../view';


export type RenderProps = (...args: any) => DarkElement;

export type DarkElement = ComponentFactory
  | Array<ComponentFactory>
  | VirtualNode
  | Array<VirtualNode>
  | RenderProps
  | null
  | false
  | undefined

export type ElementKey = string | number;

export type ElementInstance = VirtualNode | ComponentFactory;
