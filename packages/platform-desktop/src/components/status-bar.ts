import { QStatusBar, type QWidget, type QStatusBarSignals } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithSlotProps, Container } from '../shared';
import { qStatusBar } from '../factory';
import { detectIsDialog } from './dialog';

export type StatusBarProps = WithSlotProps<
  {
    sizeGripEnabled?: boolean;
  } & WidgetProps
>;
export type StatusBarRef = QDarkStatusBar;
export type StatusBarSignals = QStatusBarSignals;

const StatusBar = forwardRef<StatusBarProps, StatusBarRef>(
  component((props, ref) => qStatusBar({ ref, ...props }), { displayName: 'StatusBar' }),
) as ComponentFactory<StatusBarProps, StatusBarRef>;

class QDarkStatusBar extends QStatusBar implements Container {
  constructor() {
    super();
    this.setSizeGripEnabled(false);
  }

  public detectIsContainer() {
    return true;
  }

  public appendChild(child: QWidget) {
    if (detectIsDialog(child)) return;
    this.addWidget(child);
  }

  public insertBefore(child: QWidget, _: QWidget, idx: number) {
    if (detectIsDialog(child)) return;
    this.insertWidget(idx, child);
  }

  public removeChild(child: QWidget) {
    if (detectIsDialog(child)) return;
    this.removeWidget(child);
    child.close();
  }
}

function detectIsStatusBar(value: unknown): value is QDarkStatusBar {
  return value instanceof QDarkStatusBar;
}

export { StatusBar, QDarkStatusBar, detectIsStatusBar };
