import type { NavigationButton as NSNavigationButton } from '@nativescript/core';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { NavigationButtonAttributes } from '../jsx';
import { navigationButton } from '../factory';

export type NavigationButtonProps = NavigationButtonAttributes;
export type NavigationButtonRef = NSNavigationButton;

const NavigationButton = forwardRef<NavigationButtonProps, NavigationButtonRef>(
  component((props, ref) => navigationButton({ ref, ...props }), { displayName: 'NavigationButton' }),
) as ComponentFactory<NavigationButtonProps, NavigationButtonRef>;

export { NavigationButton };
