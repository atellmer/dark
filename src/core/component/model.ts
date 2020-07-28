import { ComponentFactory } from './component';
import { DarkElementKey, DarkElement } from '../shared/model';


export type ComponentOptions<P extends StandardComponentProps> = Readonly<{
  displayName?: string;
  defaultProps?: Partial<P>;
  token?: Symbol;
}>;

export type StandardComponentProps = Readonly<{
  key?: DarkElementKey;
  slot?: DarkElement;
} & Partial<{ [key: string]: any }>>;

export type Component<T = any> = (props: T) => ComponentFactory;

export type ComponentFactoryReturnType = DarkElement;

export type CreateElement<P extends StandardComponentProps> = (props: P & StandardComponentProps) => ComponentFactoryReturnType;
