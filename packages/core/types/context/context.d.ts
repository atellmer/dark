import type { Context } from './types';
declare type CreateContextOptions = {
  displayName?: string;
};
declare function createContext<T>(defaultValue: T, options?: CreateContextOptions): Context<T>;
export { createContext };
