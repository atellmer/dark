import { type TouchGestureEventData, AccessibilityRole } from '@nativescript/core';
import { type DarkElement, type ComponentFactory, component, detectIsFunction, useEvent } from '@dark-engine/core';
import { useMotion } from '@dark-engine/animations';

import { type ViewProps, View } from './view';
import { type SyntheticEvent } from '../events';

export type TouchableOpacityProps = {
  disabled?: boolean;
  slot: DarkElement;
  onPress: (e: SyntheticEvent<TouchGestureEventData>) => void;
} & ViewProps;

const TouchableOpacity = component<TouchableOpacityProps>(
  ({ disabled, slot, onPress, ...rest }) => {
    const [{ opacity }, api] = useMotion({
      from: { opacity: 1 },
      to: { opacity: 0.3 },
      reverse: true,
      config: () => ({ tension: 400 }),
    });

    const handleTouch = useEvent((e: SyntheticEvent<TouchGestureEventData>) => {
      if (disabled) return;
      const action = e.sourceEvent.action;
      const isDown = action === 'down';

      detectIsFunction(rest.onTouch) && rest.onTouch(e);

      if (isDown) {
        detectIsFunction(onPress) && onPress(e);
        api.start();
      }
    });

    return View({
      accessibilityRole: AccessibilityRole.Button,
      ...rest,
      slot,
      opacity: disabled ? 0.5 : opacity,
      onTouch: handleTouch,
    });
  },
  { displayName: 'TouchableOpacity' },
) as ComponentFactory<TouchableOpacityProps>;

export { TouchableOpacity };
