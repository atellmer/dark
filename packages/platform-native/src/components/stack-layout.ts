import type { StackLayout as NSStackLayout } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { StackLayoutAttributes } from '../jsx';
import { stackLayout } from '../factory';

export type StackLayoutProps = {
  ref?: Ref<StackLayoutRef>;
} & StackLayoutAttributes;
export type StackLayoutRef = NSStackLayout;

const StackLayout = component<StackLayoutProps>(props => stackLayout(props), {
  displayName: 'StackLayout',
}) as ComponentFactory<StackLayoutProps>;

export { StackLayout };
