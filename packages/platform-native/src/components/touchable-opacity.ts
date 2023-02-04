import { type TouchGestureEventData, AccessibilityRole } from '@nativescript/core';
import { type DarkElement, createComponent, detectIsFunction, useEvent, useSpring, useState } from '@dark-engine/core';

import { type ViewProps, View } from './view';
import { type SyntheticEvent } from '../events';

export type TouchableOpacityProps = {
  disabled?: boolean;
  slot: DarkElement;
  onPress: (e: SyntheticEvent<TouchGestureEventData>) => void;
} & ViewProps;

const TouchableOpacity = createComponent<TouchableOpacityProps>(({ disabled, slot, onPress, ...rest }) => {
  const [isPressed, setIsPressed] = useState(false);
  const {
    values: [x],
  } = useSpring(
    {
      state: isPressed,
      getAnimations: ({ state }) => [
        {
          name: 'opacity',
          from: 1,
          to: 0.3,
          duration: state ? DOWN_ANIMATION_DURATION : UP_ANIMATION_DURATION,
        },
      ],
    },
    [isPressed],
  );

  const handleTouch = useEvent((e: SyntheticEvent<TouchGestureEventData>) => {
    if (disabled) return;
    const action = e.sourceEvent.action;
    const isDown = action === 'down';
    const isUp = action === 'up';

    detectIsFunction(rest.onTouch) && rest.onTouch(e);

    if (isDown) {
      detectIsFunction(onPress) && onPress(e);
      setIsPressed(true);
    } else if (isUp) {
      setTimeout(() => {
        setIsPressed(false);
      }, DOWN_ANIMATION_DURATION);
    }
  });

  return View({
    accessibilityRole: AccessibilityRole.Button,
    ...rest,
    slot,
    opacity: disabled ? 0.5 : x,
    onTouch: handleTouch,
  });
});

const DOWN_ANIMATION_DURATION = 50;
const UP_ANIMATION_DURATION = 200;

export { TouchableOpacity };
