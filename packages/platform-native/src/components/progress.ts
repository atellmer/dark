import type { Progress as NSProgress } from '@nativescript/core';
import { createComponent, forwardRef } from '@dark-engine/core';

import type { ProgressAttributes } from '../jsx';
import { progress } from '../factory';

export type ProgressProps = ProgressAttributes;
export type ProgressRef = NSProgress;

const Progress = forwardRef<ProgressProps, ProgressRef>(
  createComponent((props, ref) => {
    return progress({ ref, ...props });
  }),
);

export { Progress };
