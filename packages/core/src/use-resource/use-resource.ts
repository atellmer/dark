import { type InMemoryCache, useCache, CACHE_ROOT_ID } from '../cache';
import { type AppResource, type Callback } from '../shared';
import { useLayoutEffect } from '../use-layout-effect';
import { error, detectIsFunction } from '../utils';
import { detectIsServer } from '../platform';
import { useEffect } from '../use-effect';
import { useSuspense } from '../suspense';
import { useUpdate } from '../use-update';
import { useMemo } from '../use-memo';
import { $$scope } from '../scope';

type UseResourceOptions<V extends Variables> = {
  variables?: V;
  key?: string;
  extractId?: (x: V) => string;
};

function useResource<T, V extends Variables>(query: Query<T, V>, options?: UseResourceOptions<V>) {
  const { variables = {} as V, key, extractId = () => CACHE_ROOT_ID } = options || { variables: {} as V };
  const cache = useCache();
  const state = useMemo<State<T, V>>(() => createState<T, V>(cache, key, extractId(variables)), []);
  const { register, unregister } = useSuspense();
  const [mounted, firstTime] = useMounted();
  const update = useUpdate();
  const $update = () => mounted() && update();
  const $scope = $$scope();
  const id = useMemo(() => $scope.getNextResourceId(), []);
  const $id = String(id);
  const isServer = detectIsServer();
  const isHydrateZone = $scope.getIsHydrateZone();
  const { isLoaded } = state;

  state.variables = variables;

  const make = async (isRefetch?: boolean, $variables?: V) => {
    const $$variables = isRefetch ? $variables : variables;

    try {
      if (!isServer && !firstTime()) {
        state.isFetching = true;
        $update();
      }
      const data = await query($$variables);

      if (isServer) {
        $scope.setResource(id, [data, null]);
      } else {
        unregister($id);
        state.data = data;
        state.isFetching = false;
        state.error = null;
        key && cache?.write(key, data, extractId($$variables));
      }

      return data;
    } catch (err) {
      error(err);

      if (isServer) {
        $scope.setResource(id, [null, String(err)]);
      } else {
        unregister($id);
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
    if (key && cache && isLoaded) return;
    make();
  }, [...mapRecord(variables)]);

  useEffect(() => {
    let off: Callback = null;

    if (cache) {
      off = cache.onInvalidate(({ key: $key, record }) => {
        if ($key === key && record.id === extractId(state.variables)) {
          make();
        }
      });
    }

    return () => {
      unregister($id);
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
      mutate(state, res);
    }
  } else {
    firstTime() && !isLoaded && register($id);
  }

  const result: QueryResult<T> = {
    loading: state.isFetching,
    data: state.data,
    error: state.error,
    refetch: (variables: V) => make(true, variables),
  };

  return result;
}

function createState<T, V>(cache: InMemoryCache, key: string, id: string) {
  const state: State<T, V> = { isFetching: true, isLoaded: false, data: null, error: null, variables: null };

  if (cache) {
    const record = cache.read<T>(key, id);

    if (record) {
      state.isFetching = false;
      state.isLoaded = true;
      state.data = record.value;
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

function useMounted() {
  const scope = useMemo(() => ({ isMounted: true, isFirstTime: true }), []);
  const { isFirstTime } = scope;

  useLayoutEffect(() => {
    scope.isFirstTime = false;
    return () => (scope.isMounted = false);
  }, []);

  return [() => scope.isMounted, () => isFirstTime] as [BooleanFn, BooleanFn];
}

const mapRecord = (record: object) => Object.keys(record).map(x => record[x]);

type BooleanFn = () => boolean;

type State<T, V = unknown> = {
  isFetching: boolean;
  isLoaded: boolean;
  data: T;
  error: string;
  variables: V;
};

type QueryResult<T> = {
  loading: boolean;
  data: T;
  error: string;
  refetch: Query<T>;
};

type Variables<K extends string = string, V = any> = Record<K, V>;

type Query<T, V extends Variables = Variables> = (variables: V) => Promise<T>;

export { useResource };
