import { Switch as NSSwitch } from '@nativescript/core';

import { h, createComponent, forwardRef } from '@dark-engine/core';
import { SwitchAttributes } from '../jsx';
import type { TagNativeElement } from '../native-element';

export type SwitchProps = {} & SwitchAttributes;

export type SwitchRef = TagNativeElement<NSSwitch>;

const Switch = forwardRef<SwitchProps, SwitchRef>(
  createComponent((props, ref) => {
    return <switch ref={ref} {...props} />;
  }),
);

export { Switch };
