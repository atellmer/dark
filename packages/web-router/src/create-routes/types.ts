import { type DarkElement } from '@dark-engine/core';

export type PathMatchStrategy = 'prefix' | 'full';

export type Route = {
  path: string;
  redirectTo?: string;
  children?: Array<Route>;
  pathMatch?: PathMatchStrategy;
  render?: (slot?: DarkElement) => DarkElement;
};

export type Routes = Array<Route>;

export type FullRoute = {
  fullPath: string;
  parent: FullRoute;
  children: Array<FullRoute>;
  matchRender: (path: string) => DarkElement;
} & Omit<Route, 'children'>;

export type FullRoutes = Array<FullRoute>;
