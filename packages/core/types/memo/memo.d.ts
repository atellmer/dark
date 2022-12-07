import { type Component, type ComponentFactory, type StandardComponentProps, type ShouldUpdate } from '../component';
import type { SlotProps } from '../shared';
import { type Ref } from '../ref';
declare const $$memo: unique symbol;
declare const detectIsMemo: (factory: unknown) => boolean;
declare function memo<T>(
  component: (props?: T, ref?: Ref) => ComponentFactory<T>,
  shouldUpdate?: ShouldUpdate<T & SlotProps>,
): Component<T & StandardComponentProps>;
export { $$memo, memo, detectIsMemo };
