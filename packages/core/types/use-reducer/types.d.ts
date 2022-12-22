export type Reducer<S = any, A = any> = (prevState: S, action: A) => S;
export type ReducerState<R extends Reducer> = R extends Reducer<infer S, any> ? S : never;
export type ReducerAction<R extends Reducer> = R extends Reducer<any, infer A> ? A : never;
export type Dispatch<A> = (value: A) => void;
