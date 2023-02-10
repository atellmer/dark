import type { SegmentedBar as NSSegmentedBar } from '@nativescript/core';
import { type Component, createComponent, forwardRef } from '@dark-engine/core';

import type { SegmentedBarAttributes } from '../jsx';
import { segmentedBar } from '../factory';

export type SegmentedBarProps = SegmentedBarAttributes;
export type SegmentedBarRef = NSSegmentedBar;

const SegmentedBar = forwardRef<SegmentedBarProps, SegmentedBarRef>(
  createComponent((props, ref) => segmentedBar({ ref, ...props }), { displayName: 'SegmentedBar' }),
) as Component<SegmentedBarProps, SegmentedBarRef>;

export { SegmentedBar };
