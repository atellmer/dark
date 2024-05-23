import { useMemo } from '../use-memo';

function useCallback<T = Function>(callback: T, deps: Array<any>): T {
  return useMemo(() => callback, deps);
}

export { useCallback };
