import type { NavigationButton as NSNavigationButton } from '@nativescript/core';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { NavigationButtonAttributes } from '../jsx';
import { navigationButton } from '../factory';

export type NavigationButtonProps = {
  ref?: Ref<NavigationButtonRef>;
} & NavigationButtonAttributes;
export type NavigationButtonRef = NSNavigationButton;

const NavigationButton = component<NavigationButtonProps>(props => navigationButton(props), {
  displayName: 'NavigationButton',
}) as ComponentFactory<NavigationButtonProps>;

export { NavigationButton };
