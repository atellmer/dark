import {
  Frame,
  Page,
  ContentView,
  ScrollView,
  RootLayout,
  AbsoluteLayout,
  DockLayout,
  FlexboxLayout,
  StackLayout,
  GridLayout,
  WrapLayout,
  HtmlView,
  WebView,
  ActionBar,
  ActionItem,
  NavigationButton,
  ActivityIndicator,
  Button,
  DatePicker,
  Label,
  FormattedString,
  Image,
  ListPicker,
  Placeholder,
  Progress,
  SearchBar,
  SegmentedBar,
  SegmentedBarItem,
  Slider,
  Span,
  Switch,
  TextField,
  TextView,
  TimePicker,
  TabView,
  TabViewItem,
} from '@nativescript/core';

import { ROOT } from '@dark-engine/core';
import { type TagNativeElement } from '../native-element';

export const enum NSViewFlag {
  CONTENT_VIEW = 'CONTENT_VIEW',
  LAYOUT_VIEW = 'LAYOUT_VIEW',
}

export type ElementFactory = any;

export type NSElementMeta = {
  flag?: NSViewFlag;
  skipNativeInstalling?: boolean;
  add?: (childElement: TagNativeElement, parentElement: TagNativeElement, idx?: number) => void;
  remove?: (childElement: TagNativeElement, parentElement: TagNativeElement) => void;
};

type NSElement = {
  factory?: ElementFactory;
  meta?: NSElementMeta;
};

const viewMap: Record<string, NSElement> = {};

function registerElement(name: string, element: NSElement) {
  viewMap[name] = element;
}

function getElement(name: string): NSElement {
  return viewMap[name] || null;
}

registerElement(ROOT, { meta: { skipNativeInstalling: true } });

registerElement('frame', {
  factory: Frame,
  meta: {
    add: (childElement, parentElement) => {
      const frame = parentElement.nativeView as Frame;

      if (childElement.nativeView instanceof Page) {
        frame.navigate({
          create() {
            return childElement.nativeView;
          },
        });
      }
    },
    remove: () => {},
  },
});

registerElement('page', { factory: Page, meta: { flag: NSViewFlag.CONTENT_VIEW } });
registerElement('content-view', { factory: ContentView, meta: { flag: NSViewFlag.CONTENT_VIEW } });
registerElement('scroll-view', { factory: ScrollView, meta: { flag: NSViewFlag.CONTENT_VIEW } });
registerElement('root-layout', { factory: RootLayout, meta: { flag: NSViewFlag.LAYOUT_VIEW } });
registerElement('absolute-layout', { factory: AbsoluteLayout, meta: { flag: NSViewFlag.LAYOUT_VIEW } });
registerElement('dock-layout', { factory: DockLayout, meta: { flag: NSViewFlag.LAYOUT_VIEW } });
registerElement('flexbox-layout', { factory: FlexboxLayout, meta: { flag: NSViewFlag.LAYOUT_VIEW } });
registerElement('grid-layout', { factory: GridLayout, meta: { flag: NSViewFlag.LAYOUT_VIEW } });
registerElement('stack-layout', { factory: StackLayout, meta: { flag: NSViewFlag.LAYOUT_VIEW } });
registerElement('wrap-layout', { factory: WrapLayout, meta: { flag: NSViewFlag.LAYOUT_VIEW } });
registerElement('html-view', { factory: HtmlView });
registerElement('web-view', { factory: WebView });
registerElement('action-bar', { factory: ActionBar });
registerElement('action-item', { factory: ActionItem });
registerElement('navigation-button', { factory: NavigationButton });
registerElement('activity-indicator', { factory: ActivityIndicator });
registerElement('button', { factory: Button });
registerElement('label', { factory: Label });
registerElement('date-picker', { factory: DatePicker });
registerElement('formatted-string', { factory: FormattedString });
registerElement('image', { factory: Image });
registerElement('list-picker', { factory: ListPicker });
registerElement('placeholder', { factory: Placeholder });
registerElement('progress', { factory: Progress });
registerElement('search-bar', { factory: SearchBar });
registerElement('segmented-bar', { factory: SegmentedBar });
registerElement('segmented-bar-item', { factory: SegmentedBarItem });
registerElement('slider', { factory: Slider });
registerElement('span', { factory: Span });
registerElement('switch', { factory: Switch });
registerElement('text-field', { factory: TextField });
registerElement('text-view', { factory: TextView });
registerElement('time-picker', { factory: TimePicker });
registerElement('tab-view', { factory: TabView });
registerElement('tab-view-item', { factory: TabViewItem });

export { getElement, registerElement };
