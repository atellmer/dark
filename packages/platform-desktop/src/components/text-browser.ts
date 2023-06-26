import { type QTextBrowserSignals, QTextBrowser } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qTextBrowser } from '../factory';

// <TextBrowser html='<p>Content</p>' />

export type TextBrowserProps = WithStandardProps<
  {
    html: string;
  } & WidgetProps
>;
export type TextBrowserRef = QDarkTextBrowser;
export type TextBrowserSignals = QTextBrowserSignals;

const TextBrowser = forwardRef<TextBrowserProps, TextBrowserRef>(
  component((props, ref) => qTextBrowser({ ref, ...props }), { displayName: 'TextBrowser' }),
) as ComponentFactory<TextBrowserProps, TextBrowserRef>;

class QDarkTextBrowser extends QTextBrowser {}

export { TextBrowser, QDarkTextBrowser };
