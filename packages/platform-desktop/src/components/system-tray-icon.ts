import { QWidget, QSystemTrayIcon, type QSystemTrayIconSignals, type QIcon } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithSlotProps, Container } from '../shared';
import { qSystemTrayIcon } from '../factory';
import { throwUnsupported } from '../utils';
import { detectIsMenu } from './menu';

export type SystemTrayIconProps = WithSlotProps<
  {
    visible: boolean;
    icon: QIcon;
    toolTip?: string;
  } & WidgetProps
>;
export type SystemTrayIconRef = QDarkSystemTrayIcon;
export type SystemTrayIconSignals = QSystemTrayIconSignals;

const SystemTrayIcon = forwardRef<SystemTrayIconProps, SystemTrayIconRef>(
  component((props, ref) => qSystemTrayIcon({ ref, ...props }), { displayName: 'SystemTrayIcon' }),
) as ComponentFactory<SystemTrayIconProps, SystemTrayIconRef>;

class QDarkSystemTrayIcon extends QSystemTrayIcon implements Container {
  constructor() {
    super();
    globalThis.tray = this;
  }

  public detectIsContainer() {
    return true;
  }

  public setVisible(value: boolean) {
    value ? this.show() : this.hide();
  }

  public appendChild(child: QWidget) {
    if (!detectIsMenu(child)) return console.warn(`SystemTrayIcon supports only Menu as its children`);
    this.setContextMenu(child);
  }

  public insertBefore() {
    throwUnsupported(this);
  }

  public removeChild() {
    throwUnsupported(this);
  }
}

function detectIsSystemTrayIcon(value: unknown): value is QDarkSystemTrayIcon {
  return value instanceof QDarkSystemTrayIcon;
}

export { SystemTrayIcon, QDarkSystemTrayIcon, detectIsSystemTrayIcon };
