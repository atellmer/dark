import { DarkElement } from '@dark-engine/core';

export type Routes = Array<Route>;

export type FullRoutes = Array<FullRoute>;

export type Route = {
  path: string;
  redirectTo?: string;
  children?: Array<Route>;
  pathMatch?: 'prefix' | 'full';
  render?: (slot?: DarkElement) => DarkElement;
};

export type FullRoute = {
  fullPath: string;
  parent: FullRoute;
  matchRender: (path: string) => DarkElement;
} & Route;
