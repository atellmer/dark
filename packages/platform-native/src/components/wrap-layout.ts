import type { WrapLayout as NSWrapLayout } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { WrapLayoutAttributes } from '../jsx';
import { wrapLayout } from '../factory';

export type WrapLayoutProps = {
  ref?: Ref<WrapLayoutRef>;
} & WrapLayoutAttributes;
export type WrapLayoutRef = NSWrapLayout;

const WrapLayout = component<WrapLayoutProps>(props => wrapLayout(props), {
  displayName: 'WrapLayout',
}) as ComponentFactory<WrapLayoutProps>;

export { WrapLayout };
