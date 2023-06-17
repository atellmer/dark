import { QWidget, QMenu, type QMenuSignals, type QIcon } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithExtendedProps, Container } from '../shared';
import { qMenu } from '../factory';
import { QDarkAction } from './action';
import { throwUnsupported } from '../utils';

export type MenuProps = WithExtendedProps<
  {
    title?: string;
    icon?: QIcon;
  } & WidgetProps
>;
export type MenuRef = QDarkMenu;
export type MenuSignals = QMenuSignals;

const Menu = forwardRef<MenuProps, MenuRef>(
  component((props, ref) => qMenu({ ref, ...props }), { displayName: 'Menu' }),
) as ComponentFactory<MenuProps, MenuRef>;

class QDarkMenu extends QMenu implements Container {
  public detectIsContainer() {
    return true;
  }

  public appendChild(child: QWidget) {
    if (child instanceof QDarkAction) {
      this.addAction(child);
    } else {
      console.warn('Menu supports only Action as its children!');
      throwUnsupported(this);
    }
  }

  public insertBefore() {
    throwUnsupported(this);
  }

  public removeChild(child: QWidget) {
    if (child instanceof QDarkAction) {
      this.removeAction(child);
    }
  }
}

export { Menu, QDarkMenu };
