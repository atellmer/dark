import type { Switch as NSSwitch } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { SwitchAttributes } from '../jsx';
import { _switch } from '../factory';

export type SwitchProps = {
  ref?: Ref<SwitchRef>;
} & SwitchAttributes;
export type SwitchRef = NSSwitch;

const Switch = component<SwitchProps>(props => _switch(props), {
  displayName: 'Switch',
}) as ComponentFactory<SwitchProps>;

export { Switch };
