import { QCheckBox, type QCheckBoxSignals } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qCheckBox } from '../factory';

export type CheckBoxProps = WithStandardProps<
  {
    checked: boolean;
    text?: string;
  } & WidgetProps
>;
export type CheckBoxRef = QDarkCheckBox;
export type CheckBoxSignals = QCheckBoxSignals;

const CheckBox = forwardRef<CheckBoxProps, CheckBoxRef>(
  component((props, ref) => qCheckBox({ ref, ...props }), { displayName: 'CheckBox' }),
) as ComponentFactory<CheckBoxProps, CheckBoxRef>;

class QDarkCheckBox extends QCheckBox {}

export { CheckBox, QDarkCheckBox };
