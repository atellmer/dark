import { Switch as NSSwitch } from '@nativescript/core';

import { createComponent, forwardRef } from '@dark-engine/core';
import { SwitchAttributes } from '../jsx';
import { factory } from '../factory';

export type SwitchProps = SwitchAttributes;
export type SwitchRef = NSSwitch;

const _switch = factory('switch');

const Switch = forwardRef<SwitchProps, SwitchRef>(
  createComponent((props, ref) => {
    return _switch({ ref, ...props });
  }),
);

export { Switch };
