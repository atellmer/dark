import type { TabViewItem as NSTabViewItem } from '@nativescript/core';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { TabViewItemAttributes } from '../jsx';
import { tabViewItem } from '../factory';

export type TabViewItemProps = TabViewItemAttributes;
export type TabViewItemRef = NSTabViewItem;

const TabViewItem = forwardRef<TabViewItemProps, TabViewItemRef>(
  component((props, ref) => tabViewItem({ ref, ...props }), { displayName: 'TabViewItem' }),
) as ComponentFactory<TabViewItemProps, TabViewItemRef>;

export { TabViewItem };
