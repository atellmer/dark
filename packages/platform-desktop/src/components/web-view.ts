import type { WebView as NSWebView } from '@nativescript/core';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WebViewAttributes } from '../jsx';
import { webView } from '../factory';

export type WebViewProps = WebViewAttributes;
export type WebViewRef = NSWebView;

const WebView = forwardRef<WebViewProps, WebViewRef>(
  component((props, ref) => webView({ ref, ...props }), { displayName: 'WebView' }),
) as ComponentFactory<WebViewProps, WebViewRef>;

export { WebView };
