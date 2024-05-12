import type { TabView as NSTabView } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { TabViewAttributes } from '../jsx';
import { tabView } from '../factory';

export type TabViewProps = {
  ref?: Ref<TabViewRef>;
} & TabViewAttributes;
export type TabViewRef = NSTabView;

const TabView = component<TabViewProps>(props => tabView(props), {
  displayName: 'TabView',
}) as ComponentFactory<TabViewProps>;

export { TabView };
