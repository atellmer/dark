import type { TimePicker as NSTimePicker } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { TimePickerAttributes } from '../jsx';
import { timePicker } from '../factory';

export type TimePickerProps = {
  ref?: Ref<TimePickerRef>;
} & TimePickerAttributes;
export type TimePickerRef = NSTimePicker;

const TimePicker = component<TimePickerProps>(props => timePicker(props), {
  displayName: 'TimePicker',
}) as ComponentFactory<TimePickerProps>;

export { TimePicker };
