import { type AbstractSignal } from '../abstract-signal';

type Context = (x: AbstractSignal) => void;

export interface SupportContext {
  context: Context;
}

let context: Context | null = null;

const getContext = (): Context | null => context;

const setContext = (x: Context | null) => (context = x);

const addToContext = (x: AbstractSignal) => context && context(x);

export { getContext, setContext, addToContext };
