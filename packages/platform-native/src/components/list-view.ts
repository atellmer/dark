import { type ListView as NSListView, type ItemEventData, type ViewBase } from '@nativescript/core';
import {
  type DarkElement,
  type Ref,
  type ComponentFactory,
  type StandardComponentProps,
  createComponent,
  useRef,
  useEffect,
  useEvent,
  useImperativeHandle,
  forwardRef,
  detectIsUndefined,
} from '@dark-engine/core';

import type { ListViewAttributes } from '../jsx';
import { listView } from '../factory';
import { SyntheticEvent } from '../events';
import { renderSubRoot } from '../render';

export type ListViewProps<T = any> = {
  items: Array<T>;
  slot: (options: SlotOptions<T>) => DarkElement;
} & Omit<
  ListViewAttributes,
  'itemTemplate' | 'itemTemplates' | 'itemTemplateSelector' | 'itemIdGenerator' | 'onItemLoading'
>;

export type ListViewRef = {};

const ListView: ListView = forwardRef<ListViewProps, ListViewRef>(
  createComponent(({ items, slot, ...rest }, ref) => {
    const rootRef = useRef<NSListView>(null);

    useEffect(() => {
      rootRef.current.refresh();
    }, [items]);

    useImperativeHandle(ref, () => ({}));

    const handleItemLoading = useEvent((e: SyntheticEvent<ItemEventData>) => {
      const data = e.sourceEvent;
      const idx = data.index;
      const item = items[idx];
      const element = slot({ item, idx, items });

      renderSubRoot(element, template => {
        const view = data.view || template;

        patchElement(view, template);

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
  }),
);

const DEFAULT_TEMPLATE = 'default';

const itemTemplates = [
  {
    key: DEFAULT_TEMPLATE,
    createView() {},
  },
];

function patchElement(target: ViewBase, source: ViewBase) {
  const childrenTarget: Array<ViewBase> = [];
  const childrenSource: Array<ViewBase> = [];
  const keys = ['text', 'color', 'backgroundColor', 'className', 'hidden', 'visibility'];

  for (const key of keys) {
    if (!detectIsUndefined(target[key]) && !detectIsUndefined(source[key])) {
      target[key] = source[key];
    }
  }

  target.eachChild(x => {
    childrenTarget.push(x);

    return true;
  });

  source.eachChild(x => {
    childrenSource.push(x);

    return true;
  });

  for (let i = 0; i < childrenSource.length; i++) {
    patchElement(childrenTarget[i], childrenSource[i]);
  }
}

const itemTemplateSelector = () => DEFAULT_TEMPLATE;

type MergedProps<T> = ListViewProps<T> & StandardComponentProps;

type ListView = <T>(props?: ListViewProps<T>, ref?: Ref) => ComponentFactory<MergedProps<T>>;

type SlotOptions<T> = {
  item: T;
  idx: number;
  items: Array<T>;
};

export { ListView };
