import { ActivityIndicator as NSActivityIndicator } from '@nativescript/core';

import { h, createComponent, forwardRef } from '@dark-engine/core';
import { ActivityIndicatorAttributes } from '../jsx';
import type { TagNativeElement } from '../native-element';

export type ActivityIndicatorProps = {} & ActivityIndicatorAttributes;

export type ActivityIndicatorRef = TagNativeElement<NSActivityIndicator>;

const ActivityIndicator = forwardRef<ActivityIndicatorProps, ActivityIndicatorRef>(
  createComponent((props, ref) => {
    return <activity-indicator ref={ref} {...props} />;
  }),
);

export { ActivityIndicator };
