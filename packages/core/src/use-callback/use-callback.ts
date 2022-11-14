import { useMemo } from '../use-memo';

function useCallback<T = Function>(callback: T, deps: Array<any>): T {
  const value = useMemo(() => callback, deps);

  return value;
}

export { useCallback };
