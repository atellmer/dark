import {
  type TextBased,
  type AppResource,
  type Callback,
  logError,
  detectIsFunction,
  detectIsEmpty,
  mapRecord,
  detectIsServer,
  useEffect,
  useUpdate,
  useMemo,
  $$scope,
  nextTick,
  illegal,
  __useSuspense as useSuspense,
} from '@dark-engine/core';

import { ROOT_ID } from '../constants';

import { type InMemoryCache, checkCache } from '../cache';
import { useCache } from '../client';

export type UseQueryOptions<T, V extends Variables> = {
  variables?: V;
  extractId?: (x: V) => TextBased;
  lazy?: boolean;
  onSuccess?: (x: OnSuccessOptions<T, V>) => void;
  onError?: (err: any) => void;
};

function useQuery<T, V extends Variables>(key: string, query: Query<T, V>, options?: UseQueryOptions<T, V>) {
  const {
    variables = {} as V,
    extractId = () => ROOT_ID,
    lazy = false,
    onSuccess,
    onError,
  } = options || { variables: {} as V };
  const $scope = $$scope();
  const cache = useCache();
  checkCache(cache);
  const cacheId = extractId(variables);
  const id = useMemo(() => $scope.getNextResourceId(), []);
  const state = useMemo<State<T>>(() => createState<T>(cache, key, cacheId, lazy), []);
  const { register, unregister } = useSuspense();
  const [mounted, firstTime] = useMounted();
  const update = useUpdate();
  const $update = () => mounted() && update();
  const isServer = detectIsServer();
  const isHydrateZone = $scope.getIsHydrateZone();
  const { isLoaded } = state;

  state.cacheId = cacheId;

  const make = async ($variables?: V) => {
    const $$variables = $variables || variables;
    const $cacheId = extractId($$variables);

    cache.__emit({ type: 'query', phase: 'start', key, data: $$variables });

    try {
      if (!isServer && !firstTime()) {
        state.isFetching = true;
        $update();
      }

      const data = await query($$variables);

      cache.__emit({ type: 'query', phase: 'finish', key, data });
      detectIsFunction(onSuccess) && onSuccess({ cache, args: $$variables, data });

      if (isServer) {
        $scope.setResource(id, [data, null]);
      } else {
        unregister(id);
        state.data = data;
        state.isFetching = false;
        state.error = null;
      }

      if (!detectIsEmpty(data)) {
        cache.write(key, data, { id: $cacheId });
      }

      return data;
    } catch (err) {
      logError(err);
      cache.__emit({ type: 'query', phase: 'error', key, data: err });
      detectIsFunction(onError) && onError(err);

      if (isServer) {
        $scope.setResource(id, [null, String(err)]);
      } else {
        unregister(id);
        state.isFetching = false;
        state.error = String(err);
      }
    } finally {
      if (!isServer) {
        state.isLoaded = true;
        $update();
      }
    }
  };

  useEffect(() => {
    if (isHydrateZone) return;
    if (lazy) return;
    const record = cache.read(key, { id: cacheId });

    if (record?.valid) return;

    make();
  }, [...mapRecord(variables)]);

  useEffect(() => {
    const $key = key;
    let off: Callback = null;

    off = cache.subscribe(({ type, key, id }) => {
      if (key === $key && id === state.cacheId) {
        if (type === 'invalidate' || type === 'optimistic') {
          if (cache.__canUpdate(key)) {
            make();
          }
        }
      }
    });

    return () => {
      unregister(id);
      detectIsFunction(off) && off();
    };
  }, []);

  if (isServer || isHydrateZone) {
    const res = $scope.getResource(id) as AppResource<T>;

    if (isServer) {
      if (res) {
        mutate(state, res);
      } else {
        $scope.defer(make);
      }
    } else if (isHydrateZone) {
      if (!res) illegal(`[data]: Can't read app state from the server!`);
      const [data] = res;

      mutate(state, res);

      if (!detectIsEmpty(data)) {
        cache.write(key, data, { id: cacheId });
      }
    }
  } else {
    firstTime() && !isLoaded && !lazy && register(id);
  }

  const result: QueryResult<T> = {
    isFetching: state.isFetching,
    data: state.data,
    error: state.error,
    refetch: make,
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

function useMounted() {
  const scope = useMemo(() => ({ isMounted: true, isFirstTime: true }), []);

  useEffect(() => {
    nextTick(() => {
      scope.isFirstTime = false;
    });
    return () => (scope.isMounted = false);
  }, []);

  return [() => scope.isMounted, () => scope.isFirstTime] as [BooleanFn, BooleanFn];
}

type State<T> = {
  isFetching: boolean;
  isLoaded: boolean;
  data: T;
  error: string;
  cacheId: TextBased;
};

type BooleanFn = () => boolean;
type OnSuccessOptions<T, V extends Variables> = { cache: InMemoryCache; data: T; args: V };
export type QueryResult<T> = { refetch: Query<T> } & Pick<State<T>, 'isFetching' | 'data' | 'error'>;
export type Variables<K extends string = string, V = any> = Record<K, V>;
export type Query<T, V extends Variables = Variables> = (variables?: V) => Promise<T>;

export { useQuery };
