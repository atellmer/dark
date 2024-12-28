import type { DarkElement, SlotProps, Callback, AppResource } from '../shared';
import { detectIsFunction, createError } from '../utils';
import { __useCursor as useCursor } from '../internal';
import { useUpdate } from '../use-update';
import { useEffect } from '../use-effect';
import { component } from '../component';
import { useState } from '../use-state';
import { useEvent } from '../use-event';
import { useMemo } from '../use-memo';
import { $$scope } from '../scope';

function useError(__id?: number): [Error | null, Callback] {
  const cursor = useCursor();
  const $scope = $$scope();
  const inBoundary = cursor.parent?.hook?.getIsBoundary();
  const res = inBoundary ? $scope.getResource(__id) : null;
  const [error, setError] = useState<Error>(() => (inBoundary ? init(res) : null));
  const reset = useEvent(() => {
    inBoundary && $scope.setResource(__id, null);
    setError(null);
  });

  if (inBoundary) {
    cursor.parent.hook.setCatch(setError);
  } else {
    cursor.hook.setCatch(setError);
  }

  return [error, reset];
}

const init = (res: AppResource) => (res?.[1] ? createError(res?.[1]) : null);

type ErrorBoundaryProps = {
  fallback?: DarkElement;
  renderFallback?: (x: RenderFallbackOptions) => DarkElement;
  onError?: (e: Error) => void;
} & Required<SlotProps>;

const ErrorBoundary = component<ErrorBoundaryProps>(
  props => {
    const cursor = useCursor();
    const update = useUpdate();
    const $scope = $$scope();
    const id = useMemo(() => $scope.getNextResourceId(), []);

    cursor.hook.setIsBoundary(true);
    cursor.hook.setUpdate(update);
    cursor.hook.setLevel($scope.getMountLevel());
    cursor.hook.setResId(id);

    return <ErrorBoundaryInternal {...props} id={id} />;
  },
  {
    displayName: 'ErrorBoundary',
  },
);

type ErrorBoundaryInternalProps = {
  id: number;
} & ErrorBoundaryProps;

const ErrorBoundaryInternal = component<ErrorBoundaryInternalProps>(
  ({ id, fallback = null, renderFallback, onError, slot }) => {
    const [error, reset] = useError(id);

    useEffect(() => {
      detectIsFunction(onError) && onError(error);
    }, [error]);

    return error ? (detectIsFunction(renderFallback) ? renderFallback({ error, reset }) : fallback) : slot;
  },
  { displayName: 'ErrorBoundaryInternal' },
);

type RenderFallbackOptions = {
  error: Error;
  reset: Callback;
};

export { useError, ErrorBoundary };
