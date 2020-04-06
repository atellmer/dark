import { ComponentFactory } from './component';

export type ComponentDef<P extends StandardComponentProps> = (props: P) => any;

export type ComponentOptions<P extends StandardComponentProps> = {
  displayName?: string;
  defaultProps?: Partial<P>;
  token?: any;
};

export type StandardComponentProps = {
  key?: number | string;
  slot?: any;
} & Partial<{ [key: string]: any }>;

export type Component<T = any> = (props: T) => ComponentFactory;
