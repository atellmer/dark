import type { SegmentedBar as NSSegmentedBar } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { SegmentedBarAttributes } from '../jsx';
import { segmentedBar } from '../factory';

export type SegmentedBarProps = {
  ref?: Ref<SegmentedBarRef>;
} & SegmentedBarAttributes;
export type SegmentedBarRef = NSSegmentedBar;

const SegmentedBar = component<SegmentedBarProps>(props => segmentedBar(props), {
  displayName: 'SegmentedBar',
}) as ComponentFactory<SegmentedBarProps>;

export { SegmentedBar };
