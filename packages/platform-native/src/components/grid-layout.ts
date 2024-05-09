import type { GridLayout as NSGridLayout } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { GridLayoutAttributes } from '../jsx';
import { gridLayout } from '../factory';

export type GridLayoutProps = {
  ref?: Ref<GridLayoutRef>;
} & GridLayoutAttributes;
export type GridLayoutRef = NSGridLayout;

const GridLayout = component<GridLayoutProps>(props => gridLayout(props), {
  displayName: 'GridLayout',
}) as ComponentFactory<GridLayoutProps>;

export { GridLayout };
