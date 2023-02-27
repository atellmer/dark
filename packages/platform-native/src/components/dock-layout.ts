import type { DockLayout as NSDockLayout } from '@nativescript/core';
import { type ComponentFactory, createComponent, forwardRef } from '@dark-engine/core';

import type { DockLayoutAttributes } from '../jsx';
import { dockLayout } from '../factory';

export type DockLayoutProps = DockLayoutAttributes;
export type DockLayoutRef = NSDockLayout;

const DockLayout = forwardRef<DockLayoutProps, DockLayoutRef>(
  createComponent((props, ref) => dockLayout({ ref, ...props }), { displayName: 'DockLayout' }),
) as ComponentFactory<DockLayoutProps, DockLayoutRef>;

export { DockLayout };
