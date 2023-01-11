import { View, type ViewDef } from '@dark-engine/core';

type TagProps = Omit<ViewDef, 'as' | 'isVoid'>;

export const factory = (as: string) => (props?: TagProps) => View({ as, ...(props || {}) });

export const frame = factory('frame');
export const page = factory('page');
export const gridLayout = factory('grid-layout');
export const stackLayout = factory('stack-layout');
export const tabView = factory('tab-view');
export const tabViewItem = factory('tab-view-item');
export const label = factory('label');
