import type { DarkElement, SlotProps } from '../shared';
import { useLayoutEffect } from '../use-layout-effect';
import { detectIsServer } from '../platform';
import { createContext } from '../context';
import { component } from '../component';
import { useState } from '../use-state';
import { Fragment } from '../fragment';
import { useMemo } from '../use-memo';
import { $$scope } from '../scope';
import { Shadow } from '../shadow';
import { dummyFn } from '../utils';

type SuspenseProps = {
  fallback: DarkElement;
} & Required<SlotProps>;

type ContextValue = {
  register: (id: string) => void;
  unregister: (id: string) => void;
};

const SuspenseContext = createContext<ContextValue>({
  register: dummyFn,
  unregister: dummyFn,
});

const Suspense = component<SuspenseProps>(({ fallback, slot }) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!fallback) {
      throw new Error(`[Dark]: Suspense fallback not found!`);
    }
  }
  const $scope = $$scope();
  const emitter = $scope.getEmitter();
  const [isFetching, setIsFetching] = useState(false);
  const [isVisible, setIsVisible] = useState(() => detectIsServer() || $scope.getIsHydrateZone());
  const scope = useMemo<Scope>(() => ({ store: new Set(), isFetching, isVisible }), []);
  const value = useMemo<ContextValue>(() => ({ register: null, unregister: null }), []);
  const content = [
    Shadow({ key: CONTENT, isVisible, slot }),
    detectHasFallback(isFetching, isVisible) ? Fragment({ key: FALLBACK, slot: fallback }) : null,
  ].filter(Boolean);

  useLayoutEffect(() => {
    const off = emitter.on('finish', () => {
      const { store, isVisible } = scope;

      if (store.size === 0 && !isVisible) {
        setIsVisible(true);
        off();
      }
    });

    return off;
  }, []);

  const register = (id: string) => {
    const { store, isVisible } = scope;

    store.add(id);
    isVisible && setIsFetching(true);
  };

  const unregister = (id: string) => {
    const { store, isFetching } = scope;

    store.delete(id);
    store.size === 0 && isFetching && setIsFetching(false);
  };

  scope.isFetching = isFetching;
  scope.isVisible = isVisible;
  value.register = register;
  value.unregister = unregister;

  return SuspenseContext.Provider({ value, slot: content });
});

type Scope = {
  store: Set<string>;
  isFetching: boolean;
  isVisible: boolean;
};

const CONTENT = 1;
const FALLBACK = 2;

const detectHasFallback = (isFetching: boolean, isVisible: boolean) => isFetching || !isVisible;

export { SuspenseContext, Suspense };
