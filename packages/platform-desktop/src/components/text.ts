import { QLabel } from '@nodegui/nodegui';
import { type TextVirtualNode, type ComponentFactory, component, forwardRef, detectIsArray } from '@dark-engine/core';

import type { WidgetProps, WithPartialSlotProps } from '../shared';
import { qText } from '../factory';

// <Text>Hello world</Text>
// <Text>
//   {`<h1>Hello world</h1><p>Rich text</p>`}
// </Text>

export type TextProps = WithPartialSlotProps<{} & WidgetProps, string | number | Array<string | number>>;
export type TextRef = QDarkText;

const Text = forwardRef<TextProps, TextRef>(
  component(
    (props, ref) => {
      const { slot, ...rest } = props;
      const $text = slot as unknown as TextVirtualNode | Array<TextVirtualNode>;
      const text = detectIsArray($text) ? $text.reduce((acc, x) => ((acc += x.value), acc), '') : $text.value;

      return qText({ ref, text, ...rest });
    },
    { displayName: 'Text' },
  ),
) as ComponentFactory<TextProps, TextRef>;

class QDarkText extends QLabel {}

export { Text, QDarkText };
