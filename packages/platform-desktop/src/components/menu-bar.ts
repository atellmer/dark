import { type QMenuBarSignals, QWidget, QMenuBar } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithSlotProps, Container } from '../shared';
import { qMenuBar } from '../factory';
import { QDarkMenu } from './menu';
import { throwUnsupported } from '../utils';

// <Window windowTitle='App'>
//   <MenuBar>
//     <Menu title='File'>
//       <Action text='Open' />
//       <Action text='Create' />
//       <Action text='Save' />
//     </Menu>
//     <Menu title='Edit'>
//       <Action text='Cut' />
//       <Action text='Copy' />
//       <Action text='Paste' />
//     </Menu>
//   </MenuBar>
// </Window>

export type MenuBarProps = WithSlotProps<{} & WidgetProps>;
export type MenuBarRef = QDarkMenuBar;
export type MenuBarSignals = QMenuBarSignals;

const MenuBar = forwardRef<MenuBarProps, MenuBarRef>(
  component((props, ref) => qMenuBar({ ref, ...props }), { displayName: 'MenuBar' }),
) as ComponentFactory<MenuBarProps, MenuBarRef>;

class QDarkMenuBar extends QMenuBar implements Container {
  public detectIsContainer() {
    return true;
  }

  public appendChild(child: QWidget) {
    if (child instanceof QDarkMenu) {
      this.addMenu(child);
    } else {
      console.warn('MenuBar supports only Menu as its children');
      throwUnsupported(this);
    }
  }

  public insertBefore() {
    throwUnsupported(this);
  }

  public removeChild() {
    throwUnsupported(this);
  }
}

function detectIsMenuBar(value: unknown): value is QDarkMenuBar {
  return value instanceof QDarkMenuBar;
}

export { MenuBar, QDarkMenuBar, detectIsMenuBar };
