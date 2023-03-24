import type { SegmentedBar as NSSegmentedBar } from '@nativescript/core';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { SegmentedBarAttributes } from '../jsx';
import { segmentedBar } from '../factory';

export type SegmentedBarProps = SegmentedBarAttributes;
export type SegmentedBarRef = NSSegmentedBar;

const SegmentedBar = forwardRef<SegmentedBarProps, SegmentedBarRef>(
  component((props, ref) => segmentedBar({ ref, ...props }), { displayName: 'SegmentedBar' }),
) as ComponentFactory<SegmentedBarProps, SegmentedBarRef>;

export { SegmentedBar };
