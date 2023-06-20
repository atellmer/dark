import { QSpinBox, type QSpinBoxSignals } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qSpinBox } from '../factory';

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
