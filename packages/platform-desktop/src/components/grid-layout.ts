import { QWidget, QGridLayout } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef, detectIsArray, detectIsNumber } from '@dark-engine/core';

import type { WidgetProps, WithExtendedProps, Container } from '../shared';
import { qGridLayout } from '../factory';
import { detectIsGridItem } from './grid-item';
import { throwUnsupported } from '../utils';
import { runAtTheEndOfCommit } from '../dom';

export type GridLayoutProps = WithExtendedProps<
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
  isContainer = true;
  gridLayout = new QGridLayout();

  constructor() {
    super();
    this.setLayout(this.gridLayout);
  }

  getGridLayout() {
    return this.gridLayout;
  }

  setHorizontalSpacing(value: number) {
    this.gridLayout.setHorizontalSpacing(value);
  }

  setVerticalSpacing(value: number) {
    this.gridLayout.setVerticalSpacing(value);
  }

  setColumnStretch(value: Array<ValueVariant>) {
    setIndexedValue(value, (...args) => this.gridLayout.setColumnStretch(...args));
  }

  setRowStretch(value: Array<ValueVariant>) {
    setIndexedValue(value, (...args) => this.gridLayout.setRowStretch(...args));
  }

  setRowMinimumHeight(value: Array<ValueVariant>) {
    setIndexedValue(value, (...args) => this.gridLayout.setRowMinimumHeight(...args));
  }

  setColumnMinimumWidth(value: Array<ValueVariant>) {
    setIndexedValue(value, (...args) => this.gridLayout.setColumnMinimumWidth(...args));
  }

  appendChild(child: QWidget) {
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

  insertBefore() {
    throwUnsupported(this);
  }

  removeChild(child: QWidget) {
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
