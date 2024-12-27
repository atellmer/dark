import type { DarkElement, SlotProps, Callback } from '../shared';
import { __useCursor as useCursor } from '../internal';
import { detectIsFunction } from '../utils';
import { useEffect } from '../use-effect';
import { component } from '../component';
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
  fallback: (e: Error, reset: Callback) => DarkElement;
  onError?: (e: Error) => void;
} & Required<SlotProps>;

const ErrorBoundary = component<ErrorBoundaryProps>(
  ({ fallback, onError, slot }) => {
    const [error, reset] = useError();

    useEffect(() => {
      detectIsFunction(onError) && onError(error);
    }, [error]);

    return error ? fallback(error, reset) : slot;
  },
  { displayName: 'ErrorBoundary' },
);

export { useError, ErrorBoundary };
