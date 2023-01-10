import { ActivityIndicator as NSActivityIndicator } from '@nativescript/core';

import { h, createComponent, forwardRef } from '@dark-engine/core';
import { ActivityIndicatorAttributes } from '../jsx';

export type ActivityIndicatorProps = {} & ActivityIndicatorAttributes;

export type ActivityIndicatorRef = NSActivityIndicator;

const ActivityIndicator = forwardRef<ActivityIndicatorProps, ActivityIndicatorRef>(
  createComponent((props, ref) => {
    return <activity-indicator ref={ref} {...props} />;
  }),
);

export { ActivityIndicator };
