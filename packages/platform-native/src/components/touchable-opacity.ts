import { type TouchGestureEventData, AccessibilityRole } from '@nativescript/core';
import { type DarkElement, type ComponentFactory, component, detectIsFunction, useEvent } from '@dark-engine/core';
import { type SpringValue, Animated, useSpring } from '@dark-engine/animations';

import { type ViewProps, View } from './view';
import { type SyntheticEvent } from '../events';
import { type TagNativeElement } from '../native-element';

export type TouchableOpacityProps = {
  disabled?: boolean;
  slot: DarkElement;
  onPress: (e: SyntheticEvent<TouchGestureEventData>) => void;
} & ViewProps;

const TouchableOpacity = component<TouchableOpacityProps>(
  ({ disabled, slot, onPress, ...rest }) => {
    const [item, api] = useSpring({
      from: { opacity: 1 },
      config: () => ({ tension: 400 }),
    });

    const handleTouch = useEvent((e: SyntheticEvent<TouchGestureEventData>) => {
      if (disabled) return;
      const action = e.sourceEvent.action;
      const isDown = action === 'down';
      const isUp = action === 'up';

      detectIsFunction(rest.onTouch) && rest.onTouch(e);

      if (isDown) {
        detectIsFunction(onPress) && onPress(e);
        api.start(to(0.3));
      } else if (isUp) {
        api.start(to(1));
      }
    });

    return Animated({
      spring: item,
      fn: styleFn(disabled),
      slot: View({
        accessibilityRole: AccessibilityRole.Button,
        ...rest,
        slot,
        onTouch: handleTouch,
      }),
    });
  },
  { displayName: 'TouchableOpacity' },
) as ComponentFactory<TouchableOpacityProps>;

const to = (x: number) => () => ({ to: { opacity: x } });

const styleFn = (isDisabled: boolean) => (element: TagNativeElement, value: SpringValue<'opacity'>) => {
  element.getNativeView().opacity = isDisabled ? 0.5 : value.opacity;
};

export { TouchableOpacity };
