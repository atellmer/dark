import { createContext, useContext } from '@dark-engine/core';

import { type RouterLocation } from '../location';
import { type RouterHistory } from '../history';
import { type Route } from '../create-routes';

export type ActiveRouteContextValue = {
  location: RouterLocation;
  params: Map<string, string>;
  route: Route;
};

const ActiveRouteContext = createContext<ActiveRouteContextValue>(null, { displayName: 'ActiveRoute' });

const useActiveRouteContext = () => useContext(ActiveRouteContext);

export type RouterHistoryContextValue = {
  history: RouterHistory;
};

const RouterHistoryContext = createContext<RouterHistoryContextValue>(null, { displayName: 'RouterHistory' });

const useRouterHistoryContext = () => useContext(RouterHistoryContext);

const CurrentPathContext = createContext<string>(null, { displayName: 'CurrentPath' });

const useCurrentPathContext = () => useContext(CurrentPathContext);

const PendingContext = createContext(false, { displayName: 'Pending' });

const usePendingContext = () => useContext(PendingContext);

function checkContextValue(value: ActiveRouteContextValue | RouterHistoryContextValue) {
  if (!value) {
    throw new Error('[web-router]: illegal invoke hook outside router!');
  }
}

export {
  ActiveRouteContext,
  useActiveRouteContext,
  RouterHistoryContext,
  PendingContext,
  useRouterHistoryContext,
  CurrentPathContext,
  useCurrentPathContext,
  usePendingContext,
  checkContextValue,
};
