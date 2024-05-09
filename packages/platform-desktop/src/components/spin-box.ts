import { type QSpinBoxSignals, QSpinBox } from '@nodegui/nodegui';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qSpinBox } from '../factory';

// const spinBoxEvents = useEvents<SpinBoxSignals>(
//   {
//     valueChanged: (value: number) => {},
//   },
// );
// <SpinBox value={10} singleStep={2} on={spinBoxEvents} />

export type SpinBoxProps = WithStandardProps<
  {
    ref?: Ref<SpinBoxRef>;
    value: number;
    maximum?: number;
    minimum?: number;
    prefix?: string;
    suffix?: string;
    singleStep?: number;
  } & WidgetProps
>;
export type SpinBoxRef = QDarkSpinBox;
export type SpinBoxSignals = QSpinBoxSignals;

const SpinBox = component<SpinBoxProps>(props => qSpinBox(props), {
  displayName: 'SpinBox',
}) as ComponentFactory<SpinBoxProps>;

class QDarkSpinBox extends QSpinBox {}

export { SpinBox, QDarkSpinBox };
