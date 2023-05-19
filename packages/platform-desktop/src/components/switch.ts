import type { Switch as NSSwitch } from '@nativescript/core';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { SwitchAttributes } from '../jsx';
import { _switch } from '../factory';

export type SwitchProps = SwitchAttributes;
export type SwitchRef = NSSwitch;

const Switch = forwardRef<SwitchProps, SwitchRef>(
  component((props, ref) => _switch({ ref, ...props }), { displayName: 'Switch' }),
) as ComponentFactory<SwitchProps, SwitchRef>;

export { Switch };
