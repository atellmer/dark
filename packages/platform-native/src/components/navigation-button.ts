import { NavigationButton as NSNavigationButton } from '@nativescript/core';
import { createComponent, forwardRef } from '@dark-engine/core';

import type { NavigationButtonAttributes } from '../jsx';
import { navigationButton } from '../factory';

export type NavigationButtonProps = NavigationButtonAttributes;
export type NavigationButtonRef = NSNavigationButton;

const NavigationButton = forwardRef<NavigationButtonProps, NavigationButtonRef>(
  createComponent((props, ref) => {
    return navigationButton({ ref, ...props });
  }),
);

export { NavigationButton };
