import { currentFiberStore } from '../scope';
import { useEffect } from '../use-effect';
import { useUpdate } from '../use-update';
import { useMemo } from '../use-memo';

type ErrorScope = {
  error: Error;
};

function useError(): Error | null {
  const fiber = currentFiberStore.get();
  const update = useUpdate();
  const scope: ErrorScope = useMemo(() => ({ error: null }), []);

  fiber.catch = (error: Error) => {
    scope.error = error;
    update();
  };

  useEffect(() => {
    scope.error = null;
  }, [scope.error]);

  return scope.error;
}

export { useError };
