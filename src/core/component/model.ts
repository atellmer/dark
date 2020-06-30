import { ComponentFactory } from './component';
import { DarkElementKey, DarkElement, DarkElementInstance } from '../shared/model';


export type ComponentOptions<P extends StandardComponentProps> = Readonly<{
  displayName?: string;
  defaultProps?: Partial<P>;
  token?: any;
}>;

export type StandardComponentProps = Readonly<{
  key?: DarkElementKey;
  slot?: DarkElement;
} & Partial<{ [key: string]: any }>>;

export type Component<T = any> = (props: T) => ComponentFactory;

export type ComponentFactoryReturnType = DarkElementInstance | Array<ComponentFactoryReturnType>;

export type CreateElement<P extends StandardComponentProps> = (props: P) => ComponentFactoryReturnType;
