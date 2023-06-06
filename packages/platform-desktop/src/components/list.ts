import { QWidget, QListWidget } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import { type WidgetProps, type WithExtendedProps, type Container } from '../shared';
import { QListItem } from './list-item';
import { qList } from '../factory';

export type ListProps = WithExtendedProps<{} & WidgetProps>;
export type ListRef = QListWidget;

const List = forwardRef<ListProps, ListRef>(
  component((props, ref) => qList({ ref, ...props }), { displayName: 'List' }),
) as ComponentFactory<ListProps, ListRef>;

class QList extends QListWidget implements Container {
  isContainer = true;

  appendChild(child: QWidget) {
    const item = child as unknown as QListItem;

    this.addItem(item);
  }

  insertBefore(child: QWidget, sibling: QWidget) {
    const childItem = child as unknown as QListItem;
    const siblingItem = sibling as unknown as QListItem;
    const row = this.row(siblingItem);

    this.insertItem(row, childItem);
  }

  removeChild(child: QWidget) {
    const item = child as unknown as QListItem;
    const row = this.row(item);

    this.takeItem(row);
  }
}

export { List, QList };
