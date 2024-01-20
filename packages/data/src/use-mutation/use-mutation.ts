import { error, detectIsFunction, useUpdate, useMemo } from '@dark-engine/core';

import { type InMemoryCache, checkCache } from '../cache';
import { useCache } from '../client';

type UseMutationOptions<T, P> = {
  refetchQueries?: Array<string>;
  onSuccess?: (x: OnSuccessOptions<T, P>) => void;
  onError?: (err: any) => void;
};

function useMutation<M extends Mutation>(
  key: string,
  mutation: M,
  options: UseMutationOptions<Awaited<ReturnType<M>>, Parameters<M>>,
) {
  type Params = Parameters<M>;
  type AwaitedResult = Awaited<ReturnType<M>>;
  const { refetchQueries = [], onSuccess, onError } = options || {};
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
      state.data = data;
      cache.__emit({ type: 'mutation', phase: 'finish', key, data });
      detectIsFunction(onSuccess) && onSuccess({ cache, args, data });
      refetchQueries.forEach(x => cache.invalidate({ key: x }));
    } catch (err) {
      error(err);
      state.error = String(err);
      cache.__emit({ type: 'mutation', phase: 'error', key, data: err });
      detectIsFunction(onError) && onError(err);
    } finally {
      state.isFetching = false;
      update();
    }

    return data;
  };
  const result: MutationResult<AwaitedResult> = {
    isFetching: state.isFetching,
    data: state.data,
    error: state.error,
  };

  return [make, result] as [(...args: Params) => ReturnType<M>, MutationResult<AwaitedResult>];
}

type OnSuccessOptions<T, P> = { cache: InMemoryCache; data: T; args: P };
type State<T> = { isFetching: boolean; data: T; error: string };
type MutationResult<T> = Pick<State<T>, 'isFetching' | 'data' | 'error'>;
type Mutation = (...args: Array<unknown>) => Promise<unknown>;

export { useMutation };
