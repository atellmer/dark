import type { HtmlView as NSHtmlView } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { HtmlViewAttributes } from '../jsx';
import { htmlView } from '../factory';

export type HtmlViewProps = {
  ref?: Ref<HtmlViewRef>;
} & HtmlViewAttributes;
export type HtmlViewRef = NSHtmlView;

const HtmlView = component<HtmlViewProps>(props => htmlView(props), {
  displayName: 'HtmlView',
}) as ComponentFactory<HtmlViewProps>;

export { HtmlView };
