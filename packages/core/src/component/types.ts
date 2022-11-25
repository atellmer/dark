import type { ComponentFactory } from './component';
import type { DarkElementKey, DarkElement } from '../shared';
import type { Ref } from '../ref';

export type ComponentOptions<P extends StandardComponentProps> = Readonly<{
  displayName?: string;
  defaultProps?: Partial<P>;
  token?: Symbol;
  shouldUpdate?: (props: P, nextProps: P) => boolean;
}>;

export type StandardComponentProps = KeyProps & RefProps;

export type KeyProps = {
  key?: DarkElementKey;
};

export type SlotProps<T = DarkElement> = Readonly<{
  slot: T;
}>;

export type RefProps<T = unknown> = {
  ref?: Ref<T>;
};

export type Component<P = any, R = any> = (props?: P, ref?: Ref<R>) => ComponentFactory<P>;

export type CreateElement<P extends StandardComponentProps, R = any> = (props: P, ref?: Ref<R>) => DarkElement;
