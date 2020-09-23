import { ComponentFactory } from './component';
import { DarkElementKey, DarkElement } from '../shared/model';
import { MutableRef } from '../ref/model';


export type ComponentOptions<P extends StandardComponentProps> = Readonly<{
  displayName?: string;
  defaultProps?: Partial<P>;
  token?: Symbol;
}>;

export type StandardComponentProps = Readonly<Partial<{[key: string]: any}>>
  & KeyProps
  & SlotProps
  & RefProps;

export type KeyProps = Readonly<{
  key?: DarkElementKey;
}>;

export type SlotProps = Readonly<{
  slot?: DarkElement;
}>;

export type RefProps<T = any> = {
  ref?: MutableRef<T>;
};

export type Component<T extends Pick<StandardComponentProps, 'slot'>, R = any>
  = (props: T, ref?: MutableRef<R>) => ComponentFactory;

export type ComponentWrapper<T = {}> = ComponentFactory<{slot: ComponentFactory<T>}>;

export type ComponentFactoryReturnType = DarkElement;

export type CreateElement<P extends StandardComponentProps, R = any>
  = (props: P & Pick<StandardComponentProps, 'slot'>, ref?: MutableRef<R>) => ComponentFactoryReturnType;
