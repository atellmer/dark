import { View, type ViewDef } from '@dark-engine/core';

type TagProps = Omit<ViewDef, 'as' | 'isVoid'>;

export const factory = (as: string) => (props?: TagProps) => View({ as, ...(props || {}) });

export const qMainWindow = factory('q:main-window');
export const qFlexLayout = factory('q:flex-layout');
export const qLabel = factory('q:label');
export const qPushButton = factory('q:push-button');
export const qImage = factory('q:image');
