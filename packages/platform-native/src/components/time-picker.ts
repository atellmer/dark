import type { TimePicker as NSTimePicker } from '@nativescript/core';
import { type Component, createComponent, forwardRef } from '@dark-engine/core';

import type { TimePickerAttributes } from '../jsx';
import { timePicker } from '../factory';

export type TimePickerProps = TimePickerAttributes;
export type TimePickerRef = NSTimePicker;

const TimePicker = forwardRef<TimePickerProps, TimePickerRef>(
  createComponent((props, ref) => timePicker({ ref, ...props }), { displayName: 'TimePicker' }),
) as Component<TimePickerProps, TimePickerRef>;

export { TimePicker };
