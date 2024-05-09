import type { RootLayout as NSRootLayout } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { RootLayoutAttributes } from '../jsx';
import { rootLayout } from '../factory';

export type RootLayoutProps = {
  ref?: Ref<RootLayoutRef>;
} & RootLayoutAttributes;
export type RootLayoutRef = NSRootLayout;

const RootLayout = component<RootLayoutProps>(props => rootLayout(props), {
  displayName: 'RootLayout',
}) as ComponentFactory<RootLayoutProps>;

export { RootLayout };
