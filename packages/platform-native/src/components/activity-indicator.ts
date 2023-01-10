import { ActivityIndicator as NSActivityIndicator } from '@nativescript/core';

import { createComponent, forwardRef } from '@dark-engine/core';
import { ActivityIndicatorAttributes } from '../jsx';
import { factory } from '../factory';

export type ActivityIndicatorProps = ActivityIndicatorAttributes;
export type ActivityIndicatorRef = NSActivityIndicator;

const activityIndicator = factory('activity-indicator');

const ActivityIndicator = forwardRef<ActivityIndicatorProps, ActivityIndicatorRef>(
  createComponent((props, ref) => {
    return activityIndicator({ ref, ...props });
  }),
);

export { ActivityIndicator };
