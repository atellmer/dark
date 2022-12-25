import { createContext, useContext } from '@dark-engine/core';

export type RouterContextValue = {};

const RouterContext = createContext<RouterContextValue>(null);

function useRouterContext() {
  const value = useContext(RouterContext);

  return value;
}

export { RouterContext, useRouterContext };
