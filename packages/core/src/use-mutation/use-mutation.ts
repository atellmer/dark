import { error, detectIsFunction } from '../utils';
import { useUpdate } from '../use-update';
import { useMemo } from '../use-memo';
import { type InMemoryCache, useCache } from '../cache';

type UseMutatinOptions = {
  refetchQueries?: Array<string>;
  onComplete?: (x: InMemoryCache) => void;
};

function useMutation<M extends Mutation>(mutation: M, options?: UseMutatinOptions) {
  type FnParams = Parameters<M>;
  type FnResult = ReturnType<M>;
  const { refetchQueries = [], onComplete } = options || {};
  const update = useUpdate();
  const cache = useCache();
  const state = useMemo<State<FnResult>>(() => ({ isFetching: false, data: null, error: null }), []);
  const make = async (...args: FnParams) => {
    try {
      state.isFetching = true;
      state.error = null;
      update();
      await mutation(...args);
      refetchQueries.forEach(x => cache.invalidate(x));
      detectIsFunction(onComplete) && onComplete(cache);
    } catch (err) {
      error(err);
      state.error = String(err);
    } finally {
      state.isFetching = false;
      update();
    }
  };
  const result: Result<FnResult> = {
    loading: state.isFetching,
    data: state.data,
    error: state.error,
  };

  return [make, result] as [(...args: FnParams) => FnResult, Result<FnResult>];
}

type State<T> = {
  isFetching: boolean;
  data: T;
  error: string;
};

type Result<T> = {
  loading: boolean;
} & Pick<State<T>, 'data' | 'error'>;

type Mutation = (...args: Array<unknown>) => Promise<unknown>;

export { useMutation };
