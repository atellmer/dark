import { type AlignmentFlag, type QIcon, QTableWidgetItem, QBrush, QColor } from '@nodegui/nodegui';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { WithStandardProps } from '../shared';
import { qTableItem } from '../factory';

// <Table columnCount={2} rowCount={2}>
//   <TableItem row={0} col={0} text='0, 0' />
//   <TableItem row={0} col={1} text='0, 1' />
//   <TableItem row={1} col={0} text='1, 0' />
//   <TableItem row={1} col={1} text='1, 1' />
// </Table>

export type TableItemProps = WithStandardProps<{
  ref?: Ref<TableItemRef>;
  row: number;
  col: number;
  text: string;
  textAlignment?: AlignmentFlag;
  backgroundColor?: string;
  icon?: QIcon;
  toolTip?: string;
}>;
export type TableItemRef = QDarkTableItem;

const TableItem = component<TableItemProps>(props => qTableItem(props), {
  displayName: 'TableItem',
}) as ComponentFactory<TableItemProps>;

class QDarkTableItem extends QTableWidgetItem {
  private tableRow: number = undefined;
  private tableCol: number = undefined;

  setRow(value: number) {
    this.tableRow = value;
  }

  getRow(): number | undefined {
    return this.tableRow;
  }

  setCol(value: number) {
    this.tableCol = value;
  }

  getCol(): number | undefined {
    return this.tableCol;
  }

  setBackgroundColor(value: string) {
    this.setBackground(new QBrush(new QColor(value)));
  }
}

function detectIsTableItem(value: unknown): value is QDarkTableItem {
  return value instanceof QDarkTableItem;
}

export { TableItem, QDarkTableItem, detectIsTableItem };
