import type { ComponentFactory } from '../component';
import type { VirtualNode, VirtualNodeFactory } from '../view';
import { type Ref } from '../ref';
export declare type DarkElement = NestedArray<
  ComponentFactory | VirtualNode | RenderProps | Nullable | string | number
>;
export declare type Nullable = null | false | undefined;
export declare type NestedArray<T> = T | Array<NestedArray<T>>;
export declare type RenderProps = (...args: Array<any>) => DarkElement;
export declare type DarkElementKey = string | number;
export declare type DarkElementInstance = VirtualNode | VirtualNodeFactory | ComponentFactory;
export declare type Subscriber = () => void;
export declare type SubscriberWithValue<T> = (value: T) => void;
export declare type Subscribe<S extends Function> = (subscriber: S) => Unsubscribe;
export declare type Unsubscribe = () => void;
export declare type SlotProps<T = DarkElement> = Readonly<{
  slot: T;
}>;
export declare type RefProps<T = unknown> = {
  ref?: Ref<T>;
};
export declare type KeyProps = {
  key?: DarkElementKey;
};
