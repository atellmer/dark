import { type Component, type ComponentFactory, type StandardComponentProps, type SlotProps } from '../component';
import { type Ref } from '../ref';
declare type ShouldUpdate<T> = (props: T, nextProps: T) => boolean;
declare const $$memo: unique symbol;
declare const detectIsMemo: (factory: unknown) => boolean;
declare function memo<T>(
  component: (props?: T, ref?: Ref) => ComponentFactory<T>,
  shouldUpdate?: ShouldUpdate<T & SlotProps>,
): Component<T & StandardComponentProps>;
export { $$memo, memo, detectIsMemo };
