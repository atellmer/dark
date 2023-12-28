import { useLayoutEffect } from '../use-layout-effect';
import { useReducer } from '../use-reducer';
import { useEffect } from '../use-effect';
import { useSuspense } from '../suspense';
import { useEvent } from '../use-event';
import { useMemo } from '../use-memo';
import { useId } from '../use-id';
import { error } from '../utils';

enum Type {
  LOADING_START,
  LOADING_END,
  ERROR,
}

type State<T> = {
  loading: boolean;
  data: T;
  error: string;
};

type Action<T> = {
  type: Type;
  payload?: T | string;
};

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case Type.LOADING_START:
      return { ...state, loading: true };
    case Type.LOADING_END:
      return { ...state, error: null, loading: false, data: action.payload as T };
    case Type.ERROR:
      return { ...state, loading: false, error: action.payload as string };
    default:
      throw new Error();
  }
}

function useResource<T>(fn: () => Promise<T>, deps: Array<any> = []) {
  const [state, dispatch] = useReducer(reducer, { loading: true, data: null, error: null });
  const { register, unregister } = useSuspense();
  const [mounted, firstTime] = useMounted();
  const id = useId();
  const fetch = useEvent(() => {
    (async () => {
      try {
        !firstTime() && dispatch({ type: Type.LOADING_START });
        const data = await fn();

        if (!mounted()) return;
        unregister(id);
        dispatch({ type: Type.LOADING_END, payload: data });
      } catch (err) {
        error(err);
        if (!mounted()) return;
        unregister(id);
        dispatch({ type: Type.ERROR, payload: String(err) });
      }
    })();
  });

  useEffect(() => fetch(), [...deps]);

  useEffect(() => () => unregister(id), []);

  firstTime() && register(id);

  return { ...(state as State<T>), refetch: fetch };
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

export { useResource };
