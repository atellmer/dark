import { QWidget, QTreeWidgetItem, type QIcon } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WithPartialSlotProps, Container } from '../shared';
import { qTreeItem } from '../factory';
import { throwUnsupported } from '../utils';

export type TreeItemProps = WithPartialSlotProps<{
  value: Array<string>;
  icon?: QIcon;
  expanded?: boolean;
}>;
export type TreeItemRef = QDarkTreeItem;

const TreeItem = forwardRef<TreeItemProps, TreeItemRef>(
  component((props, ref) => qTreeItem({ ref, ...props }), { displayName: 'TreeItem' }),
) as ComponentFactory<TreeItemProps, TreeItemRef>;

class QDarkTreeItem extends QTreeWidgetItem implements Container {
  public detectIsContainer() {
    return true;
  }

  public setValue(value: Array<string>) {
    value.forEach((x, idx) => this.setText(idx, x));
  }

  public appendChild(child: QWidget) {
    if (!detectIsTreeItem(child)) return;
    this.addChild(child);
  }

  public insertBefore() {
    throwUnsupported(this);
  }

  public removeChild() {
    throwUnsupported(this);
  }
}

function detectIsTreeItem(value: unknown): value is QDarkTreeItem {
  return value instanceof QDarkTreeItem;
}

export { TreeItem, QDarkTreeItem, detectIsTreeItem };
