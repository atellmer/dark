import { QWidget, QMenuBar, type QMenuBarSignals } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithExtendedProps, Container } from '../shared';
import { qMenuBar } from '../factory';
import { QDarkMenu } from './menu';
import { throwUnsupported } from '../utils';

export type MenuBarProps = WithExtendedProps<{} & WidgetProps>;
export type MenuBarRef = QDarkMenuBar;
export type MenuBarSignals = QMenuBarSignals;

const MenuBar = forwardRef<MenuBarProps, MenuBarRef>(
  component((props, ref) => qMenuBar({ ref, ...props }), { displayName: 'MenuBar' }),
) as ComponentFactory<MenuBarProps, MenuBarRef>;

class QDarkMenuBar extends QMenuBar implements Container {
  isContainer = true;

  appendChild(child: QWidget) {
    if (child instanceof QDarkMenu) {
      this.addMenu(child);
    } else {
      console.warn('MenuBar supports only Menu as its children');
      throwUnsupported(this);
    }
  }

  insertBefore() {
    throwUnsupported(this);
  }

  removeChild() {
    throwUnsupported(this);
  }
}

export { MenuBar, QDarkMenuBar };
