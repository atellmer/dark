import { WrapLayout as NSWrapLayout } from '@nativescript/core';
import { createComponent, forwardRef } from '@dark-engine/core';

import type { WrapLayoutAttributes } from '../jsx';
import { wrapLayout } from '../factory';

export type WrapLayoutProps = WrapLayoutAttributes;
export type WrapLayoutRef = NSWrapLayout;

const WrapLayout = forwardRef<WrapLayoutProps, WrapLayoutRef>(
  createComponent((props, ref) => {
    return wrapLayout({ ref, ...props });
  }),
);

export { WrapLayout };
