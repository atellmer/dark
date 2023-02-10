import type { FlexboxLayout as NSFlexboxLayout } from '@nativescript/core';
import { type Component, createComponent, forwardRef } from '@dark-engine/core';

import type { FlexboxLayoutAttributes } from '../jsx';
import { flexboxLayout } from '../factory';

export type ViewProps = FlexboxLayoutAttributes;
export type ViewRef = NSFlexboxLayout;

const View = forwardRef<ViewProps, ViewRef>(
  createComponent((props, ref) => flexboxLayout({ ref, flexDirection: 'column', ...props }), { displayName: ':View' }),
) as Component<ViewProps, ViewRef>;

export { View };
