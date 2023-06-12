import { QDial, type QDialSignals } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import { qDial } from '../factory';
import { type WidgetProps, type WithStandardProps } from '../shared';

export type DialProps = WithStandardProps<
  {
    value: number;
    maximum?: number;
    minimum?: number;
    notchesHidden?: boolean;
    notchTarget?: number;
    wrapping?: boolean;
  } & WidgetProps
>;
export type DialRef = QDarkDial;
export type DialSignals = QDialSignals;

const Dial = forwardRef<DialProps, DialRef>(
  component((props, ref) => qDial({ ref, ...props }), { displayName: 'Dial' }),
) as ComponentFactory<DialProps, DialRef>;

class QDarkDial extends QDial {
  constructor() {
    super();
    this.setWrapping(false);
    this.setNotchesVisible(true);
  }

  setNotchesHidden(value: boolean) {
    this.setNotchesVisible(!value);
  }
}

export { Dial, QDarkDial };
