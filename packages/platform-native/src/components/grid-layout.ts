import type { GridLayout as NSGridLayout } from '@nativescript/core';
import { createComponent, forwardRef } from '@dark-engine/core';

import type { GridLayoutAttributes } from '../jsx';
import { gridLayout } from '../factory';

export type GridLayoutProps = GridLayoutAttributes;
export type GridLayoutRef = NSGridLayout;

const GridLayout = forwardRef<GridLayoutProps, GridLayoutRef>(
  createComponent((props, ref) => {
    return gridLayout({ ref, ...props });
  }),
);

export { GridLayout };
