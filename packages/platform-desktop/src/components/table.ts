import { type QTableWidgetSignals, QWidget, QTableWidget } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithSlotProps, Container } from '../shared';
import { qTable } from '../factory';
import { detectIsTableItem } from './table-item';
import { runAtTheEndOfCommit } from '../dom';
import { throwUnsupported } from '../utils';

// <Table columnCount={2} rowCount={2}>
//   <TableItem row={0} col={0} text='0, 0' />
//   <TableItem row={0} col={1} text='0, 1' />
//   <TableItem row={1} col={0} text='1, 0' />
//   <TableItem row={1} col={1} text='1, 1' />
// </Table>

export type TableProps = WithSlotProps<
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
  detectIsContainer() {
    return true;
  }

  setGridHidden(value: boolean) {
    this.setShowGrid(!value);
  }

  appendChild(child: QWidget) {
    this.insertBefore(child);
  }

  insertBefore(child: QWidget) {
    if (!detectIsTableItem(child)) return;
    runAtTheEndOfCommit(() => {
      this.setItem(child.getRow(), child.getCol(), child);
    });
  }

  removeChild() {
    throwUnsupported(this);
  }
}

export { Table, QDarkTable };
