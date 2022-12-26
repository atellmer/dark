import { type DarkElement } from '@dark-engine/core';

export type PathMatchStrategy = 'prefix' | 'full';

export type RouteDescriptor = {
  path: string;
  redirectTo?: string;
  pathMatch?: PathMatchStrategy;
  children?: Array<RouteDescriptor>;
  render?: (slot?: DarkElement) => DarkElement;
};

export type Routes = Array<RouteDescriptor>;
