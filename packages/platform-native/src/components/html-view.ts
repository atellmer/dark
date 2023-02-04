import type { HtmlView as NSHtmlView } from '@nativescript/core';
import { type Component, createComponent, forwardRef } from '@dark-engine/core';

import type { HtmlViewAttributes } from '../jsx';
import { htmlView } from '../factory';

export type HtmlViewProps = HtmlViewAttributes;
export type HtmlViewRef = NSHtmlView;

const HtmlView = forwardRef<HtmlViewProps, HtmlViewRef>(
  createComponent((props, ref) => {
    return htmlView({ ref, ...props });
  }),
) as Component<HtmlViewProps, HtmlViewRef>;

export { HtmlView };
