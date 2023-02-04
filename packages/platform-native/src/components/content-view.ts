import type { ContentView as NSContentView } from '@nativescript/core';
import { createComponent, forwardRef } from '@dark-engine/core';

import type { ContentViewAttributes } from '../jsx';
import { contentView } from '../factory';

export type ContentViewProps = ContentViewAttributes;
export type ContentViewRef = NSContentView;

const ContentView = forwardRef<ContentViewProps, ContentViewRef>(
  createComponent((props, ref) => {
    return contentView({ ref, ...props });
  }),
);

export { ContentView };
