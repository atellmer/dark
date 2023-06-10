import { QSpinBox } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import { qSpinBox } from '../factory';
import { type WidgetProps, type WithStandardProps } from '../shared';

export type SpinBoxProps = WithStandardProps<
  {
    value: number;
  } & WidgetProps
>;
export type SpinBoxRef = QSpinBox;

const SpinBox = forwardRef<SpinBoxProps, SpinBoxRef>(
  component((props, ref) => qSpinBox({ ref, ...props }), { displayName: 'SpinBox' }),
) as ComponentFactory<SpinBoxProps, SpinBoxRef>;

class QDarkSpinBox extends QSpinBox {}

export { SpinBox, QDarkSpinBox };
