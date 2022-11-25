import type { ComponentFactory } from './component';
import type { DarkElementKey, DarkElement } from '../shared';
import type { Ref } from '../ref';
export declare type ComponentOptions<P extends StandardComponentProps> = Readonly<{
  displayName?: string;
  defaultProps?: Partial<P>;
  token?: Symbol;
  shouldUpdate?: (props: P, nextProps: P) => boolean;
}>;
export declare type StandardComponentProps = KeyProps & SlotProps & RefProps;
export declare type KeyProps = {
  key?: DarkElementKey;
};
export declare type SlotProps<T = DarkElement> = Readonly<{
  slot?: T;
}>;
export declare type RefProps<T = unknown> = {
  ref?: Ref<T>;
};
export declare type Component<T extends Pick<StandardComponentProps, 'slot'> = any, R = any> = (
  props: T,
  ref?: Ref<R>,
) => ComponentFactory;
export declare type ComponentFactoryReturnType = DarkElement;
export declare type CreateElement<P extends StandardComponentProps, R = any> = (
  props: P & Pick<StandardComponentProps, 'slot'>,
  ref?: Ref<R>,
) => ComponentFactoryReturnType;
