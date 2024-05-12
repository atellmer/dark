import {
  type Component,
  type TagVirtualNodeFactory,
  type Callback,
  component,
  useMemo,
  useInsertionEffect,
  walk,
  nextTick,
  __useCursor as useCursor,
  __useSSR as useSSR,
} from '@dark-engine/core';

import { type SpringValue } from '../shared';
import { type Spring } from '../spring';

type AnimatedProps<E = unknown, T extends string = string> = {
  spring: Spring<T>;
  fn: StyleFn<E, T>;
  slot: Component | TagVirtualNodeFactory;
};

const Animated = component<AnimatedProps>(
  ({ spring, fn, slot }) => {
    const cursor = useCursor();
    const { isHydration } = useSSR();
    const scope = useMemo<Scope>(() => ({ element: null, notify: null }), []);
    const notify = () => scope.element && fn(scope.element, spring.value());

    scope.notify = notify;

    // !
    useInsertionEffect(() => {
      const make = () => {
        const fiber = cursor.hook.owner;

        walk(fiber.child, (fiber, _, stop) => {
          if (fiber.element) {
            scope.element = fiber.element;
            return stop();
          }
        });

        notify();
      };

      if (isHydration) {
        nextTick(make);
      } else {
        make();
      }

      return spring.on(() => scope.notify());
    }, [spring]);

    notify();

    return slot;
  },
  { displayName: 'Animated' },
);

type Scope = { element: unknown; notify: Callback };
type StyleFn<E = unknown, T extends string = string> = (element: E, value: SpringValue<T>) => void;

export { Animated };
