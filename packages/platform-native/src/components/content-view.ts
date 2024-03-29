import type { ContentView as NSContentView } from '@nativescript/core';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { ContentViewAttributes } from '../jsx';
import { contentView } from '../factory';

export type ContentViewProps = ContentViewAttributes;
export type ContentViewRef = NSContentView;

const ContentView = forwardRef<ContentViewProps, ContentViewRef>(
  component((props, ref) => contentView({ ref, ...props }), { displayName: 'ContentView' }),
) as ComponentFactory<ContentViewProps, ContentViewRef>;

export { ContentView };
