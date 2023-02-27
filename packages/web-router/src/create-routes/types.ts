import { type ComponentFactory } from '@dark-engine/core';

export type PathMatchStrategy = 'prefix' | 'full';

export type RouteDescriptor = {
  path: string;
  redirectTo?: string;
  pathMatch?: PathMatchStrategy;
  children?: Array<RouteDescriptor>;
  component?: ComponentFactory;
};

export type Routes = Array<RouteDescriptor>;

export type Params = Map<string, string>;
