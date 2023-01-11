import { View, type ViewDef } from '@dark-engine/core';

type TagProps = Omit<ViewDef, 'as' | 'isVoid'>;

const factory = (as: string) => (props?: TagProps) => View({ as, ...(props || {}) });

const frame = factory('frame');
const page = factory('page');

export { factory, frame, page };
