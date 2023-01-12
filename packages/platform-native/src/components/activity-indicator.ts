import { ActivityIndicator as NSActivityIndicator } from '@nativescript/core';
import { createComponent, forwardRef } from '@dark-engine/core';

import type { ActivityIndicatorAttributes } from '../jsx';
import { activityIndicator } from '../factory';

export type ActivityIndicatorProps = ActivityIndicatorAttributes;
export type ActivityIndicatorRef = NSActivityIndicator;

const ActivityIndicator = forwardRef<ActivityIndicatorProps, ActivityIndicatorRef>(
  createComponent((props, ref) => {
    return activityIndicator({ ref, ...props });
  }),
);

export { ActivityIndicator };
