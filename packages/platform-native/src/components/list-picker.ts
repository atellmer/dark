import type { ListPicker as NSListPicker } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { ListPickerAttributes } from '../jsx';
import { listPicker } from '../factory';

export type ListPickerProps = {
  ref?: Ref<ListPickerRef>;
} & ListPickerAttributes;
export type ListPickerRef = NSListPicker;

const ListPicker = component<ListPickerProps>(props => listPicker(props), {
  displayName: 'ListPicker',
}) as ComponentFactory<ListPickerProps>;

export { ListPicker };
