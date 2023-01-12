import { DockLayout as NSDockLayout } from '@nativescript/core';
import { createComponent, forwardRef } from '@dark-engine/core';

import type { DockLayoutAttributes } from '../jsx';
import { dockLayout } from '../factory';

export type DockLayoutProps = DockLayoutAttributes;
export type DockLayoutRef = NSDockLayout;

const DockLayout = forwardRef<DockLayoutProps, DockLayoutRef>(
  createComponent((props, ref) => {
    return dockLayout({ ref, ...props });
  }),
);

export { DockLayout };
