import { error, detectIsString } from '../utils';
import { useUpdate } from '../use-update';
import { useMemo } from '../use-memo';
import { useCache } from '../cache';

type UseMutatinOptions = {
  refetchQueries: Array<
    | string
    | {
        key: string;
        id?: string;
      }
  >;
};

function useMutation<M extends Mutation>(mutation: M, options?: UseMutatinOptions) {
  type Params = Parameters<M>;
  type Result = ReturnType<M>;
  const { refetchQueries = [] } = options || { refetchQueries: [] };
  const update = useUpdate();
  const cache = useCache();
  const state = useMemo<State<Result>>(() => ({ isFetching: false, data: null, error: null }), []);
  const make = async (...args: Params) => {
    try {
      state.isFetching = true;
      state.error = null;
      update();
      await mutation(...args);
      refetchQueries.forEach(x => {
        const key = detectIsString(x) ? x : x.key;
        const id = detectIsString(x) ? undefined : x.id;

        cache.invalidate(key, id);
      });
    } catch (err) {
      error(err);
      state.error = String(err);
    } finally {
      state.isFetching = false;
      update();
    }
  };
  const result: MutationResult<Result> = {
    loading: state.isFetching,
    data: state.data,
    error: state.error,
  };

  return [make, result] as [(...args: Params) => Result, MutationResult<Result>];
}

type State<T> = {
  isFetching: boolean;
  data: T;
  error: string;
};

type MutationResult<T> = {
  loading: boolean;
} & Pick<State<T>, 'data' | 'error'>;

type Mutation = (...args: Array<unknown>) => Promise<unknown>;

export { useMutation };
