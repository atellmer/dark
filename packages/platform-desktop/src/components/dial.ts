import { type QDialSignals, QDial } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qDial } from '../factory';

// const dialEvents = useEvents<DialSignals>(
//   {
//     valueChanged: (e: SyntheticEvent<number>) => console.log(e.value)
//   },
// );
// <Dial value={50} maximum={100} minimum={0} on={dialEvents} />

export type DialProps = WithStandardProps<
  {
    value: number;
    maximum: number;
    minimum: number;
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
