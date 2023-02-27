import type { AbsoluteLayout as NSAbsoluteLayout } from '@nativescript/core';
import { type ComponentFactory, createComponent, forwardRef } from '@dark-engine/core';

import type { AbsoluteLayoutAttributes } from '../jsx';
import { absoluteLayout } from '../factory';

export type AbsoluteLayoutProps = AbsoluteLayoutAttributes;
export type AbsoluteLayoutRef = NSAbsoluteLayout;

const AbsoluteLayout = forwardRef<AbsoluteLayoutProps, AbsoluteLayoutRef>(
  createComponent((props, ref) => absoluteLayout({ ref, ...props }), { displayName: 'AbsoluteLayout' }),
) as ComponentFactory<AbsoluteLayoutProps, AbsoluteLayoutRef>;

export { AbsoluteLayout };
