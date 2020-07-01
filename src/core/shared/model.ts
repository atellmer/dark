import { ComponentFactory } from '../component';
import { VirtualNode } from '../view';


export type DarkElement = ComponentFactory
| Array<ComponentFactory>
| VirtualNode
| Array<VirtualNode>
| RenderProps
| Nullable;

export type Nullable = null
| false
| undefined;

export type NestedArray<T> = T | Array<NestedArray<T>>;

export type RenderProps = (...args: Array<any>) => DarkElement;

export type DarkElementKey = string | number;

export type DarkElementInstance = VirtualNode | ComponentFactory;
