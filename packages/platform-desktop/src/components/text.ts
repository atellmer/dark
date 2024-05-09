import { QLabel } from '@nodegui/nodegui';
import { type ComponentFactory, type Ref, type TextBased, component, detectIsArray } from '@dark-engine/core';

import type { WidgetProps, WithPartialSlotProps } from '../shared';
import { qText } from '../factory';

// <Text>Hello world</Text>
// <Text>
//   {`<h1>Hello world</h1><p>Rich text</p>`}
// </Text>

export type TextProps = WithPartialSlotProps<
  {
    ref?: Ref<TextRef>;
  } & WidgetProps,
  TextBased | Array<TextBased>
>;
export type TextRef = QDarkText;

const Text = component<TextProps>(
  props => {
    const { slot, ...rest } = props;
    const text = detectIsArray(slot) ? slot.join('') : slot;

    return qText({ text, ...rest });
  },
  { displayName: 'Text' },
) as ComponentFactory<TextProps>;

class QDarkText extends QLabel {}

export { Text, QDarkText };
