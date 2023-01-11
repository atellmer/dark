import { detectIsObject, detectIsNull, detectIsFunction } from '../helpers';
import type { Component, ComponentFactory } from '../component';
import type { RefProps } from '../shared';
import type { MutableRef, Ref } from './types';

function forwardRef<P, R>(component: Component<P, R>) {
  type Props = P & RefProps<any>;

  return (props: Props) => {
    const { ref, ...rest } = (props || {}) as Props;

    return component(rest as P, ref) as ComponentFactory<P, R>;
  };
}

function detectIsMutableRef(ref: unknown): ref is MutableRef {
  if (!detectIsObject(ref) || detectIsNull(ref)) return false;
  const mutableRef = ref as MutableRef;

  for (const key in mutableRef) {
    if (key === 'current' && mutableRef.hasOwnProperty(key)) {
      return true;
    }
  }

  return false;
}

function applyRef<T>(ref: Ref<T>, current: T) {
  if (detectIsFunction(ref)) {
    ref(current);
  } else if (detectIsMutableRef(ref)) {
    ref.current = current;
  }
}

export { forwardRef, detectIsMutableRef, applyRef };
