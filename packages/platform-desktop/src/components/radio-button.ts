import { QRadioButton, type QRadioButtonSignals } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qRadioButton } from '../factory';

export type RadioButtonProps = WithStandardProps<
  {
    text: string;
  } & WidgetProps
>;
export type RadioButtonRef = QDarkRadioButton;
export type RadioButtonSignals = QRadioButtonSignals;

const RadioButton = forwardRef<RadioButtonProps, RadioButtonRef>(
  component((props, ref) => qRadioButton({ ref, ...props }), { displayName: 'RadioButton' }),
) as ComponentFactory<RadioButtonProps, RadioButtonRef>;

class QDarkRadioButton extends QRadioButton {}

export { RadioButton, QDarkRadioButton };
