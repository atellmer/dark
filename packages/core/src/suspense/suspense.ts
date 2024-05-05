import type { DarkElement, SlotProps, TextBased } from '../shared';
import { dummyFn, illegal, formatErrorMsg } from '../utils';
import { createContext, useContext } from '../context';
import { useLayoutEffect } from '../use-layout-effect';
import { detectIsServer } from '../platform';
import { detectIsFiberAlive } from '../walk';
import { useUpdate } from '../use-update';
import { component } from '../component';
import { useState } from '../use-state';
import { Fragment } from '../fragment';
import { useMemo } from '../use-memo';
import { forwardRef } from '../ref';
import { $$scope } from '../scope';
import { Shadow } from '../shadow';
import { LIB } from '../constants';

type SuspenseContextValue = {
  isLoaded: boolean;
  fallback: DarkElement;
  register: (id: TextBased) => void;
  unregister: (id: TextBased) => void;
  update: () => void;
};

const SuspenseContext = createContext<SuspenseContextValue>(
  {
    isLoaded: false,
    fallback: null,
    register: dummyFn,
    unregister: dummyFn,
    update: null,
  },
  { displayName: 'Suspense' },
);

const useSuspense = () => useContext(SuspenseContext);

type SuspenseProps = {
  fallback: DarkElement;
} & Required<SlotProps>;

const Suspense = forwardRef<SuspenseProps, unknown>(
  component(
    ({ fallback, slot }) => {
      if (process.env.NODE_ENV !== 'production') {
        if (!fallback) {
          illegal(formatErrorMsg(LIB, `The fallback was not found!`));
        }
      }
      const $scope = $$scope();
      const emitter = $scope.getEmitter();
      const suspense = useSuspense();
      const update = useUpdate();
      const [isLoaded, setIsLoaded] = useState(() => detectIsServer() || $scope.getIsHydrateZone());
      const scope = useMemo<Scope>(() => ({ store: new Set(), isLoaded }), []);
      const value = useMemo<SuspenseContextValue>(
        () => ({ isLoaded, fallback, update: null, register: null, unregister: null }),
        [],
      );
      const fiber = $scope.getCursorFiber();
      const content = [
        Shadow({ key: CONTENT, isInserted: isLoaded, slot }),
        isLoaded ? null : Fragment({ key: FALLBACK, slot: fallback }),
      ].filter(Boolean);

      useLayoutEffect(() => {
        const off = emitter.on('prefinish', () => {
          const { store, isLoaded } = scope;

          if (store.size === 0 && !isLoaded) {
            off();
            setIsLoaded(true);
          }
        });

        return off;
      }, []);

      scope.isLoaded = isLoaded;
      value.isLoaded = isLoaded;
      value.fallback = fallback;
      value.update = () => (detectIsFiberAlive(fiber) ? update() : suspense.update && suspense.update());
      value.register = (id: TextBased) => scope.store.add(id);
      value.unregister = (id: TextBased) => scope.store.delete(id);

      return SuspenseContext.Provider({ value, slot: content });
    },
    { displayName: 'Suspense' },
  ),
);

type Scope = { store: Set<TextBased>; isLoaded: boolean };

const CONTENT = 1;
const FALLBACK = 2;

export { Suspense, useSuspense };
