import { ComponentFactory } from '../component';
import { VirtualNode } from '../view';


export type Nullable = null
| false
| undefined;

export type DarkElement = ComponentFactory
| Array<ComponentFactory>
| VirtualNode
| Array<VirtualNode>
| RenderProps
| Nullable;

export type RenderProps = (...args: any) => DarkElement;

export type DarkElementKey = string | number;

export type DarkElementInstance = VirtualNode | ComponentFactory;
