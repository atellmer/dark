import type { FlexboxLayout as NSFlexboxLayout } from '@nativescript/core';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { FlexboxLayoutAttributes } from '../jsx';
import { flexboxLayout } from '../factory';

export type FlexboxLayoutProps = FlexboxLayoutAttributes;
export type FlexboxLayoutRef = NSFlexboxLayout;

const FlexboxLayout = forwardRef<FlexboxLayoutProps, FlexboxLayoutRef>(
  component((props, ref) => flexboxLayout({ ref, ...props }), { displayName: 'FlexboxLayout' }),
) as ComponentFactory<FlexboxLayoutProps, FlexboxLayoutRef>;

export { FlexboxLayout };
