import { View, type ViewDef } from '@dark-engine/core';

type TagProps = Omit<ViewDef, 'as' | 'isVoid'>;

export const factory = (as: string) => (props?: TagProps) => View({ as, ...(props || {}) });
