import type { TabView as NSTabView } from '@nativescript/core';
import { type ComponentFactory, createComponent, forwardRef } from '@dark-engine/core';

import type { TabViewAttributes } from '../jsx';
import { tabView } from '../factory';

export type TabViewProps = TabViewAttributes;
export type TabViewRef = NSTabView;

const TabView = forwardRef<TabViewProps, TabViewRef>(
  createComponent((props, ref) => tabView({ ref, ...props }), { displayName: 'TabView' }),
) as ComponentFactory<TabViewProps, TabViewRef>;

export { TabView };
