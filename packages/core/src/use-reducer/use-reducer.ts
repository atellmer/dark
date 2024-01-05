import { useState } from '../use-state';
import { useCallback } from '../use-callback';
import { useMemo } from '../use-memo';
import { detectIsFunction } from '../utils';

function useReducer<R extends Reducer>(
  reducer: R,
  initialState: ReducerState<R>,
  initializer?: (state: ReducerState<R>) => ReducerState<R>,
): [ReducerState<R>, Dispatch<ReducerAction<R>>] {
  const initialValue = useMemo(() => (detectIsFunction(initializer) ? initializer(initialState) : initialState), []);
  const [state, setState] = useState<ReducerState<R>>(initialValue);
  const dispatch = useCallback((action: ReducerAction<R>) => setState(state => reducer(state, action)), []) as Dispatch<
    ReducerAction<R>
  >;

  return [state, dispatch];
}

type Reducer<S = any, A = any> = (prevState: S, action: A) => S;

type ReducerState<R extends Reducer> = R extends Reducer<infer S, any> ? S : never;

type ReducerAction<R extends Reducer> = R extends Reducer<any, infer A> ? A : never;

type Dispatch<A> = (value: A) => void;

export { useReducer };
