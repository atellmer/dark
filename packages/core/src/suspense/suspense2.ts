import type { DarkElement, SlotProps } from '../shared';
import { createContext, useContext } from '../context';
import { useUpdate } from '../use-update';
import { component } from '../component';
import { Fragment } from '../fragment';
import { useMemo } from '../use-memo';
import { forwardRef } from '../ref';
import { Shadow } from '../shadow';

type SuspenseContextValue = {
  isPending: boolean;
  isLoaded: boolean;
  wait: (promise: Promise<unknown>, isInline?: boolean) => void;
};

const SuspenseContext = createContext<SuspenseContextValue>(null, { displayName: 'Suspense' });

const useSuspense = () => useContext(SuspenseContext);

type SuspenseProps = {
  name?: string;
  fallback?: DarkElement;
} & Required<SlotProps>;

const Suspense = forwardRef<SuspenseProps, unknown>(
  component(
    ({ name = '', fallback = null, slot }) => {
      const suspense = useSuspense();
      const update = useUpdate();
      const scope = useMemo<Scope>(
        () => ({
          isInline: false,
          promises: [],
          value: { isPending: false, isLoaded: false, wait: null },
        }),
        [],
      );
      const { isInline, value } = scope;
      const isFallback = suspense && isInline ? suspense.isPending : value.isPending;
      const content = [
        isFallback ? Fragment({ key: FALLBACK, slot: fallback }) : null,
        Shadow({ key: CONTENT, isOpen: !isFallback, slot }),
      ].filter(Boolean);

      const markAsPending = (isPending: boolean) => {
        scope.value = { ...scope.value, isPending };
      };

      value.wait = (promise: Promise<unknown>, isInline = false) => {
        scope.isInline = isInline;

        if (suspense && isInline) {
          suspense.wait(promise, isInline);
        } else {
          markAsPending(true);
          update();

          promise.finally(() => {
            markAsPending(false);
            update();
          });
        }
      };

      if (name) {
        console.log('--SUSPENSE--' + name, value.isPending);
      }

      return SuspenseContext.Provider({ value, slot: content });
    },
    { displayName: 'Suspense' },
  ),
);

type Scope = {
  isInline: boolean;
  promises: Array<Promise<unknown>>;
  value: SuspenseContextValue;
};

const CONTENT = 1;
const FALLBACK = 2;

export { Suspense, useSuspense };
