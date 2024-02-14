import { detectIsObject, detectIsNull, detectIsFunction } from '../utils';
import type { Component, ComponentFactory } from '../component';
import type { RefProps, KeyProps, FlagProps, Prettify } from '../shared';
import { useMemo } from '../use-memo';

function forwardRef<P extends object, R>(
  component: ComponentFactory<P, R>,
): ComponentFactory<Prettify<P & RefProps<R> & KeyProps & FlagProps>, R> {
  type Props = P & RefProps<R> & KeyProps & FlagProps;

  return (props: Props) => {
    const { ref, ...rest } = (props || {}) as Props;

    return component(rest as P, ref) as Component<Props, R>;
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

export type MutableRef<T = unknown> = {
  current: T;
};

export type FunctionRef<T = unknown> = (ref: T) => void;

export type Ref<T = unknown> = MutableRef<T> | FunctionRef<T>;

export { forwardRef, detectIsMutableRef, applyRef, useRef };
