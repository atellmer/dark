import type { FlexboxLayout as NSFlexboxLayout } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { FlexboxLayoutAttributes } from '../jsx';
import { flexboxLayout } from '../factory';

export type FlexboxLayoutProps = {
  ref?: Ref<FlexboxLayoutRef>;
} & FlexboxLayoutAttributes;
export type FlexboxLayoutRef = NSFlexboxLayout;

const FlexboxLayout = component<FlexboxLayoutProps>(props => flexboxLayout(props), {
  displayName: 'FlexboxLayout',
}) as ComponentFactory<FlexboxLayoutProps>;

export { FlexboxLayout };
