import { RootLayout as NSRootLayout } from '@nativescript/core';
import { createComponent, forwardRef } from '@dark-engine/core';

import type { RootLayoutAttributes } from '../jsx';
import { rootLayout } from '../factory';

export type RootLayoutProps = RootLayoutAttributes;
export type RootLayoutRef = NSRootLayout;

const RootLayout = forwardRef<RootLayoutProps, RootLayoutRef>(
  createComponent((props, ref) => {
    return rootLayout({ ref, ...props });
  }),
);

export { RootLayout };
