import type { DarkElement, SlotProps, Callback } from '../shared';
import { component, detectIsComponent } from '../component';
import { __useCursor as useCursor } from '../internal';
import { detectIsVirtualNodeFactory } from '../view';
import { detectIsFunction } from '../utils';
import { useEffect } from '../use-effect';
import { useState } from '../use-state';
import { useEvent } from '../use-event';

function useError(): [Error | null, Callback] {
  const cursor = useCursor();
  const [error, setError] = useState<Error>(null);
  const reset = useEvent(() => setError(null));

  cursor.hook.setCatch(setError);

  return [error, reset];
}

type ErrorBoundaryProps = {
  fallback: (x: ErrorBoundaryFallbackOptions) => DarkElement;
  onError?: (e: Error) => void;
} & Required<SlotProps>;

const ErrorBoundary = component<ErrorBoundaryProps>(
  ({ fallback, onError, slot }) => {
    const [error, reset] = useError();

    useEffect(() => {
      detectIsFunction(onError) && onError(error);
    }, [error]);

    return error
      ? detectIsComponent(fallback) || detectIsVirtualNodeFactory(fallback)
        ? fallback
        : detectIsFunction(fallback)
        ? fallback({ error, reset })
        : slot
      : slot;
  },
  { displayName: 'ErrorBoundary' },
);

export type ErrorBoundaryFallbackOptions = {
  error: Error;
  reset: Callback;
};

export { useError, ErrorBoundary };
