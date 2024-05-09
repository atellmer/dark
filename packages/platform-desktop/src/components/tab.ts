import { type QTabWidgetSignals, type TabPosition, QTabWidget } from '@nodegui/nodegui';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { WidgetProps, WithSlotProps, Container } from '../shared';
import { qTab } from '../factory';
import { QDarkTabItem, detectIsTabItem } from './tab-item';
import { runAtTheEndOfCommit } from '../dom';

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

export type TabProps = WithSlotProps<
  {
    ref?: Ref<TabRef>;
    currentIndex: number;
    tabPosition?: TabPosition;
    tabsClosable?: boolean;
  } & WidgetProps
>;
export type TabRef = QDarkTab;
export type TabSignals = QTabWidgetSignals;

const Tab = component<TabProps>(props => qTab(props), { displayName: 'Tab' }) as ComponentFactory<TabProps>;

class QDarkTab extends QTabWidget implements Container {
  detectIsContainer() {
    return true;
  }

  appendChild(child: QDarkTabItem) {
    if (!detectIsTabItem(child)) return;
    child.setTab(this);
    runAtTheEndOfCommit(() => {
      this.addTab(child, child.getIcon(), child.getText());
    });
  }

  insertBefore(child: QDarkTabItem, _: QDarkTabItem, idx: number) {
    if (!detectIsTabItem(child)) return;
    child.setTab(this);
    runAtTheEndOfCommit(() => {
      this.insertTab(idx, child, child.getIcon(), child.getText());
    });
  }

  removeChild(child: QDarkTabItem) {
    if (!detectIsTabItem(child)) return;
    this.removeTab(child.getIndex());
    child.setTab(null);
    child.close();
  }
}

export { Tab, QDarkTab };
