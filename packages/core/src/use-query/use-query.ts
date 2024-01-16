import { type InMemoryCache, useCache, MonitorEventType, CACHE_ROOT_ID } from '../cache';
import { type AppResource, type Callback, type TextBased } from '../shared';
import { error, detectIsFunction, mapRecord } from '../utils';
import { useLayoutEffect } from '../use-layout-effect';
import { detectIsServer } from '../platform';
import { useEffect } from '../use-effect';
import { useSuspense } from '../suspense';
import { useUpdate } from '../use-update';
import { useMemo } from '../use-memo';
import { $$scope } from '../scope';

type UseQueryOptions<V extends Variables> = {
  key: string;
  variables?: V;
  extractId?: (x: V) => TextBased;
};

function useQuery<T, V extends Variables>(query: Query<T, V>, options: UseQueryOptions<V>) {
  const { variables = {} as V, key: cacheKey, extractId = () => CACHE_ROOT_ID } = options || { variables: {} as V };
  const $scope = $$scope();
  const cache = useCache();
  const cacheId = extractId(variables);
  const id = useMemo(() => $scope.getNextResourceId(), []);
  const state = useMemo<State<T>>(() => createState<T>(cache, cacheKey, cacheId), []);
  const { register, unregister } = useSuspense();
  const [mounted, firstTime] = useMounted();
  const update = useUpdate();
  const $update = () => mounted() && update();
  const isServer = detectIsServer();
  const isHydrateZone = $scope.getIsHydrateZone();
  const { isLoaded } = state;

  state.cacheKey = cacheKey;
  state.cacheId = cacheId;

  const make = async (isRefetch?: boolean, $variables?: V) => {
    const $$variables = isRefetch ? $variables : variables;
    const $cacheId = extractId($$variables);

    cache.__emit({ type: MonitorEventType.QUERY, phase: 'start', key: cacheKey, data: $$variables });

    try {
      if (!isServer && !firstTime()) {
        state.isFetching = true;
        $update();
      }

      const data = await query($$variables);

      cache.__emit({ type: MonitorEventType.QUERY, phase: 'finish', key: cacheKey, data });

      if (isServer) {
        $scope.setResource(id, [data, null]);
      } else {
        unregister(id);
        state.data = data;
        state.isFetching = false;
        state.error = null;
      }

      if (data) {
        cache.write({ key: cacheKey, id: $cacheId, data });
      }

      return data;
    } catch (err) {
      error(err);
      cache.__emit({ type: MonitorEventType.QUERY, phase: 'error', key: cacheKey, data: err });

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
    const record = cache.read({ key: cacheKey, id: cacheId });

    if (record?.valid) return;

    make();
  }, [...mapRecord(variables)]);

  useEffect(() => {
    let off: Callback = null;

    off = cache.subscribe(({ type, key, id }) => {
      if (key === state.cacheKey && id === state.cacheId) {
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
      if (!res) throw new Error('[Dark]: can not read app state from the server!');
      const [data] = res;

      mutate(state, res);

      if (data) {
        cache.write({ key: cacheKey, id: cacheId, data });
      }
    }
  } else {
    firstTime() && !isLoaded && register(id);
  }

  const result: Result<T> = {
    loading: state.isFetching,
    data: state.data,
    error: state.error,
    refetch: (variables: V) => make(true, variables),
  };

  return result;
}

function createState<T>(cache: InMemoryCache, cacheKey: string, cacheId: TextBased) {
  const state: State<T> = {
    isFetching: true,
    isLoaded: false,
    data: null,
    error: null,
    cacheKey,
    cacheId,
  };
  const record = cache.read({ key: cacheKey, id: cacheId });

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
  const { isFirstTime } = scope;

  useLayoutEffect(() => {
    scope.isFirstTime = false;
    return () => (scope.isMounted = false);
  }, []);

  return [() => scope.isMounted, () => isFirstTime] as [BooleanFn, BooleanFn];
}

type BooleanFn = () => boolean;

type State<T> = {
  isFetching: boolean;
  isLoaded: boolean;
  data: T;
  error: string;
  cacheId: TextBased;
  cacheKey: string;
};

type Result<T> = {
  loading: boolean;
  data: T;
  error: string;
  refetch: Query<T>;
};

type Variables<K extends string = string, V = any> = Record<K, V>;

type Query<T, V extends Variables = Variables> = (variables: V) => Promise<T>;

export { useQuery };
