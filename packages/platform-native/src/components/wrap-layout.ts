import type { WrapLayout as NSWrapLayout } from '@nativescript/core';
import { type ComponentFactory, createComponent, forwardRef } from '@dark-engine/core';

import type { WrapLayoutAttributes } from '../jsx';
import { wrapLayout } from '../factory';

export type WrapLayoutProps = WrapLayoutAttributes;
export type WrapLayoutRef = NSWrapLayout;

const WrapLayout = forwardRef<WrapLayoutProps, WrapLayoutRef>(
  createComponent((props, ref) => wrapLayout({ ref, ...props }), { displayName: 'WrapLayout' }),
) as ComponentFactory<WrapLayoutProps, WrapLayoutRef>;

export { WrapLayout };
