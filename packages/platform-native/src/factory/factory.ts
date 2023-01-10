import { View, type ViewDef } from '@dark-engine/core';

type TagProps = Omit<ViewDef, 'as' | 'isVoid'>;

const factory = (as: string) => (props?: TagProps) => View({ as, ...(props || {}) });

export { factory };
