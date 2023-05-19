import type { FormattedString as NSFormattedString } from '@nativescript/core';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { FormattedStringAttributes } from '../jsx';
import { formattedString } from '../factory';

export type FormattedStringProps = FormattedStringAttributes;
export type FormattedStringRef = NSFormattedString;

const FormattedString = forwardRef<FormattedStringProps, FormattedStringRef>(
  component((props, ref) => formattedString({ ref, ...props }), { displayName: 'FormattedString' }),
) as ComponentFactory<FormattedStringProps, FormattedStringRef>;

export { FormattedString };
