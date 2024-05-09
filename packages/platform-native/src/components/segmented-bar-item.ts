import type { SegmentedBarItem as NSSegmentedBarItem } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { SegmentedBarItemAttributes } from '../jsx';
import { segmentedBarItem } from '../factory';

export type SegmentedBarItemProps = {
  ref?: Ref<SegmentedBarItemRef>;
} & SegmentedBarItemAttributes;
export type SegmentedBarItemRef = NSSegmentedBarItem;

const SegmentedBarItem = component<SegmentedBarItemProps>(props => segmentedBarItem(props), {
  displayName: 'SegmentedBarItem',
}) as ComponentFactory<SegmentedBarItemProps>;

export { SegmentedBarItem };
