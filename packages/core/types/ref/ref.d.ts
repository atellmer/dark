import type { Component, RefProps, ComponentFactory } from '../component';
import type { MutableRef } from './types';
declare function forwardRef<P, R>(
  component: Component<P, R>,
): ({ ref, ...rest }: P & RefProps<R>) => ComponentFactory<P, R>;
declare const detectIsMutableRef: (ref: unknown) => ref is MutableRef<unknown>;
export { forwardRef, detectIsMutableRef };
