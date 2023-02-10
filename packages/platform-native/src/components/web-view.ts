import type { WebView as NSWebView } from '@nativescript/core';
import { type Component, createComponent, forwardRef } from '@dark-engine/core';

import type { WebViewAttributes } from '../jsx';
import { webView } from '../factory';

export type WebViewProps = WebViewAttributes;
export type WebViewRef = NSWebView;

const WebView = forwardRef<WebViewProps, WebViewRef>(
  createComponent((props, ref) => webView({ ref, ...props }), { displayName: 'WebView' }),
) as Component<WebViewProps, WebViewRef>;

export { WebView };
