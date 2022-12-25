import { DarkElement } from '@dark-engine/core';

export type Route = {
  path: string;
  routes?: RoutesConfig;
  render: () => DarkElement;
};

export type FlatRoute = Omit<Route, 'routes'>;

export type RouteConfig = {
  route: FlatRoute;
  fallback: FlatRoute;
};

export type RoutesConfig = {
  schema: Array<Route>;
  fallback?: FlatRoute;
};

export type RoutesMap = Record<string, RouteConfig>;
