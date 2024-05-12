import type { ContentView as NSContentView } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { ContentViewAttributes } from '../jsx';
import { contentView } from '../factory';

export type ContentViewProps = {
  ref?: Ref<ContentViewRef>;
} & ContentViewAttributes;
export type ContentViewRef = NSContentView;

const ContentView = component<ContentViewProps>(props => contentView(props), {
  displayName: 'ContentView',
}) as ComponentFactory<ContentViewProps>;

export { ContentView };
