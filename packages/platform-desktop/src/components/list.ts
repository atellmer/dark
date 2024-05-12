import { type QListWidgetSignals, QWidget, QListWidget } from '@nodegui/nodegui';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { WidgetProps, WithSlotProps, Container } from '../shared';
import { QDarkListItem } from './list-item';
import { qList } from '../factory';

// <List>
//   <ListItem text='Item 1' />
//   <ListItem text='Item 2' />
//   <ListItem text='Item 3' />
// </List>

export type ListProps = WithSlotProps<
  {
    ref?: Ref<ListRef>;
  } & WidgetProps
>;
export type ListRef = QDarkList;
export type ListSignals = QListWidgetSignals;

const List = component<ListProps>(props => qList(props), { displayName: 'List' }) as ComponentFactory<ListProps>;

class QDarkList extends QListWidget implements Container {
  detectIsContainer() {
    return true;
  }

  appendChild(child: QWidget) {
    const item = child as unknown as QDarkListItem;

    this.addItem(item);
  }

  insertBefore(child: QWidget, sibling: QWidget) {
    const childItem = child as unknown as QDarkListItem;
    const siblingItem = sibling as unknown as QDarkListItem;
    const row = this.row(siblingItem);

    this.insertItem(row, childItem);
  }

  removeChild(child: QWidget) {
    const item = child as unknown as QDarkListItem;
    const row = this.row(item);

    this.takeItem(row);
  }
}

export { List, QDarkList };
