import { error, detectIsFunction } from '../utils';
import { useUpdate } from '../use-update';
import { useMemo } from '../use-memo';
import { type InMemoryCache, useCache } from '../cache';

type UseMutatinOptions<T> = {
  refetchQueries?: Array<string>;
  onSuccess?: (x: InMemoryCache, data: T) => void;
};

function useMutation<M extends Mutation>(mutation: M, options?: UseMutatinOptions<Awaited<ReturnType<M>>>) {
  type Params = Parameters<M>;
  type AwaitedResult = Awaited<ReturnType<M>>;
  const { refetchQueries = [], onSuccess } = options || {};
  const update = useUpdate();
  const cache = useCache();
  const state = useMemo<State<AwaitedResult>>(() => ({ isFetching: false, data: null, error: null }), []);
  const make = async (...args: Params) => {
    let data: AwaitedResult = null;

    try {
      state.isFetching = true;
      state.error = null;
      update();
      data = (await mutation(...args)) as AwaitedResult;
      detectIsFunction(onSuccess) && onSuccess(cache, data);
      refetchQueries.forEach(x => cache.invalidate({ key: x }));
    } catch (err) {
      error(err);
      state.error = String(err);
    } finally {
      state.isFetching = false;
      update();
    }

    return data;
  };
  const result: Result<AwaitedResult> = {
    loading: state.isFetching,
    data: state.data,
    error: state.error,
  };

  return [make, result] as [(...args: Params) => ReturnType<M>, Result<AwaitedResult>];
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
