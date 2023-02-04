import type { Span as NSSpan } from '@nativescript/core';
import { createComponent, forwardRef } from '@dark-engine/core';

import type { SpanAttributes } from '../jsx';
import { span } from '../factory';

export type SpanProps = SpanAttributes;
export type SpanRef = NSSpan;

const Span = forwardRef<SpanProps, SpanRef>(
  createComponent((props, ref) => {
    return span({ ref, ...props });
  }),
);

export { Span };
