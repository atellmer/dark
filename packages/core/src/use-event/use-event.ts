import { useCallback } from '../use-callback';
import { useMemo } from '../use-memo';

function useEvent<T extends (...args: Array<any>) => any>(fn: T) {
  const scope = useMemo(() => ({ fn }), []);
  const callback = useCallback((...args: Array<any>) => scope.fn(...args), []);

  scope.fn = fn;

  return callback as unknown as T;
}

export { useEvent };
