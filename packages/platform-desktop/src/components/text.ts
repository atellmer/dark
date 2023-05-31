import { type QLabel } from '@nodegui/nodegui';
import { type TextVirtualNode, type ComponentFactory, component, forwardRef, detectIsArray } from '@dark-engine/core';

import { qLabel } from '../factory';
import type { WidgetProps, WithExtendedProps } from '../shared';

export type TextProps = WithExtendedProps<{} & WidgetProps, string | number | Array<string | number>>;
export type TextRef = QLabel;

const Text = forwardRef<TextProps, TextRef>(
  component(
    (props, ref) => {
      const { slot, ...rest } = props;
      const text$ = slot as unknown as TextVirtualNode | Array<TextVirtualNode>;
      const text = detectIsArray(text$) ? text$.reduce((acc, x) => ((acc += x.value), acc), '') : text$.value;

      return qLabel({ ref, text, ...rest });
    },
    { displayName: 'Text' },
  ),
) as ComponentFactory<TextProps, TextRef>;

export { Text };
