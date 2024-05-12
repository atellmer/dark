import { type QCheckBoxSignals, QCheckBox } from '@nodegui/nodegui';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qCheckBox } from '../factory';

// const checkBoxEvents = useEvents<CheckBoxSignals>(
//   {
//     toggled: (e: SyntheticEvent<boolean>) => console.log(e.value),
//   },
// );
// <CheckBox text='Label' checked={checked} on={checkBoxEvents} />

export type CheckBoxProps = WithStandardProps<
  {
    ref?: Ref<CheckBoxRef>;
    checked: boolean;
    text?: string;
  } & WidgetProps
>;
export type CheckBoxRef = QDarkCheckBox;
export type CheckBoxSignals = QCheckBoxSignals;

const CheckBox = component<CheckBoxProps>(props => qCheckBox(props), {
  displayName: 'CheckBox',
}) as ComponentFactory<CheckBoxProps>;

class QDarkCheckBox extends QCheckBox {}

export { CheckBox, QDarkCheckBox };
