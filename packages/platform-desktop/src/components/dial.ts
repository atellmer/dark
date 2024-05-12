import { type QDialSignals, QDial } from '@nodegui/nodegui';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

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
    ref?: Ref<DialRef>;
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

const Dial = component<DialProps>(props => qDial(props), { displayName: 'Dial' }) as ComponentFactory<DialProps>;

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
