import type { TabViewItem as NSTabViewItem } from '@nativescript/core';
import { createComponent, forwardRef } from '@dark-engine/core';

import type { TabViewItemAttributes } from '../jsx';
import { tabViewItem } from '../factory';

export type TabViewItemProps = TabViewItemAttributes;
export type TabViewItemRef = NSTabViewItem;

const TabViewItem = forwardRef<TabViewItemProps, TabViewItemRef>(
  createComponent((props, ref) => {
    return tabViewItem({ ref, ...props });
  }),
);

export { TabViewItem };
