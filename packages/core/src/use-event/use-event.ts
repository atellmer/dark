import { useMemo } from '../use-memo';
import { useCallback } from '../use-callback';

function useEvent<T extends (...args: Array<any>) => any>(fn: T) {
  const scope = useMemo(() => ({ fn }), []);

  scope.fn = fn;

  const callback = useCallback((...args: Array<any>) => {
    return scope.fn(...args);
  }, []);

  return callback as unknown as T;
}

export { useEvent };
