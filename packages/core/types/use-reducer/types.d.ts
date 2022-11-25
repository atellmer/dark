export declare type Reducer<S = any, A = any> = (prevState: S, action: A) => S;
export declare type ReducerState<R extends Reducer> = R extends Reducer<infer S, any> ? S : never;
export declare type ReducerAction<R extends Reducer> = R extends Reducer<any, infer A> ? A : never;
export declare type Dispatch<A> = (value: A) => void;
