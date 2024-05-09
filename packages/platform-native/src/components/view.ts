import type { FlexboxLayout as NSFlexboxLayout } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { FlexboxLayoutAttributes } from '../jsx';
import { flexboxLayout } from '../factory';

export type ViewProps = {
  ref?: Ref<ViewRef>;
} & FlexboxLayoutAttributes;
export type ViewRef = NSFlexboxLayout;

const View = component<ViewProps>(props => flexboxLayout({ flexDirection: 'column', ...props }), {
  displayName: ':View',
}) as ComponentFactory<ViewProps>;

export { View };
