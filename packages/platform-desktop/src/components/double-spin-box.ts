import { type QDoubleSpinBoxSignals, QDoubleSpinBox } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qDoubleSpinBox } from '../factory';

// const spinBoxEvents = useEventSystem<DoubleSpinBoxSignals>(
//   {
//     valueChanged: (e: SyntheticEvent<number>) => console.log(e.value)
//   },
//   [],
// );
// <DoubleSpinBox value={10.5} singleStep={0.5} on={spinBoxEvents} />

export type DoubleSpinBoxProps = WithStandardProps<
  {
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

const DoubleSpinBox = forwardRef<DoubleSpinBoxProps, DoubleSpinBoxRef>(
  component((props, ref) => qDoubleSpinBox({ ref, ...props }), { displayName: 'DoubleSpinBox' }),
) as ComponentFactory<DoubleSpinBoxProps, DoubleSpinBoxRef>;

class QDarkDoubleSpinBox extends QDoubleSpinBox {}

export { DoubleSpinBox, QDarkDoubleSpinBox };
