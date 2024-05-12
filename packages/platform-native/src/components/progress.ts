import type { Progress as NSProgress } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { ProgressAttributes } from '../jsx';
import { progress } from '../factory';

export type ProgressProps = {
  ref?: Ref<ProgressRef>;
} & ProgressAttributes;
export type ProgressRef = NSProgress;

const Progress = component<ProgressProps>(props => progress(props), {
  displayName: 'Progress',
}) as ComponentFactory<ProgressProps>;

export { Progress };
