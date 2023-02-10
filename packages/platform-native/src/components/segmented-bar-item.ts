import type { SegmentedBarItem as NSSegmentedBarItem } from '@nativescript/core';
import { type Component, createComponent, forwardRef } from '@dark-engine/core';

import type { SegmentedBarItemAttributes } from '../jsx';
import { segmentedBarItem } from '../factory';

export type SegmentedBarItemProps = SegmentedBarItemAttributes;
export type SegmentedBarItemRef = NSSegmentedBarItem;

const SegmentedBarItem = forwardRef<SegmentedBarItemProps, SegmentedBarItemRef>(
  createComponent((props, ref) => segmentedBarItem({ ref, ...props }), { displayName: 'SegmentedBarItem' }),
) as Component<SegmentedBarItemProps, SegmentedBarItemRef>;

export { SegmentedBarItem };
