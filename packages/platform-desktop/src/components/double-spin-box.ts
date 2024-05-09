import { type QDoubleSpinBoxSignals, QDoubleSpinBox } from '@nodegui/nodegui';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qDoubleSpinBox } from '../factory';

// const spinBoxEvents = useEvents<DoubleSpinBoxSignals>(
//   {
//     valueChanged: (e: SyntheticEvent<number>) => console.log(e.value)
//   },
// );
// <DoubleSpinBox value={10.5} singleStep={0.5} on={spinBoxEvents} />

export type DoubleSpinBoxProps = WithStandardProps<
  {
    ref?: Ref<DoubleSpinBoxRef>;
    value: number;
    decimals?: number;
    maximum?: number;
    minimum?: number;
    prefix?: string;
    suffix?: string;
    singleStep?: number;
  } & WidgetProps
>;
export type DoubleSpinBoxRef = QDarkDoubleSpinBox;
export type DoubleSpinBoxSignals = QDoubleSpinBoxSignals;

const DoubleSpinBox = component<DoubleSpinBoxProps>(props => qDoubleSpinBox(props), {
  displayName: 'DoubleSpinBox',
}) as ComponentFactory<DoubleSpinBoxProps>;

class QDarkDoubleSpinBox extends QDoubleSpinBox {}

export { DoubleSpinBox, QDarkDoubleSpinBox };
