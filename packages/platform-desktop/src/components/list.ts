import { QWidget, QListWidget, type QListWidgetSignals } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithSlotProps, Container } from '../shared';
import { QDarkListItem } from './list-item';
import { qList } from '../factory';

export type ListProps = WithSlotProps<{} & WidgetProps>;
export type ListRef = QDarkList;
export type ListSignals = QListWidgetSignals;

const List = forwardRef<ListProps, ListRef>(
  component((props, ref) => qList({ ref, ...props }), { displayName: 'List' }),
) as ComponentFactory<ListProps, ListRef>;

class QDarkList extends QListWidget implements Container {
  public detectIsContainer() {
    return true;
  }

  public appendChild(child: QWidget) {
    const item = child as unknown as QDarkListItem;

    this.addItem(item);
  }

  public insertBefore(child: QWidget, sibling: QWidget) {
    const childItem = child as unknown as QDarkListItem;
    const siblingItem = sibling as unknown as QDarkListItem;
    const row = this.row(siblingItem);

    this.insertItem(row, childItem);
  }

  public removeChild(child: QWidget) {
    const item = child as unknown as QDarkListItem;
    const row = this.row(item);

    this.takeItem(row);
  }
}

export { List, QDarkList };
