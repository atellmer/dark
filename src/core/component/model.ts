import { ComponentFactory } from './component';
import { ElementKey, DarkElement } from '../shared/model';


export type CreateElement<P extends StandardComponentProps> = (props: P) => DarkElement;

export type ComponentOptions<P extends StandardComponentProps> = {
  displayName?: string;
  defaultProps?: Partial<P>;
  token?: any;
};

export type StandardComponentProps = {
  key?: ElementKey;
  slot?: DarkElement;
} & Partial<{ [key: string]: any }>;

export type Component<T = any> = (props: T) => ComponentFactory;
