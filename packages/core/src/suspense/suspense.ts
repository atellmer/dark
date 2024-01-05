import type { DarkElement, SlotProps } from '../shared';
import { useLayoutEffect } from '../use-layout-effect';
import { detectIsServer } from '../platform';
import { createContext, useContext } from '../context';
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
  isLoaded: boolean;
  fallback: DarkElement;
  register: (id: string) => void;
  unregister: (id: string) => void;
};

const SuspenseContext = createContext<ContextValue>({
  isLoaded: false,
  fallback: null,
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
  const [isLoaded, setIsLoaded] = useState(() => detectIsServer() || $scope.getIsHydrateZone());
  const scope = useMemo<Scope>(() => ({ store: new Set(), isLoaded }), []);
  const value = useMemo<ContextValue>(() => ({ isLoaded, fallback, register: null, unregister: null }), []);
  const content = [
    Shadow({ key: CONTENT, isInserted: isLoaded, slot }),
    isLoaded ? null : Fragment({ key: FALLBACK, slot: fallback }),
  ].filter(Boolean);

  useLayoutEffect(() => {
    const off = emitter.on('finish', () => {
      const { store, isLoaded } = scope;

      if (store.size === 0 && !isLoaded) {
        setIsLoaded(true);
        off();
      }
    });

    return off;
  }, []);

  scope.isLoaded = isLoaded;
  value.isLoaded = isLoaded;
  value.fallback = fallback;
  value.register = (id: string) => scope.store.add(id);
  value.unregister = (id: string) => scope.store.delete(id);

  return SuspenseContext.Provider({ value, slot: content });
});

type Scope = {
  store: Set<string>;
  isLoaded: boolean;
};

const CONTENT = 1;
const FALLBACK = 2;

const useSuspense = () => useContext(SuspenseContext);

export { Suspense, useSuspense };
