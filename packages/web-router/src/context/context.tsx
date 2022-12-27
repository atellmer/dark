import { createContext, useContext } from '@dark-engine/core';
import { type RouterHistory } from '../history';
import { type Route } from '../create-routes';

export type RouterContextValue = {
  paramsMap: Map<string, string>;
  matched: Route;
};

const RouterContext = createContext<RouterContextValue>(null, { displayName: 'Router' });

function useRouterContext() {
  const value = useContext(RouterContext);

  return value;
}

export type RouterHistoryContextValue = {
  history: RouterHistory;
};

const RouterHistoryContext = createContext<RouterHistoryContextValue>(null, { displayName: 'RouterHistory' });

function useRouterHistoryContext() {
  const value = useContext(RouterHistoryContext);

  return value;
}

export { RouterContext, useRouterContext, RouterHistoryContext, useRouterHistoryContext };
