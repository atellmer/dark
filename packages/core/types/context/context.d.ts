import type { Context } from './types';
type CreateContextOptions = {
  displayName?: string;
};
declare function createContext<T>(defaultValue: T, options?: CreateContextOptions): Context<T>;
declare function useContext<T>(context: Context<T>): T;
export { createContext, useContext };
