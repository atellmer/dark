import { type QSystemTrayIconSignals, type QIcon, QWidget, QSystemTrayIcon } from '@nodegui/nodegui';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { WidgetProps, WithSlotProps, Container } from '../shared';
import { qSystemTrayIcon } from '../factory';
import { throwUnsupported } from '../utils';
import { detectIsMenu } from './menu';

// <Window windowTitle='App'>
//   <SystemTrayIcon visible={visible} icon={icon}>
//     <Menu title='File'>
//       <Action text='Open' />
//       <Action text='Create' />
//       <Action text='Save' />
//     </Menu>
//   </SystemTrayIcon>
// </Window>

export type SystemTrayIconProps = WithSlotProps<
  {
    ref?: Ref<SystemTrayIconRef>;
    visible: boolean;
    icon: QIcon;
    toolTip?: string;
  } & WidgetProps
>;
export type SystemTrayIconRef = QDarkSystemTrayIcon;
export type SystemTrayIconSignals = QSystemTrayIconSignals;

const SystemTrayIcon = component<SystemTrayIconProps>(props => qSystemTrayIcon(props), {
  displayName: 'SystemTrayIcon',
}) as ComponentFactory<SystemTrayIconProps>;

class QDarkSystemTrayIcon extends QSystemTrayIcon implements Container {
  constructor() {
    super();
    globalThis.tray = this;
  }

  detectIsContainer() {
    return true;
  }

  setVisible(value: boolean) {
    value ? this.show() : this.hide();
  }

  appendChild(child: QWidget) {
    if (!detectIsMenu(child)) return console.warn(`SystemTrayIcon supports only Menu as its children`);
    this.setContextMenu(child);
  }

  insertBefore() {
    throwUnsupported(this);
  }

  removeChild() {
    throwUnsupported(this);
  }
}

function detectIsSystemTrayIcon(value: unknown): value is QDarkSystemTrayIcon {
  return value instanceof QDarkSystemTrayIcon;
}

export { SystemTrayIcon, QDarkSystemTrayIcon, detectIsSystemTrayIcon };
