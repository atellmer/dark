import { SegmentedBar as NSSegmentedBar } from '@nativescript/core';
import { createComponent, forwardRef } from '@dark-engine/core';

import type { SegmentedBarAttributes } from '../jsx';
import { segmentedBar } from '../factory';

export type SegmentedBarProps = SegmentedBarAttributes;
export type SegmentedBarRef = NSSegmentedBar;

const SegmentedBar = forwardRef<SegmentedBarProps, SegmentedBarRef>(
  createComponent((props, ref) => {
    return segmentedBar({ ref, ...props });
  }),
);

export { SegmentedBar };
