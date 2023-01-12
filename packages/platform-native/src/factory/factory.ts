import { View, type ViewDef } from '@dark-engine/core';

type TagProps = Omit<ViewDef, 'as' | 'isVoid'>;

export const factory = (as: string) => (props?: TagProps) => View({ as, ...(props || {}) });
export const frame = factory('frame');
export const page = factory('page');
export const actionBar = factory('action-bar');
export const activityIndicator = factory('activity-indicator');
export const button = factory('button');
export const gridLayout = factory('grid-layout');
export const flexboxLayout = factory('flexbox-layout');
export const stackLayout = factory('stack-layout');
export const tabView = factory('tab-view');
export const tabViewItem = factory('tab-view-item');
export const label = factory('label');
export const image = factory('image');
export const listPicker = factory('list-picker');
export const scrollView = factory('scroll-view');
export const _switch = factory('switch');
export const textField = factory('text-field');
