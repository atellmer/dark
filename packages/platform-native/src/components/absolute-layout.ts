import { AbsoluteLayout as NSAbsoluteLayout } from '@nativescript/core';
import { createComponent, forwardRef } from '@dark-engine/core';

import type { AbsoluteLayoutAttributes } from '../jsx';
import { absoluteLayout } from '../factory';

export type AbsoluteLayoutProps = AbsoluteLayoutAttributes;
export type AbsoluteLayoutRef = NSAbsoluteLayout;

const AbsoluteLayout = forwardRef<AbsoluteLayoutProps, AbsoluteLayoutRef>(
  createComponent((props, ref) => {
    return absoluteLayout({ ref, ...props });
  }),
);

export { AbsoluteLayout };
