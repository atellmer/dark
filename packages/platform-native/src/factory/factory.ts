import { View, type ViewOptions } from '@dark-engine/core';

type TagProps = Omit<ViewOptions, 'as' | 'isVoid'>;

export const factory = (as: string) => (props?: TagProps) => View({ as, ...(props || {}) });
export const frame = factory('frame');
export const page = factory('page');
export const contentView = factory('content-view');
export const scrollView = factory('scroll-view');
export const rootLayout = factory('root-layout');
export const absoluteLayout = factory('absolute-layout');
export const stackLayout = factory('stack-layout');
export const dockLayout = factory('dock-layout');
export const flexboxLayout = factory('flexbox-layout');
export const gridLayout = factory('grid-layout');
export const wrapLayout = factory('grid-layout');
export const label = factory('label');
export const button = factory('button');
export const htmlView = factory('html-view');
export const webView = factory('web-view');
export const actionBar = factory('action-bar');
export const actionItem = factory('action-item');
export const navigationButton = factory('navigation-button');
export const activityIndicator = factory('activity-indicator');
export const formattedString = factory('formatted-string');
export const span = factory('span');
export const image = factory('image');
export const listPicker = factory('list-picker');
export const placeholder = factory('placeholder');
export const progress = factory('progress');
export const searchBar = factory('search-bar');
export const segmentedBar = factory('segmented-bar');
export const segmentedBarItem = factory('segmented-bar-item');
export const slider = factory('slider');
export const _switch = factory('switch');
export const textField = factory('text-field');
export const textView = factory('text-view');
export const datePicker = factory('date-picker');
export const timePicker = factory('time-picker');
export const tabView = factory('tab-view');
export const tabViewItem = factory('tab-view-item');
export const listView = factory('internal:list-view');
