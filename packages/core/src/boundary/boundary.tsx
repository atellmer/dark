import type { DarkElement, SlotProps, Callback } from '../shared';
import { __useCursor as useCursor } from '../internal';
import { detectIsFunction } from '../utils';
import { useUpdate } from '../use-update';
import { useEffect } from '../use-effect';
import { component } from '../component';
import { useState } from '../use-state';
import { useEvent } from '../use-event';

function useError(): [Error | null, Callback] {
  const cursor = useCursor();
  const update = useUpdate();
  const [error, setError] = useState<Error>(null);
  const reset = useEvent(() => setError(null));

  cursor.hook.setIsBoundary(true);
  cursor.hook.setCatch(setError);
  cursor.hook.setUpdate(update);

  return [error, reset];
}

type ErrorBoundaryProps = {
  fallback?: DarkElement;
  renderFallback?: (x: RenderFallbackOptions) => DarkElement;
  onError?: (e: Error) => void;
} & Required<SlotProps>;

const ErrorBoundary = component<ErrorBoundaryProps>(
  ({ fallback = null, renderFallback, onError, slot }) => {
    const [error, reset] = useError();

    useEffect(() => {
      detectIsFunction(onError) && onError(error);
    }, [error]);

    return error ? (detectIsFunction(renderFallback) ? renderFallback({ error, reset }) : fallback) : slot;
  },
  {
    displayName: 'ErrorBoundary',
  },
);

type RenderFallbackOptions = {
  error: Error;
  reset: Callback;
};

export { useError, ErrorBoundary };
