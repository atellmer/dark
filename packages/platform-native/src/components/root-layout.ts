import type { RootLayout as NSRootLayout } from '@nativescript/core';
import { type ComponentFactory, createComponent, forwardRef } from '@dark-engine/core';

import type { RootLayoutAttributes } from '../jsx';
import { rootLayout } from '../factory';

export type RootLayoutProps = RootLayoutAttributes;
export type RootLayoutRef = NSRootLayout;

const RootLayout = forwardRef<RootLayoutProps, RootLayoutRef>(
  createComponent((props, ref) => rootLayout({ ref, ...props }), { displayName: 'RootLayout' }),
) as ComponentFactory<RootLayoutProps, RootLayoutRef>;

export { RootLayout };
