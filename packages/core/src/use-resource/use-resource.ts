import { useLayoutEffect } from '../use-layout-effect';
import { type AppResource } from '../shared';
import { detectIsServer } from '../platform';
import { useEffect } from '../use-effect';
import { useSuspense } from '../suspense';
import { useUpdate } from '../use-update';
import { useMemo } from '../use-memo';
import { $$scope } from '../scope';
import { error } from '../utils';

function useResource<T>(fetch: FetchFn<T>, deps: Array<any> = []) {
  const state = useMemo<State<T>>(() => ({ isFetching: true, isLoaded: false, data: null, error: null }), []);
  const { register, unregister } = useSuspense();
  const [mounted, firstTime] = useMounted();
  const update = useUpdate();
  const $update = () => mounted() && update();
  const $scope = $$scope();
  const id = useMemo(() => $scope.getNextResourceId(), []);
  const $id = String(id);
  const isServer = detectIsServer();
  const isHydrateZone = $scope.getIsHydrateZone();
  const make = async () => {
    try {
      if (!isServer && !firstTime()) {
        state.isFetching = true;
        $update();
      }
      const data = await fetch();

      if (isServer) {
        $scope.setResource(id, [data, null]);
      } else {
        unregister($id);
        state.data = data;
        state.isFetching = false;
        state.error = null;
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
    !isHydrateZone && make();
  }, [...deps]);

  useEffect(() => () => unregister($id), []);

  if (isServer || isHydrateZone) {
    const cache = $scope.getResource(id) as AppResource<T>;

    if (isServer) {
      if (cache) {
        mutate(state, cache);
      } else {
        $scope.defer(make);
      }
    } else if (isHydrateZone) {
      if (!cache) throw new Error('[Dark]: can not read app state from the server!');
      mutate(state, cache);
    }
  } else {
    firstTime() && register($id);
  }

  const value: Resource<T> = {
    loading: state.isFetching,
    data: state.data,
    error: state.error,
    refetch: make,
  };

  return value;
}

function mutate<T>(state: State<T>, cache: AppResource<T>) {
  const [data, error] = cache;

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
};

type Resource<T> = {
  loading: boolean;
  data: T;
  error: string;
  refetch: FetchFn<T>;
};

type FetchFn<T> = () => Promise<T>;

export { useResource };
