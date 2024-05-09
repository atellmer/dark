import type { TabViewItem as NSTabViewItem } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { TabViewItemAttributes } from '../jsx';
import { tabViewItem } from '../factory';

export type TabViewItemProps = {
  ref?: Ref<TabViewItemRef>;
} & TabViewItemAttributes;
export type TabViewItemRef = NSTabViewItem;

const TabViewItem = component<TabViewItemProps>(props => tabViewItem(props), {
  displayName: 'TabViewItem',
}) as ComponentFactory<TabViewItemProps>;

export { TabViewItem };
