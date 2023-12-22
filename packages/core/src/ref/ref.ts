import { detectIsObject, detectIsNull, detectIsFunction } from '../utils';
import type { Component, ComponentFactory } from '../component';
import type { RefProps, KeyProps, FlagProps } from '../shared';
import { useMemo } from '../use-memo';
import type { MutableRef, Ref } from './types';

function forwardRef<P extends object, R>(
  component: ComponentFactory<P, R>,
): ComponentFactory<P & RefProps<R> & KeyProps & FlagProps, R> {
  type Props = P & RefProps<R>;

  return (props: Props) => {
    const { ref, ...rest } = (props || {}) as Props;

    return component(rest as P, ref) as Component<P, R>;
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

function useRef<T>(initialValue: T = null): MutableRef<T> {
  const ref = useMemo(() => ({ current: initialValue }), []) as MutableRef<T>;

  return ref;
}

export { forwardRef, detectIsMutableRef, applyRef, useRef };
