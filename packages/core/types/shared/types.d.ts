import type { ComponentFactory } from '../component';
import type { VirtualNode, VirtualNodeFactory } from '../view';
export declare type DarkElement = NestedArray<
  ComponentFactory | VirtualNode | RenderProps | Nullable | string | number
>;
export declare type Nullable = null | false | undefined;
export declare type NestedArray<T> = T | Array<NestedArray<T>>;
export declare type RenderProps = (...args: Array<any>) => DarkElement;
export declare type DarkElementKey = string | number;
export declare type DarkElementInstance = VirtualNode | VirtualNodeFactory | ComponentFactory;
