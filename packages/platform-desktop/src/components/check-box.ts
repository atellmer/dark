import { type QCheckBoxSignals, QCheckBox } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qCheckBox } from '../factory';

// const checkboxEvents = useEventSystem<CheckBoxSignals>(
//   {
//     toggled: (e: SyntheticEvent<boolean>) => console.log(e.value),
//   },
//   [],
// );
// <CheckBox text='Label' checked={checked} on={checkboxEvents} />

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
