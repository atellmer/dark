import { error, detectIsFunction, useUpdate, useMemo } from '@dark-engine/core';

import { type InMemoryCache, checkCache } from '../cache';
import { useCache } from '../client';

type UseMutatinOptions<T> = {
  key: string;
  refetchQueries?: Array<string>;
  onSuccess?: (x: InMemoryCache, data: T) => void;
};

function useMutation<M extends Mutation>(mutation: M, options: UseMutatinOptions<Awaited<ReturnType<M>>>) {
  type Params = Parameters<M>;
  type AwaitedResult = Awaited<ReturnType<M>>;
  const { key, refetchQueries = [], onSuccess } = options || {};
  const update = useUpdate();
  const cache = useCache();
  checkCache(cache);
  const state = useMemo<State<AwaitedResult>>(() => ({ isFetching: false, data: null, error: null }), []);
  const make = async (...args: Params) => {
    let data: AwaitedResult = null;

    cache.__emit({ type: 'mutation', phase: 'start', key, data: args });

    try {
      state.isFetching = true;
      state.error = null;
      update();
      data = (await mutation(...args)) as AwaitedResult;
      cache.__emit({ type: 'mutation', phase: 'finish', key, data });
      detectIsFunction(onSuccess) && onSuccess(cache, data);
      refetchQueries.forEach(x => cache.invalidate({ key: x }));
    } catch (err) {
      error(err);
      state.error = String(err);
      cache.__emit({ type: 'mutation', phase: 'error', key, data: err });
    } finally {
      state.isFetching = false;
      update();
    }

    return data;
  };
  const result: MutationResult<AwaitedResult> = {
    loading: state.isFetching,
    data: state.data,
    error: state.error,
  };

  return [make, result] as [(...args: Params) => ReturnType<M>, MutationResult<AwaitedResult>];
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
