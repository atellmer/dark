import {
  type Component,
  type TagVirtualNodeFactory,
  component,
  useMemo,
  useLayoutEffect,
  scope$$,
  walk,
} from '@dark-engine/core';

import { type SpringValue } from '../shared';
import { type Spring } from '../spring';

type AnimatedProps<E = unknown, T extends string = string> = {
  spring: Spring<T>;
  fn: StyleFn<E, T>;
  slot: Component | TagVirtualNodeFactory;
};

const Animated = component<AnimatedProps>(({ spring, fn, slot }) => {
  const cursor = scope$$().getCursorFiber();
  const scope = useMemo(() => ({ element: null }), []);
  const notify = () => scope.element && fn(scope.element, spring.toValue());

  useLayoutEffect(() => {
    const fiber = cursor.hook.getOwner();

    walk(fiber.child, (fiber, _, stop) => {
      if (fiber.element) {
        scope.element = fiber.element;
        return stop();
      }
    });

    notify();

    return spring.on(notify);
  }, []);

  notify();

  return slot;
});

type StyleFn<E = unknown, T extends string = string> = (element: E, value: SpringValue<T>) => void;

export { Animated };
