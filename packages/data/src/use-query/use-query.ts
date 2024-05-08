import {
  type TextBased,
  type AppResource,
  logError,
  detectIsFunction,
  detectIsPromise,
  detectIsEmpty,
  mapRecord,
  useEffect,
  useUpdate,
  useMemo,
  useId,
  $$scope,
  illegal,
  formatErrorMsg,
  throwThis,
  __useSSR as useSSR,
  __useInSuspense as useInSuspense,
} from '@dark-engine/core';

import { ROOT_ID, LIB } from '../constants';
import { type InMemoryCache, checkCache } from '../cache';
import { useCache } from '../client';

export type UseQueryOptions<T, V extends Variables> = {
  variables?: V;
  extractId?: (x: V) => TextBased;
  lazy?: boolean;
  onStart?: () => void;
  onSuccess?: (x: OnSuccessOptions<T, V>) => void;
  onError?: (err: any) => void;
};

function useQuery<T, V extends Variables>(key: string, query: Query<T, V>, options?: UseQueryOptions<T, V>) {
  const {
    variables = {} as V,
    extractId = () => ROOT_ID,
    lazy = false,
    onStart,
    onSuccess,
    onError,
  } = options || { variables: {} as V };
  const $scope = $$scope();
  const { isServer, isHydration, isSSR } = useSSR();
  const cache = useCache();
  checkCache(cache);
  const inSuspense = useInSuspense();
  const cacheId = extractId(variables);
  const id = useMemo(() => $scope.getNextResourceId(), []);
  const state = useMemo<State<T>>(() => createState<T>(cache, key, cacheId, lazy), []);
  const scope = useMemo<Scope<T>>(() => ({ isDirty: false, promise: null }), []);
  const update = useUpdate();
  const initiator = useId();
  const record = cache.read(key, { id: cacheId });
  const isPending = record && detectIsPromise(record.data);
  const pending = isPending ? (record.data as Promise<unknown>) : null;

  state.cacheId = cacheId;

  const make = async ($variables?: V) => {
    const $$variables = $variables || variables;
    const $cacheId = extractId($$variables);
    let data: Awaited<T> = null;

    state.isFetching = true;
    state.error = null;
    cache.__emit({ type: 'query', phase: 'start', key, id: $cacheId, data: $$variables, initiator });
    detectIsFunction(onStart) && onStart();

    try {
      data = await query($$variables);
      cache.__emit({ type: 'query', phase: 'finish', key, id: $cacheId, data, initiator });
      detectIsFunction(onSuccess) && onSuccess({ cache, args: $$variables, data });

      if (isServer) {
        $scope.setResource(id, [data, null]);
      } else {
        state.data = data;
        state.isFetching = false;
        state.error = null;
      }

      if (!detectIsEmpty(data)) {
        cache.write(key, data, { id: $cacheId });
      } else if (pending) {
        cache.delete(key, { id: $cacheId });
      }

      return data;
    } catch (error) {
      logError(error);
      cache.__emit({ type: 'query', phase: 'error', key, id: $cacheId, data: error, initiator });
      detectIsFunction(onError) && onError(error);

      if (isServer) {
        $scope.setResource(id, [null, String(error)]);
      } else {
        state.isFetching = false;
        state.error = String(error);
      }
    } finally {
      if (!isServer) {
        state.isFetching = false;
        state.isLoaded = true;
        update();
      }
    }

    return data;
  };

  const refetch = ($variables?: V) => {
    const $$variables = $variables || variables;
    const $cacheId = extractId($$variables);
    const promise = make(variables);

    cache.__emit({ type: 'query', phase: 'promise', key, id: $cacheId, initiator, promise });
    scope.promise = promise;
    update();

    return promise;
  };

  // !
  if (isSSR) {
    const res = $scope.getResource(id) as AppResource<T>;

    if (isServer) {
      if (res) {
        mutate(state, res);
      } else {
        throwThis(make());
      }
    } else if (isHydration) {
      if (!res) illegal(formatErrorMsg(LIB, `Can't read app state from the server!`));
      const [data] = res;

      mutate(state, res);

      if (!detectIsEmpty(data)) {
        cache.write(key, data, { id: cacheId });
      }
    }
  } else if (!lazy && !scope.isDirty) {
    scope.isDirty = true;

    if (pending) {
      pending.then(x => {
        state.data = x as T;
        state.isFetching = false;
        state.isLoaded = true;
      });
      throwThis(pending);
    } else {
      const promise = make();

      cache.write(key, promise, { id: cacheId });
      throwThis(promise);
    }
  } else if (inSuspense && scope.promise) {
    const { promise } = scope;

    scope.promise = null;
    throwThis(promise);
  }

  useEffect(() => {
    if (isHydration || lazy || pending || state.isFetching || record?.valid) return;
    refetch();
  }, [...mapRecord(variables)]);

  useEffect(() => {
    const $key = key;
    const $initiator = initiator;
    const offs = [
      cache.subscribe(({ type, key, id }) => {
        if (key === $key && id === state.cacheId) {
          if (type === 'invalidate' || type === 'optimistic') {
            if (cache.__canUpdate(key)) {
              refetch();
            }
          }
        }
      }),
      cache.monitor(async ({ type, phase, key, id, initiator, promise, data }) => {
        if ($initiator !== initiator && type === 'query' && key === $key && id === state.cacheId) {
          if (phase === 'promise' && promise) {
            state.isFetching = true;
            state.error = null;
            scope.promise = promise as Promise<T>;

            update();

            try {
              state.data = (await promise) as T;
              state.error = null;
            } catch (error) {
              state.error = String(error);
            }
          } else if (phase === 'finish') {
            state.data = data as T;
            state.error = null;
          }

          state.isFetching = false;
          state.isLoaded = true;
          update();
        }
      }),
    ];

    return () => offs.forEach(x => x());
  }, []);

  const result: QueryResult<T> = {
    isFetching: state.isFetching,
    data: state.data,
    error: state.error,
    refetch: x => refetch(x as V),
  };

  return result;
}

function createState<T>(cache: InMemoryCache, key: string, cacheId: TextBased, lazy: boolean) {
  const state: State<T> = {
    isFetching: !lazy,
    isLoaded: false,
    data: null,
    error: null,
    cacheId,
  };
  const record = cache.read(key, { id: cacheId });

  if (record) {
    state.isFetching = false;
    state.isLoaded = true;
    state.data = record.data as T;
  }

  return state;
}

function mutate<T>(state: State<T>, res: AppResource<T>) {
  const [data, error] = res;

  state.isFetching = false;
  state.isLoaded = true;
  state.data = data;
  state.error = error;
}

type State<T> = {
  isFetching: boolean;
  isLoaded: boolean;
  data: T;
  error: string;
  cacheId: TextBased;
};

type Scope<T> = {
  isDirty: boolean;
  promise: Promise<T>;
};

type OnSuccessOptions<T, V extends Variables> = { cache: InMemoryCache; data: T; args: V };
export type QueryResult<T> = { refetch: Query<T> } & Pick<State<T>, 'isFetching' | 'data' | 'error'>;
export type Variables<K extends string = string, V = any> = Record<K, V>;
export type Query<T, V extends Variables = Variables> = (variables?: V) => Promise<T>;

export { useQuery };
