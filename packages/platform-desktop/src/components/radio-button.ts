import { type QRadioButtonSignals, QRadioButton } from '@nodegui/nodegui';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qRadioButton } from '../factory';

// <GroupBox title='Controls'>
//   <RadioButton text='Option 1' />
//   <RadioButton text='Option 2' />
//   <RadioButton text='Option 3' />
// </GroupBox>

export type RadioButtonProps = WithStandardProps<
  {
    ref?: Ref<RadioButtonRef>;
    text: string;
  } & WidgetProps
>;
export type RadioButtonRef = QDarkRadioButton;
export type RadioButtonSignals = QRadioButtonSignals;

const RadioButton = component<RadioButtonProps>(props => qRadioButton(props), {
  displayName: 'RadioButton',
}) as ComponentFactory<RadioButtonProps>;

class QDarkRadioButton extends QRadioButton {}

export { RadioButton, QDarkRadioButton };
