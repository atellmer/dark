import {
  type TextBased,
  type AppResource,
  logError,
  detectIsFunction,
  detectIsPromise,
  detectIsEmpty,
  hasKeys,
  mapRecord,
  useEffect,
  useUpdate,
  useMemo,
  useId,
  $$scope,
  throwThis,
  __useSSR as useSSR,
  __useInSuspense as useInSuspense,
} from '@dark-engine/core';

import { type InMemoryCache, checkCache } from '../cache';
import { illegal, stringify } from '../utils';
import { ROOT_ID } from '../constants';
import { useCache } from '../client';

export type UseQueryOptions<T, V extends Variables> = {
  variables?: V;
  extractId?: (x: V) => TextBased;
  lazy?: boolean;
  strategy?: Strategy;
  onStart?: () => void;
  onSuccess?: (x: OnSuccessOptions<T, V>) => void;
  onError?: (err: any) => void;
};

function useQuery<T, V extends Variables>(key: string, query: Query<T, V>, options?: UseQueryOptions<T, V>) {
  const {
    variables = {} as V,
    extractId = $extractId,
    lazy = false,
    strategy = 'suspense-only',
    onStart,
    onSuccess,
    onError,
  } = options || { variables: {} as V };
  checkStrategy(strategy);
  const $scope = $$scope();
  const { isServer, isHydration, isSSR } = useSSR();
  const cache = useCache();
  checkCache(cache);
  const inSuspense = useInSuspense();
  const cacheId = extractId(variables);
  const id = useMemo(() => $scope.getNextResourceId(), []);
  const state = useMemo<State<T>>(() => createState<T>(cache, key, cacheId, lazy), []);
  const scope = useMemo<Scope<T>>(() => ({ isDirty: false, fromRefetch: false, promise: null }), []);
  const update = useUpdate();
  const initiator = useId();
  const record = cache.read<T>(key, { id: cacheId });
  const isPending = record && detectIsPromise(record.data);
  const pending = isPending ? (record.data as Promise<T>) : null;
  const isSuspenseOnly = strategy === 'suspense-only';
  const isHybrid = strategy === 'hybrid';
  const isStateOnly = strategy === 'state-only';

  state.cacheId = cacheId;

  const make = async ($variables?: V) => {
    const $$variables = $variables || variables;
    const $cacheId = extractId($$variables);
    let data: Awaited<T> = null;

    state.isFetching = true;
    state.error = null;
    cache.__emit({ type: 'query', phase: 'start', key, id: $cacheId, data: $$variables, initiator });
    !isServer && detectIsFunction(onStart) && onStart();

    try {
      data = await query($$variables);
      cache.__emit({ type: 'query', phase: 'finish', key, id: $cacheId, data, initiator });
      !isServer && detectIsFunction(onSuccess) && onSuccess({ cache, args: $$variables, data });

      if (isServer) {
        $scope.setResource(id, [data, null]);
      } else {
        state.data = data;
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
      !isServer && detectIsFunction(onError) && onError(error);

      if (isServer) {
        $scope.setResource(id, [null, String(error)]);
      } else {
        state.error = String(error);
      }
    } finally {
      state.isFetching = false;
      state.isLoaded = true;

      if (!isServer) {
        if (scope.fromRefetch) {
          scope.fromRefetch = false;
          update();
        }
      }
    }

    return data;
  };

  const refetch = ($variables?: V) => {
    scope.fromRefetch = true;
    const $$variables = $variables || variables;
    const $cacheId = extractId($$variables);
    const promise = make($$variables);

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
      if (!res) illegal(`Can't read app state from the server!`);
      const [data] = res;

      mutate(state, res);

      if (!detectIsEmpty(data)) {
        cache.write(key, data, { id: cacheId });
      }
    }
  } else {
    if (!lazy && !scope.isDirty) {
      scope.isDirty = true;

      if (record) {
        if (pending) {
          pending.then(x => {
            state.data = x;
            state.isFetching = false;
            state.isLoaded = true;
          });

          if (isSuspenseOnly || isHybrid) {
            throwThis(pending);
          } else if (isStateOnly) {
            update();
          }
        } else {
          state.data = record.data;
          state.isFetching = false;
          state.isLoaded = true;
        }
      } else {
        const promise = make();

        cache.write(key, promise, { id: cacheId });

        if (isSuspenseOnly || isHybrid) {
          throwThis(promise);
        } else if (isStateOnly) {
          scope.fromRefetch = true;
          update();
        }
      }
    } else if (scope.promise) {
      const { promise } = scope;

      scope.promise = null;
      isSuspenseOnly && inSuspense && throwThis(promise);
    }
  }

  useEffect(() => {
    const shouldSkip = isHydration || lazy || pending || state.isFetching || record?.valid;

    if (shouldSkip) return;
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

  // !
  const { isFetching, data, error } = state;
  const result: QueryResult<T> = { isFetching, data, error, refetch };

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

    if (detectIsPromise(state.data)) {
      state.isFetching = true;
      state.isLoaded = false;
    }
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

function $extractId<V extends Variables>(v: V) {
  return !detectIsEmpty(v) && hasKeys(v) ? stringify(v) : ROOT_ID;
}

const strategies = new Set<Strategy>(['suspense-only', 'hybrid', 'state-only']);

function checkStrategy(strategy: Strategy) {
  if (!strategies.has(strategy)) {
    illegal('Wrong use-query strategy!');
  }
}

type Strategy =
  | 'suspense-only' // Always uses the fallback of the nearest Suspense in the tree
  | 'hybrid' // Uses Suspense fallback only during the mount phase, then uses its isFetching flag to show the loading UI.
  | 'state-only'; // Always uses its isFetching flag and never uses Suspense fallback

type State<T> = {
  isFetching: boolean;
  isLoaded: boolean;
  data: T;
  error: string;
  cacheId: TextBased;
};

type Scope<T> = {
  isDirty: boolean;
  fromRefetch: boolean;
  promise: Promise<T>;
};

type OnSuccessOptions<T, V extends Variables> = { cache: InMemoryCache; data: T; args: V };
export type QueryResult<T> = { refetch: Query<T> } & Pick<State<T>, 'isFetching' | 'data' | 'error'>;
export type Variables<K extends string = string, V = any> = Record<K, V>;
export type Query<T, V extends Variables = Variables> = (variables?: V) => Promise<T>;

export { useQuery };
