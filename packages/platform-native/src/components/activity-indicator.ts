import type { ActivityIndicator as NSActivityIndicator } from '@nativescript/core';
import { type Component, createComponent, forwardRef } from '@dark-engine/core';

import type { ActivityIndicatorAttributes } from '../jsx';
import { activityIndicator } from '../factory';

export type ActivityIndicatorProps = ActivityIndicatorAttributes;
export type ActivityIndicatorRef = NSActivityIndicator;

const ActivityIndicator = forwardRef<ActivityIndicatorProps, ActivityIndicatorRef>(
  createComponent((props, ref) => activityIndicator({ ref, ...props }), { displayName: 'ActivityIndicator' }),
) as Component<ActivityIndicatorProps, ActivityIndicatorRef>;

export { ActivityIndicator };
