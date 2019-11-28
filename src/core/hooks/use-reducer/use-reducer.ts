import { isFunction, error, isUndefined } from '@helpers';
import { DARK } from '../../constants';
import useState from '../use-state';


type Reducer<S, A> = (prevState: S, action: A) => S;
type ReducerState<R extends Reducer<any, any>> = R extends Reducer<infer S, any> ? S : never;
type ReducerAction<R extends Reducer<any, any>> = R extends Reducer<any, infer A> ? A : never;
type Dispatch<A> = (value: A) => void;

function useReducer<R extends Reducer<any, any>, I>(
  reducer: R,
  initialState: I & ReducerState<R>,
  initializer?: (arg: I & ReducerState<R>) => ReducerState<R>):
  [ReducerState<R>, Dispatch<ReducerAction<R>>] {
	if (!isFunction(reducer)) {
		error(`${DARK}: useReducer must take only function as first argument!`);
		return;
  }
  if (isUndefined(initialState)) {
		error(`${DARK}: useReducer must take initial state as second argument!`);
		return;
  }
  if (!isUndefined(initializer) && !isFunction(initializer)) {
		error(`${DARK}: initializer for useReducer must be a function!`);
		return;
  }
  const initialValue = isFunction(initializer) ? initializer(initialState) : initialState;
  const [state, setState] = useState(initialValue);
  const dispatch = (action: ReducerAction<R>) => {
    const newState = reducer(state, action);

    if (!Object.is(state, newState)) {
      setState(newState);
    }
  };

	return [state, dispatch];
}

export default useReducer;
