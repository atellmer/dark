import { type QLabel } from '@nodegui/nodegui';
import { type TextVirtualNode, type ComponentFactory, component, forwardRef, detectIsArray } from '@dark-engine/core';

import { qLabel } from '../factory';
import { type WidgetProps } from '../shared';

export type TextProps = {
  slot: string | number | Array<string | number>;
} & WidgetProps;

export type TextRef = QLabel;

const Text = forwardRef<TextProps, TextRef>(
  component((props, ref) => {
    const { slot, ...rest } = props;
    const text$ = slot as unknown as TextVirtualNode | Array<TextVirtualNode>;
    const text = detectIsArray(text$) ? text$.reduce((acc, x) => ((acc += x.value), acc), '') : text$.value;

    return qLabel({ ref, text, ...rest });
  }),
) as ComponentFactory<TextProps, TextRef>;

export { Text };
