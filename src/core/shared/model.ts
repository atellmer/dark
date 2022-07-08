import { ComponentFactory } from '../component';
import { VirtualNode, VirtualNodeFactory } from '../view';

export type DarkElement = NestedArray<ComponentFactory | VirtualNode | RenderProps | Nullable | string>;

export type Nullable = null | false | undefined;

export type NestedArray<T> = T | Array<NestedArray<T>>;

export type RenderProps = (...args: Array<any>) => DarkElement;

export type DarkElementKey = string | number;

export type DarkElementInstance = VirtualNode | VirtualNodeFactory | ComponentFactory;
