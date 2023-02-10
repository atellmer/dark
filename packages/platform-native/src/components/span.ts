import type { Span as NSSpan } from '@nativescript/core';
import { type Component, createComponent, forwardRef } from '@dark-engine/core';

import type { SpanAttributes } from '../jsx';
import { span } from '../factory';

export type SpanProps = SpanAttributes;
export type SpanRef = NSSpan;

const Span = forwardRef<SpanProps, SpanRef>(
  createComponent((props, ref) => span({ ref, ...props }), { displayName: 'Span' }),
) as Component<SpanProps, SpanRef>;

export { Span };
