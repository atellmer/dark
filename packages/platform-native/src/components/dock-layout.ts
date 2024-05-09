import type { DockLayout as NSDockLayout } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { DockLayoutAttributes } from '../jsx';
import { dockLayout } from '../factory';

export type DockLayoutProps = {
  ref?: Ref<DockLayoutRef>;
} & DockLayoutAttributes;
export type DockLayoutRef = NSDockLayout;

const DockLayout = component<DockLayoutProps>(props => dockLayout(props), {
  displayName: 'DockLayout',
}) as ComponentFactory<DockLayoutProps>;

export { DockLayout };
