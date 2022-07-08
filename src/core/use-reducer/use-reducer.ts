import { useState } from '@core/use-state';
import { useCallback } from '@core/use-callback';
import { useMemo } from '@core/use-memo';
import { isFunction } from '@helpers';
import type { Reducer, Dispatch, ReducerAction, ReducerState } from './model';

function useReducer<R extends Reducer>(
  reducer: R,
  initialState: ReducerState<R>,
  initializer?: (state: ReducerState<R>) => ReducerState<R>,
): [ReducerState<R>, Dispatch<ReducerAction<R>>] {
  const initialValue = useMemo(() => {
    return isFunction(initializer) ? initializer(initialState) : initialState;
  }, []);
  const [state, setState] = useState<ReducerState<R>>(initialValue);
  const dispatch = useCallback((action: ReducerAction<R>) => setState(state => reducer(state, action)), []) as Dispatch<
    ReducerAction<R>
  >;

  return [state, dispatch];
}

export { useReducer };
