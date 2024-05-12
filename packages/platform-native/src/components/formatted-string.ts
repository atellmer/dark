import type { FormattedString as NSFormattedString } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { FormattedStringAttributes } from '../jsx';
import { formattedString } from '../factory';

export type FormattedStringProps = {
  ref?: Ref<FormattedStringRef>;
} & FormattedStringAttributes;
export type FormattedStringRef = NSFormattedString;

const FormattedString = component<FormattedStringProps>(props => formattedString(props), {
  displayName: 'FormattedString',
}) as ComponentFactory<FormattedStringProps>;

export { FormattedString };
