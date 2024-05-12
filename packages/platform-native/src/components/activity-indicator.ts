import type { ActivityIndicator as NSActivityIndicator } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { ActivityIndicatorAttributes } from '../jsx';
import { activityIndicator } from '../factory';

export type ActivityIndicatorProps = {
  ref?: Ref<ActivityIndicatorRef>;
} & ActivityIndicatorAttributes;
export type ActivityIndicatorRef = NSActivityIndicator;

const ActivityIndicator = component<ActivityIndicatorProps>(props => activityIndicator(props), {
  displayName: 'ActivityIndicator',
}) as ComponentFactory<ActivityIndicatorProps>;

export { ActivityIndicator };
