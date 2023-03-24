import type { FlexboxLayout as NSFlexboxLayout } from '@nativescript/core';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { FlexboxLayoutAttributes } from '../jsx';
import { flexboxLayout } from '../factory';

export type ViewProps = FlexboxLayoutAttributes;
export type ViewRef = NSFlexboxLayout;

const View = forwardRef<ViewProps, ViewRef>(
  component((props, ref) => flexboxLayout({ ref, flexDirection: 'column', ...props }), { displayName: ':View' }),
) as ComponentFactory<ViewProps, ViewRef>;

export { View };
