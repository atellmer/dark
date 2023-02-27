import type { Progress as NSProgress } from '@nativescript/core';
import { type ComponentFactory, createComponent, forwardRef } from '@dark-engine/core';

import type { ProgressAttributes } from '../jsx';
import { progress } from '../factory';

export type ProgressProps = ProgressAttributes;
export type ProgressRef = NSProgress;

const Progress = forwardRef<ProgressProps, ProgressRef>(
  createComponent((props, ref) => progress({ ref, ...props }), { displayName: 'Progress' }),
) as ComponentFactory<ProgressProps, ProgressRef>;

export { Progress };
