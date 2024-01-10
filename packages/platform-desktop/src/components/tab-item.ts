import { type QTabWidget, QIcon } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WithSlotProps } from '../shared';
import { qTabItem } from '../factory';
import { QDarkFlexLayout } from './flex-layout';

// <Tab currentIndex={0}>
//   <TabItem text='Tab 1'>
//     <Text>Content 1</Text>
//   </TabItem>
//   <TabItem text='Tab 2'>
//     <Text>Content 2</Text>
//   </TabItem>
//   <TabItem text='Tab 3'>
//     <Text>Content 3</Text>
//   </TabItem>
// </Tab>

export type TabItemProps = WithSlotProps<{
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

  setTab(value: QTabWidget) {
    this.tab = value;
  }

  setText(value: string) {
    this.text = value;
    this.tab.setTabText(this.getIndex(), this.text);
  }

  getText() {
    return this.text;
  }

  setIcon(value: QIcon) {
    this.icon = value;
    this.tab.setTabIcon(this.getIndex(), this.icon);
  }

  getIcon() {
    return this.icon;
  }

  getIndex() {
    return this.tab.indexOf(this);
  }
}

function detectIsTabItem(value: unknown): value is QDarkTabItem {
  return value instanceof QDarkTabItem;
}

export { TabItem, QDarkTabItem, detectIsTabItem };
