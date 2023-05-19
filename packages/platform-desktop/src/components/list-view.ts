import { ObservableArray, type ListView as NSListView, type ItemEventData, type ViewBase } from '@nativescript/core';
import {
  type DarkElement,
  type Ref,
  type Component,
  type StandardComponentProps,
  component,
  useRef,
  useEvent,
  useImperativeHandle,
  forwardRef,
  detectIsUndefined,
} from '@dark-engine/core';

import type { ListViewAttributes } from '../jsx';
import { listView } from '../factory';
import { SyntheticEvent } from '../events';
import { renderSubRoot } from '../render';
import { NSElement } from '../registry';

export type ListViewProps<T = any> = {
  items: Array<T> | ObservableArray<T>;
  slot: (options: SlotOptions<T>) => DarkElement;
  onItemTap?: (e: SyntheticEvent<ItemEventData>) => void;
  onLoadMoreItems?: () => void;
} & Omit<
  ListViewAttributes,
  'itemTemplate' | 'itemTemplates' | 'itemTemplateSelector' | 'itemIdGenerator' | 'onItemLoading'
>;

export type ListViewRef = {
  refresh: () => void;
  scrollToIndex: (idx: number) => void;
  scrollToIndexAnimated: (idx: number) => void;
  isItemAtIndexVisible: (idx: number) => boolean;
};

const ListView: ListView = forwardRef<ListViewProps, ListViewRef>(
  component(
    ({ items, slot, ...rest }, ref) => {
      const rootRef = useRef<NSListView>(null);

      useImperativeHandle(ref, () => ({
        refresh: () => rootRef.current.refresh(),
        scrollToIndex: (idx: number) => rootRef.current.scrollToIndex(idx),
        scrollToIndexAnimated: (idx: number) => rootRef.current.scrollToIndexAnimated(idx),
        isItemAtIndexVisible: (idx: number) => rootRef.current.isItemAtIndexVisible(idx),
      }));

      const handleItemLoading = useEvent((e: SyntheticEvent<ItemEventData>) => {
        const data = e.sourceEvent;
        const idx = data.index;
        const item = items[idx];
        const element = slot({ item, idx, items });

        renderSubRoot(element, template => {
          const view = data.view || template;

          patchElement(view, template, idx);

          data.view = view;
        });
      });

      return listView({
        ...rest,
        ref: rootRef,
        items,
        itemTemplates,
        itemTemplateSelector,
        onItemLoading: handleItemLoading,
      });
    },
    { displayName: 'ListView' },
  ),
);

const DEFAULT_TEMPLATE = 'default';

const itemTemplates = [
  {
    key: DEFAULT_TEMPLATE,
    createView() {},
  },
];

function patchElement(target: ViewBase, source: ViewBase, idx: number) {
  if (!target || !source) return;
  const childrenTarget: Array<ViewBase> = [];
  const childrenSource: Array<ViewBase> = [];
  const keys = [
    'accessibilityHidden',
    'accessibilityHint',
    'accessibilityIdentifier',
    'accessibilityLabel',
    'accessibilityLanguage',
    'accessibilityLiveRegion',
    'accessibilityMediaSession',
    'accessibilityRole',
    'accessibilityState',
    'accessibilityValue',
    'accessible',
    'width',
    'height',
    'minHeight',
    'minWidth',
    'backgroundColor',
    'backgroundImage',
    'backgroundPosition',
    'backgroundRepeat',
    'backgroundSize',
    'borderBottomColor',
    'borderBottomLeftRadius',
    'borderBottomRightRadius',
    'borderBottomWidth',
    'borderColor',
    'borderLeftColor',
    'borderLeftWidth',
    'borderRadius',
    'borderRightColor',
    'borderRightWidth',
    'borderTopColor',
    'borderTopLeftRadius',
    'borderTopRightRadius',
    'borderTopWidth',
    'borderWidth',
    'boxShadow',
    'color',
    'horizontalAlignment',
    'margin',
    'marginBottom',
    'marginLeft',
    'marginRight',
    'marginTop',
    'opacity',
    'originX',
    'originY',
    'perspective',
    'rotate',
    'rotateX',
    'rotateY',
    'scaleX',
    'scaleY',
    'textTransform',
    'touchAnimation',
    'touchDelay',
    'translateX',
    'translateY',
    'verticalAlignment',
    'visibility',
    'busy',
    'className',
    'col',
    'colSpan',
    'column',
    'columnSpan',
    'dock',
    'alignSelf',
    'flexGrow',
    'flexShrink',
    'hidden',
    'order',
    'top',
    'left',
    'alignContent',
    'alignItems',
    'flexDirection',
    'flexWrap',
    'justifyContent',
    'columns',
    'rows',
    'itemHeight',
    'itemWidth',
    'orientation',
    'src',
    'text',
    'textWrap',
    'fontFamily',
    'fontSize',
    'fontStyle',
    'fontWeight',
    'formattedText',
    'letterSpacing',
    'lineHeight',
    'maxLines',
    'textDecoration',
    'loadMode',
    'decodeHeight',
    'decodeWidth',
    'imageSource',
    'textField',
    'valueField',
    'items',
    'selectedIndex',
    'selectedValue',
    'maxValue',
    'minValue',
    'value',
    'textFieldBackgroundColor',
    'textFieldHintColor',
    'selectedBackgroundColor',
    'title',
    'offBackgroundColor',
    'autocapitalizationType',
    'autocorrect',
    'autofillType',
    'editable',
    'hint',
    'keyboardType',
    'maxLength',
    'returnKeyType',
    'updateTextTrigger',
    'secure',
    'secureWithoutAutofill',
    'maxDate',
    'minDate',
    'minute',
    'month',
    'second',
    'showTime',
    'year',
    'hour',
    'maxHour',
    'maxMinute',
    'minHour',
    'minMinute',
    'minute',
    'minuteInterval',
    'time',
  ];

  for (const key of keys) {
    if (!detectIsUndefined(target[key]) && !detectIsUndefined(source[key])) {
      target[key] = source[key];
    }
  }

  target[ITEM_IDX] = idx;

  target.eachChild(x => {
    childrenTarget.push(x);

    return true;
  });

  source.eachChild(x => {
    childrenSource.push(x);

    return true;
  });

  for (let i = 0; i < childrenSource.length; i++) {
    patchElement(childrenTarget[i], childrenSource[i], idx);
  }
}

const itemTemplateSelector = () => DEFAULT_TEMPLATE;

const ITEM_IDX = '_ITEM_IDX';

const getListViewItemIdx = (view: NSElement) => view[ITEM_IDX];

type SlotOptions<T> = {
  item: T;
  idx: number;
  items: ListViewProps<T>['items'];
};

type MergedProps<T> = ListViewProps<T> & StandardComponentProps;

type ListView = <T>(props?: ListViewProps<T>, ref?: Ref) => Component<MergedProps<T>>;

export { ListView, getListViewItemIdx };
