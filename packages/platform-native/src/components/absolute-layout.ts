import type { AbsoluteLayout as NSAbsoluteLayout } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { AbsoluteLayoutAttributes } from '../jsx';
import { absoluteLayout } from '../factory';

export type AbsoluteLayoutProps = {
  ref?: Ref<AbsoluteLayoutRef>;
} & AbsoluteLayoutAttributes;
export type AbsoluteLayoutRef = NSAbsoluteLayout;

const AbsoluteLayout = component<AbsoluteLayoutProps>(props => absoluteLayout(props), {
  displayName: 'AbsoluteLayout',
}) as ComponentFactory<AbsoluteLayoutProps>;

export { AbsoluteLayout };
