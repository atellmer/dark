import { type QTabWidget, QIcon } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WithExtendedProps } from '../shared';
import { qTabItem } from '../factory';
import { QDarkFlexLayout } from './flex-layout';

export type TabItemProps = WithExtendedProps<{
  text: string;
  icon?: QIcon;
}>;
export type TabItemRef = QDarkTabItem;

const TabItem = forwardRef<TabItemProps, TabItemRef>(
  component((props, ref) => qTabItem({ ref, ...props }), { displayName: 'TabItem' }),
) as ComponentFactory<TabItemProps, TabItemRef>;

class QDarkTabItem extends QDarkFlexLayout {
  private tab: QTabWidget = null;
  private text: string;
  private icon: QIcon = new QIcon();

  public setTab(value: QTabWidget) {
    this.tab = value;
  }

  public setText(value: string) {
    this.text = value;
    this.tab.setTabText(this.getIndex(), this.text);
  }

  public getText() {
    return this.text;
  }

  public setIcon(value: QIcon) {
    this.icon = value;
    this.tab.setTabIcon(this.getIndex(), this.icon);
  }

  public getIcon() {
    return this.icon;
  }

  public getIndex() {
    return this.tab.indexOf(this);
  }
}

function detectIsTabItem(value: unknown): value is QDarkTabItem {
  return value instanceof QDarkTabItem;
}

export { TabItem, QDarkTabItem, detectIsTabItem };
