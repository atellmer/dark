import { QWidget, QGridLayout } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef, detectIsArray, detectIsNumber } from '@dark-engine/core';

import type { WidgetProps, WithSlotProps, Container } from '../shared';
import { qGridLayout } from '../factory';
import { detectIsGridItem } from './grid-item';
import { throwUnsupported } from '../utils';
import { runAtTheEndOfCommit } from '../dom';

export type GridLayoutProps = WithSlotProps<
  {
    horizontalSpacing?: number;
    verticalSpacing?: number;
    columnStretch?: Array<ValueVariant>;
    rowStretch?: Array<ValueVariant>;
    rowMinimumHeight?: Array<ValueVariant>;
    columnMinimumWidth?: Array<ValueVariant>;
  } & WidgetProps
>;
export type GridLayoutRef = QDarkGridLayout;

type ValueVariant = number | undefined;

const GridLayout = forwardRef<GridLayoutProps, GridLayoutRef>(
  component((props, ref) => qGridLayout({ ref, ...props }), { displayName: 'GridLayout' }),
) as ComponentFactory<GridLayoutProps, GridLayoutRef>;

class QDarkGridLayout extends QWidget implements Container {
  private gridLayout = new QGridLayout();

  constructor() {
    super();
    this.setLayout(this.gridLayout);
  }

  public detectIsContainer() {
    return true;
  }

  public getGridLayout() {
    return this.gridLayout;
  }

  public setHorizontalSpacing(value: number) {
    this.gridLayout.setHorizontalSpacing(value);
  }

  public setVerticalSpacing(value: number) {
    this.gridLayout.setVerticalSpacing(value);
  }

  public setColumnStretch(value: Array<ValueVariant>) {
    setIndexedValue(value, (...args) => this.gridLayout.setColumnStretch(...args));
  }

  public setRowStretch(value: Array<ValueVariant>) {
    setIndexedValue(value, (...args) => this.gridLayout.setRowStretch(...args));
  }

  public setRowMinimumHeight(value: Array<ValueVariant>) {
    setIndexedValue(value, (...args) => this.gridLayout.setRowMinimumHeight(...args));
  }

  public setColumnMinimumWidth(value: Array<ValueVariant>) {
    setIndexedValue(value, (...args) => this.gridLayout.setColumnMinimumWidth(...args));
  }

  public appendChild(child: QWidget) {
    if (!detectIsGridItem(child)) return;
    runAtTheEndOfCommit(() => {
      this.gridLayout.addWidget(
        child.getChild(),
        child.getRow(),
        child.getCol(),
        child.getRowSpan(),
        child.getColSpan(),
        child.getAlignment(),
      );
    });
  }

  public insertBefore() {
    throwUnsupported(this);
  }

  public removeChild(child: QWidget) {
    if (!detectIsGridItem(child)) return;
    this.gridLayout.removeWidget(child);
    child.close();
  }
}

function setIndexedValue(value: Array<ValueVariant>, fn: (idx: number, x: number) => void) {
  if (!detectIsArray(value)) return;
  value.forEach((x, idx) => detectIsNumber(x) && fn(idx, x));
}

export { GridLayout, QDarkGridLayout };
