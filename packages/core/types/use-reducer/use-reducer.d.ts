import type { Reducer, Dispatch, ReducerAction, ReducerState } from './types';
declare function useReducer<R extends Reducer>(
  reducer: R,
  initialState: ReducerState<R>,
  initializer?: (state: ReducerState<R>) => ReducerState<R>,
): [ReducerState<R>, Dispatch<ReducerAction<R>>];
export { useReducer };
