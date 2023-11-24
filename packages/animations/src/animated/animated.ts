import {
  type Component,
  type TagVirtualNodeFactory,
  component,
  useMemo,
  useLayoutEffect,
  scope$$,
  walk,
} from '@dark-engine/core';

import { type SpringValue, type SpringItem } from '../shared';

type AnimatedProps<E = unknown, T extends string = string> = {
  spring: SpringItem<T>;
  fn: StyleSubscriber<E, T>;
  slot: Component | TagVirtualNodeFactory;
};

const Animated = component<AnimatedProps>(({ spring, fn, slot }) => {
  const cursor = scope$$().getCursorFiber();
  const scope = useMemo(() => ({ element: null }), []);

  useLayoutEffect(() => {
    const fiber = cursor.hook.getOwner();

    walk(fiber.child, (fiber, _, stop) => {
      if (fiber.element) {
        scope.element = fiber.element;
        return stop();
      }
    });

    fn(scope.element, spring.getValue());
  }, []);

  spring.ctrl.setNotifier(value => scope.element && fn(scope.element, value));
  scope.element && fn(scope.element, spring.getValue());

  return slot;
});

type StyleSubscriber<E = unknown, T extends string = string> = (element: E, value: SpringValue<T>) => void;

export { Animated };
