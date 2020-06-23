import { ComponentFactory } from '../component';
import { VirtualNode } from '../view';


export type RenderProps = (...args: any) => DarkElement;

export type DarkElement = ComponentFactory | Array<ComponentFactory> | VirtualNode | Array<VirtualNode> | RenderProps;

export type ElementKey = string | number;