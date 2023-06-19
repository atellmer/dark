import { QTableWidgetItem, QBrush, QColor, type AlignmentFlag, type QIcon } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WithStandardProps } from '../shared';
import { qTableItem } from '../factory';

export type TableItemProps = WithStandardProps<{
  row: number;
  col: number;
  text: string;
  textAlignment?: AlignmentFlag;
  backgroundColor?: string;
  icon?: QIcon;
  toolTip?: string;
}>;
export type TableItemRef = QDarkTableItem;

const TableItem = forwardRef<TableItemProps, TableItemRef>(
  component((props, ref) => qTableItem({ ref, ...props }), { displayName: 'TableItem' }),
) as ComponentFactory<TableItemProps, TableItemRef>;

class QDarkTableItem extends QTableWidgetItem {
  private tableRow: number = undefined;
  private tableCol: number = undefined;

  public detectIsContainer() {
    return true;
  }

  public setRow(value: number) {
    this.tableRow = value;
  }

  public getRow(): number | undefined {
    return this.tableRow;
  }

  public setCol(value: number) {
    this.tableCol = value;
  }

  public getCol(): number | undefined {
    return this.tableCol;
  }

  public setBackgroundColor(value: string) {
    this.setBackground(new QBrush(new QColor(value)));
  }
}

function detectIsTableItem(value: unknown): value is QDarkTableItem {
  return value instanceof QDarkTableItem;
}

export { TableItem, QDarkTableItem, detectIsTableItem };
