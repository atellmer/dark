import { QComboBox, type QIcon, type QVariant, type QComboBoxSignals, type QSize } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import { qComboBox } from '../factory';
import { type WidgetProps, type WithStandardProps } from '../shared';

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
  setItems(items: Array<ComboBoxItem>) {
    this.clear();
    items.forEach(x => this.addItem(x.icon, x.text, x.userData));
  }

  async setCurrentIndex(value: number) {
    await Promise.resolve();
    this.setProperty('currentIndex', value);
  }
}

export { ComboBox, QDarkComboBox };
