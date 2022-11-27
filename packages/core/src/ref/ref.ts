import { detectIsObject, detectIsNull } from '../helpers';
import type { Component, RefProps, ComponentFactory } from '../component';
import type { MutableRef } from './types';

function forwardRef<P, R>(component: Component<P, R>) {
  type Props = P & RefProps<R>;

  return (props: Props) => {
    const { ref, ...rest } = props || {};

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
