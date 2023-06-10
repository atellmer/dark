import { QCheckBox } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import { qCheckBox } from '../factory';
import { type WidgetProps, type WithStandardProps } from '../shared';

export type CheckBoxProps = WithStandardProps<
  {
    checked: boolean;
    text?: string;
  } & WidgetProps
>;
export type CheckBoxRef = QCheckBox;

const CheckBox = forwardRef<CheckBoxProps, CheckBoxRef>(
  component((props, ref) => qCheckBox({ ref, ...props }), { displayName: 'CheckBox' }),
) as ComponentFactory<CheckBoxProps, CheckBoxRef>;

class QDarkCheckBox extends QCheckBox {}

export { CheckBox, QDarkCheckBox };
