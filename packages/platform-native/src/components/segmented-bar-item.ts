import type { SegmentedBarItem as NSSegmentedBarItem } from '@nativescript/core';
import { type ComponentFactory, createComponent, forwardRef } from '@dark-engine/core';

import type { SegmentedBarItemAttributes } from '../jsx';
import { segmentedBarItem } from '../factory';

export type SegmentedBarItemProps = SegmentedBarItemAttributes;
export type SegmentedBarItemRef = NSSegmentedBarItem;

const SegmentedBarItem = forwardRef<SegmentedBarItemProps, SegmentedBarItemRef>(
  createComponent((props, ref) => segmentedBarItem({ ref, ...props }), { displayName: 'SegmentedBarItem' }),
) as ComponentFactory<SegmentedBarItemProps, SegmentedBarItemRef>;

export { SegmentedBarItem };
