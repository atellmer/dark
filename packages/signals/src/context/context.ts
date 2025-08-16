import { type AbstractSignal } from '../abstract-signal';

export interface SupportContext {
  __add: (x: AbstractSignal) => void;
}

let context: SupportContext | null = null;

const getContext = (): SupportContext | null => context;

const setContext = (x: SupportContext | null) => (context = x);

const addToContext = (x: AbstractSignal) => context && context.__add(x);

export { getContext, setContext, addToContext };
