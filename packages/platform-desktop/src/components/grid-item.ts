import { QWidget, type AlignmentFlag } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WithExtendedProps, Container } from '../shared';
import { qGridItem } from '../factory';
import { throwUnsupported } from '../utils';

export type GridItemProps = WithExtendedProps<{
  row: number;
  col: number;
  rowSpan?: number;
  colSpan?: number;
  alignment?: AlignmentFlag;
}>;
export type GridItemRef = QDarkGridItem;

const GridItem = forwardRef<GridItemProps, GridItemRef>(
  component((props, ref) => qGridItem({ ref, ...props }), { displayName: 'GridItem' }),
) as ComponentFactory<GridItemProps, GridItemRef>;

class QDarkGridItem extends QWidget implements Container {
  private child: QWidget = null;
  private row: number = undefined;
  private col: number = undefined;
  private rowSpan: number = undefined;
  private colSpan: number = undefined;
  private alignment: AlignmentFlag = undefined;

  public detectIsContainer() {
    return true;
  }

  public getChild() {
    return this.child;
  }

  public setRow(value: number) {
    this.row = value;
  }

  public getRow(): number | undefined {
    return this.row;
  }

  public setCol(value: number) {
    this.col = value;
  }

  public getCol(): number | undefined {
    return this.col;
  }

  public setRowSpan(value: number) {
    this.rowSpan = value;
  }

  public getRowSpan(): number | undefined {
    return this.rowSpan;
  }

  public setColSpan(value: number) {
    this.colSpan = value;
  }

  public getColSpan(): number | undefined {
    return this.colSpan;
  }

  public setAlignment(value: AlignmentFlag) {
    this.alignment = value;
  }

  public getAlignment(): AlignmentFlag | undefined {
    return this.alignment;
  }

  public appendChild(child: QWidget) {
    if (this.child) {
      console.warn(`GridItem can't have more than one child node`);
      throwUnsupported(this);
    }
    this.child = child;
  }

  public insertBefore() {
    throwUnsupported(this);
  }

  public removeChild() {
    this.child = null;
  }
}

function detectIsGridItem(value: unknown): value is QDarkGridItem {
  return value instanceof QDarkGridItem;
}

export { GridItem, QDarkGridItem, detectIsGridItem };
