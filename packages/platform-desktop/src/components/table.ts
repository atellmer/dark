import { QWidget, QTableWidget, type QTableWidgetSignals } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithExtendedProps, Container } from '../shared';
import { qTable } from '../factory';
import { detectIsTableItem } from './table-item';
import { runAtTheEndOfCommit } from '../dom';
import { throwUnsupported } from '../utils';

export type TableProps = WithExtendedProps<
  {
    columnCount: number;
    rowCount: number;
    horizontalHeaderLabels?: Array<string>;
    verticalHeaderLabels?: Array<string>;
    gridHidden?: boolean;
    sortingEnabled?: boolean;
  } & WidgetProps
>;
export type TableRef = QDarkTable;
export type TableSignals = QTableWidgetSignals;

const Table = forwardRef<TableProps, TableRef>(
  component((props, ref) => qTable({ ref, ...props }), { displayName: 'Table' }),
) as ComponentFactory<TableProps, TableRef>;

class QDarkTable extends QTableWidget implements Container {
  public detectIsContainer() {
    return true;
  }

  public setGridHidden(value: boolean) {
    this.setShowGrid(!value);
  }

  public appendChild(child: QWidget) {
    this.insertBefore(child);
  }

  public insertBefore(child: QWidget) {
    if (!detectIsTableItem(child)) return;
    runAtTheEndOfCommit(() => {
      this.setItem(child.getRow(), child.getCol(), child);
    });
  }

  public removeChild() {
    throwUnsupported(this);
  }
}

export { Table, QDarkTable };
