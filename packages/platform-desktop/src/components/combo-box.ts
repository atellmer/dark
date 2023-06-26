import { type QIcon, type QVariant, type QComboBoxSignals, type QSize, QComboBox } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qComboBox } from '../factory';

// const items: Array<ComboBoxItem> = [{ text: 'Item 1', text: 'Item 2', text: 'Item 3' }];
// const comboBoxEvents = useEventSystem<ComboBoxSignals>(
//   {
//     currentIndexChanged: (e: SyntheticEvent<number>) => console.log(e.value),
//   },
//   [],
// );
// <ComboBox currentIndex={currentIndex} items={items} on={comboBoxEvents} />

export type ComboBoxProps = WithStandardProps<
  {
    items: Array<ComboBoxItem>;
    currentIndex: number;
    iconSize?: QSize;
    editable?: boolean;
    maxCount?: number;
    maxVisibleItems?: number;
  } & WidgetProps
>;
export type ComboBoxRef = QDarkComboBox;
export type ComboBoxSignals = QComboBoxSignals;
export type ComboBoxItem = {
  text: string;
  icon?: QIcon;
  userData?: QVariant;
};

const ComboBox = forwardRef<ComboBoxProps, ComboBoxRef>(
  component((props, ref) => qComboBox({ ref, ...props }), { displayName: 'ComboBox' }),
) as ComponentFactory<ComboBoxProps, ComboBoxRef>;

class QDarkComboBox extends QComboBox {
  public setItems(items: Array<ComboBoxItem>) {
    this.clear();
    items.forEach(x => this.addItem(x.icon, x.text, x.userData));
  }

  public async setCurrentIndex(value: number) {
    await Promise.resolve();
    this.setProperty('currentIndex', value);
  }
}

export { ComboBox, QDarkComboBox };
