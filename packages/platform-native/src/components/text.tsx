import { h, createComponent, type DarkElement } from '@dark-engine/core';
import { LabelAttributes } from '../jsx-typings';

export type TextProps = {
  slot: DarkElement;
} & LabelAttributes;

const Text = createComponent<TextProps>(({ slot, ...rest }) => {
  return <label {...rest}>{slot}</label>;
});

export { Text };
