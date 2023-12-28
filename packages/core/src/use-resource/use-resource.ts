import { useLayoutEffect } from '../use-layout-effect';
import { type AppStateData, type AppState } from '../shared';
import { detectIsServer } from '../platform';
import { useEffect } from '../use-effect';
import { useSuspense } from '../suspense';
import { useUpdate } from '../use-update';
import { APP_STATE } from '../constants';
import { useMemo } from '../use-memo';
import { $$scope } from '../scope';
import { useId } from '../use-id';
import { error } from '../utils';

function useResource<T>(fetch: FetchFn<T>, deps: Array<any> = []) {
  const state = useMemo<State<T>>(() => ({ isFetching: true, isLoaded: false, data: null, error: null }), []);
  const { register, unregister } = useSuspense();
  const [mounted, firstTime] = useMounted();
  const update = useUpdate();
  const $update = () => !isServer && mounted() && update();
  const id = useId();
  const $scope = $$scope();
  const isServer = detectIsServer();
  const isHydrateZone = $scope.getIsHydrateZone();
  const make = async () => {
    try {
      if (!firstTime()) {
        state.isFetching = true;
        $update();
      }
      let data: T = null;
      const cache = $scope.getAppStateData(id) as AppStateData<T>;

      if (cache && !cache[1]) {
        data = cache[0] as T;
      } else {
        data = await fetch();
      }

      unregister(id);
      state.data = data;
      state.isFetching = false;
      state.error = null;
      $scope.setAppStateData(id, [data, null]);
      return data;
    } catch (err) {
      error(err);
      unregister(id);
      state.isFetching = false;
      state.error = String(err);
      $scope.setAppStateData(id, [null, String(err)]);
    } finally {
      state.isLoaded = true;
      $update();
    }
  };

  useEffect(() => {
    if (isHydrateZone) {
      const appState = globalThis[APP_STATE] as AppState;
      if (!appState) throw new Error('[Dark]: can not read app state from the server!');
      const [data, error] = appState.get(id);

      state.isFetching = false;
      state.isLoaded = true;
      state.data = data as T;
      state.error = error;
    } else {
      make();
    }
  }, [...deps]);

  useEffect(() => () => unregister(id), []);

  if (isServer) {
    if (!state.isLoaded) {
      $scope.defer(make);
    }
  } else {
    firstTime() && register(id);
  }

  const value: Resource<T> = {
    loading: state.isFetching,
    data: state.data,
    error: state.error,
    refetch: make,
  };

  return value;
}

function useMounted() {
  const scope = useMemo(() => ({ isMounted: true, isFirstTime: true }), []);
  const { isFirstTime } = scope;

  useLayoutEffect(() => {
    scope.isFirstTime = false;
    return () => (scope.isMounted = false);
  }, []);

  return [() => scope.isMounted, () => isFirstTime] as [() => boolean, () => boolean];
}

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
