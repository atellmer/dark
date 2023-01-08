import { detectIsObject, detectIsNull } from '../helpers';
import type { Component, ComponentFactory } from '../component';
import type { RefProps } from '../shared';
import type { MutableRef } from './types';

function forwardRef<P, R>(component: Component<P, R>) {
  return (props: P) => {
    const { ref, ...rest } = (props || {}) as P & RefProps<R>;

    return component(rest as P, ref) as ComponentFactory<P, R>;
  };
}

const detectIsMutableRef = (ref: unknown): ref is MutableRef => {
  if (!detectIsObject(ref) || detectIsNull(ref)) return false;
  const mutableRef = ref as MutableRef;

  for (const key in mutableRef) {
    if (key === 'current' && mutableRef.hasOwnProperty(key)) {
      return true;
    }
  }

  return false;
};

export { forwardRef, detectIsMutableRef };
