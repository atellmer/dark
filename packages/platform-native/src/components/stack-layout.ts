import type { StackLayout as NSStackLayout } from '@nativescript/core';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { StackLayoutAttributes } from '../jsx';
import { stackLayout } from '../factory';

export type StackLayoutProps = StackLayoutAttributes;
export type StackLayoutRef = NSStackLayout;

const StackLayout = forwardRef<StackLayoutProps, StackLayoutRef>(
  component((props, ref) => stackLayout({ ref, ...props }), { displayName: 'StackLayout' }),
) as ComponentFactory<StackLayoutProps, StackLayoutRef>;

export { StackLayout };
