import type { FlexboxLayout as NSFlexboxLayout } from '@nativescript/core';
import { createComponent, forwardRef } from '@dark-engine/core';

import type { FlexboxLayoutAttributes } from '../jsx';
import { flexboxLayout } from '../factory';

export type FlexboxLayoutProps = FlexboxLayoutAttributes;
export type FlexboxLayoutRef = NSFlexboxLayout;

const FlexboxLayout = forwardRef<FlexboxLayoutProps, FlexboxLayoutRef>(
  createComponent((props, ref) => {
    return flexboxLayout({ ref, ...props });
  }),
);

export { FlexboxLayout };
