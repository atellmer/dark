import type { FormattedString as NSFormattedString } from '@nativescript/core';
import { type Component, createComponent, forwardRef } from '@dark-engine/core';

import type { FormattedStringAttributes } from '../jsx';
import { formattedString } from '../factory';

export type FormattedStringProps = FormattedStringAttributes;
export type FormattedStringRef = NSFormattedString;

const FormattedString = forwardRef<FormattedStringProps, FormattedStringRef>(
  createComponent((props, ref) => {
    return formattedString({ ref, ...props });
  }),
) as Component<FormattedStringProps, FormattedStringRef>;

export { FormattedString };
