import { type QTextBrowserSignals, QTextBrowser } from '@nodegui/nodegui';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qTextBrowser } from '../factory';

// <TextBrowser html='<p>Content</p>' />

export type TextBrowserProps = WithStandardProps<
  {
    ref?: Ref<TextBrowserRef>;
    html: string;
  } & WidgetProps
>;
export type TextBrowserRef = QDarkTextBrowser;
export type TextBrowserSignals = QTextBrowserSignals;

const TextBrowser = component<TextBrowserProps>(props => qTextBrowser(props), {
  displayName: 'TextBrowser',
}) as ComponentFactory<TextBrowserProps>;

class QDarkTextBrowser extends QTextBrowser {}

export { TextBrowser, QDarkTextBrowser };
