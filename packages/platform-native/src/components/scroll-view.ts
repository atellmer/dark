import type { ScrollView as NSScrollView } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { ScrollViewAttributes } from '../jsx';
import { scrollView } from '../factory';

export type ScrollViewProps = {
  ref?: Ref<ScrollRef>;
} & ScrollViewAttributes;
export type ScrollRef = NSScrollView;

const ScrollView = component<ScrollViewProps>(props => scrollView(props), {
  displayName: 'ScrollView',
}) as ComponentFactory<ScrollViewProps>;

export { ScrollView };
