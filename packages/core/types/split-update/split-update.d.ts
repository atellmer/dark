import type { DarkElementKey, DarkElement } from '../shared';
import { type ComponentFactory, type StandardComponentProps } from '../component';
import { type Ref } from '../ref';
declare type SplitUpdateProps<T = any> = {
  list: Array<T>;
  getKey: (x: T) => DarkElementKey;
  slot: DarkElement;
};
declare const SplitUpdate: SplitUpdate;
declare function useSplitUpdate<T>(
  selector: (map: Record<DarkElementKey, T>) => T,
  detectChange: (x: T) => DarkElementKey,
): T;
declare type MergedProps<T> = SplitUpdateProps<T> & StandardComponentProps;
declare type SplitUpdate = <T>(props?: MergedProps<T>, ref?: Ref) => ComponentFactory<MergedProps<T>>;
export { SplitUpdate, useSplitUpdate };
