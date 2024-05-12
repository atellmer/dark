import type { Span as NSSpan } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { SpanAttributes } from '../jsx';
import { span } from '../factory';

export type SpanProps = {
  ref?: Ref<SpanRef>;
} & SpanAttributes;
export type SpanRef = NSSpan;

const Span = component<SpanProps>(props => span(props), { displayName: 'Span' }) as ComponentFactory<SpanProps>;

export { Span };
