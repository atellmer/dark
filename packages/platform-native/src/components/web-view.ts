import type { WebView as NSWebView } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { WebViewAttributes } from '../jsx';
import { webView } from '../factory';

export type WebViewProps = {
  ref?: Ref<WebViewRef>;
} & WebViewAttributes;
export type WebViewRef = NSWebView;

const WebView = component<WebViewProps>(props => webView(props), {
  displayName: 'WebView',
}) as ComponentFactory<WebViewProps>;

export { WebView };
