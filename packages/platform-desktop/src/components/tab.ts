import { QTabWidget, type QTabWidgetSignals, type TabPosition } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithExtendedProps, Container } from '../shared';
import { qTab } from '../factory';
import { QDarkTabItem, detectIsTabItem } from './tab-item';
import { runAtTheEndOfCommit } from '../dom';

export type TabProps = WithExtendedProps<
  {
    currentIndex: number;
    tabPosition?: TabPosition;
    tabsClosable?: boolean;
  } & WidgetProps
>;
export type TabRef = QDarkTab;
export type TabWidgetSignals = QTabWidgetSignals;

const Tab = forwardRef<TabProps, TabRef>(
  component((props, ref) => qTab({ ref, ...props }), { displayName: 'Tab' }),
) as ComponentFactory<TabProps, TabRef>;

class QDarkTab extends QTabWidget implements Container {
  public detectIsContainer() {
    return true;
  }

  public appendChild(child: QDarkTabItem) {
    if (!detectIsTabItem(child)) return;
    child.setTab(this);
    runAtTheEndOfCommit(() => {
      this.addTab(child, child.getIcon(), child.getText());
    });
  }

  public insertBefore(child: QDarkTabItem, _: QDarkTabItem, idx: number) {
    if (!detectIsTabItem(child)) return;
    child.setTab(this);
    runAtTheEndOfCommit(() => {
      this.insertTab(idx, child, child.getIcon(), child.getText());
    });
  }

  public removeChild(child: QDarkTabItem) {
    if (!detectIsTabItem(child)) return;
    this.removeTab(child.getIndex());
    child.setTab(null);
    child.close();
  }
}

export { Tab, QDarkTab };
