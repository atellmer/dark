import { type QSpinBoxSignals, QSpinBox } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qSpinBox } from '../factory';

// const spinBoxEvents = useEventSystem<SpinBoxSignals>(
//   {
//     valueChanged: (value: number) => {},
//   },
//   [],
// );
// <SpinBox value={10} singleStep={2} on={spinBoxEvents} />

export type SpinBoxProps = WithStandardProps<
  {
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

const SpinBox = forwardRef<SpinBoxProps, SpinBoxRef>(
  component((props, ref) => qSpinBox({ ref, ...props }), { displayName: 'SpinBox' }),
) as ComponentFactory<SpinBoxProps, SpinBoxRef>;

class QDarkSpinBox extends QSpinBox {}

export { SpinBox, QDarkSpinBox };
