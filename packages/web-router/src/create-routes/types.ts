import { DarkElement } from '@dark-engine/core';

export type Route = {
  path: string;
  routes?: RoutesConfig;
  render: () => DarkElement;
};

export type FlatRoute = Omit<Route, 'routes'>;

export type SplitFlatRoute = {
  fullPath: string;
  prefix: string;
  split: Array<string>;
} & FlatRoute;

export type RouteConfig = {
  route: SplitFlatRoute;
  fallback: SplitFlatRoute;
};

export type RoutesConfig = {
  schema: Array<Route>;
  fallback?: FlatRoute;
};

export type RoutesMap = Record<string, RouteConfig>;
