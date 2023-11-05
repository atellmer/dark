import { useMemo, useUpdate, useLayoutEffect, detectIsFunction, batch, type Callback } from '@dark-engine/core';

import { type SpringValue } from '../shared';
import { type Updater, type PartialPhysicConfigFn, Controller } from '../controller';

export type UseMotionOptions<T extends string> = {
  from: SpringValue<T>;
  to?: SpringValue<T>;
  config?: PartialPhysicConfigFn<T>;
  loop?: boolean;
  reverse?: boolean;
  outside?: (value: SpringValue<T>) => void;
  onStart?: () => void;
  onChange?: () => void;
  onEnd?: () => void;
};

function useMotion<T extends string>(
  options: UseMotionOptions<T>,
  deps: Array<any> = [],
): [SpringValue<T>, MotionApi<T>] {
  const { from, to, config, loop, reverse, outside, onStart, onChange, onEnd } = options;
  const update = useUpdate();
  const scope = useMemo(() => ({ controller: new Controller() }), []);
  const { controller } = scope;

  useMemo(() => {
    const notifier = detectIsFunction(outside) ? outside : () => batch(() => update());

    controller.setFrom(from);
    controller.setTo(to);
    controller.setConfigFn(config);
    controller.setNotifier(notifier);
  }, deps);

  const value = controller.getValue();
  const api = useMemo<MotionApi<T>>(
    () => ({
      start: (fn?: Updater<T>) => controller.start(fn),
      reverse: () => controller.reverse(),
      toggle: () => controller.toggle(),
      pause: () => controller.pause(),
      reset: () => controller.reset(),
      value: () => controller.getValue(),
    }),
    [],
  );

  useLayoutEffect(() => () => scope.controller.cancel(), []);

  useLayoutEffect(() => {
    const unsubscribe = scope.controller.subscribe('end', value => {
      if (loop) {
        if (reverse) {
          api.toggle();
        } else {
          api.reset();
          api.start();
        }
      } else {
        if (reverse) {
          const key = Controller.getAvailableKey(value, from);

          if (value[key] !== from[key]) {
            api.reverse();
          }
        }
      }
    });

    return unsubscribe;
  }, [loop, reverse]);

  useLayoutEffect(() => {
    const unsubs: Array<Callback> = [];

    detectIsFunction(onStart) && unsubs.push(scope.controller.subscribe('start', onStart));
    detectIsFunction(onChange) && unsubs.push(scope.controller.subscribe('change', onChange));
    detectIsFunction(onEnd) && unsubs.push(scope.controller.subscribe('end', onEnd));

    return () => unsubs.forEach(x => x());
  }, [onStart, onChange, onEnd]);

  return [value, api];
}

export type MotionApi<T extends string> = {
  start: (fn?: Updater<T>) => Promise<boolean>;
  reverse: () => Promise<boolean>;
  toggle: () => Promise<boolean>;
  pause: () => void;
  reset: () => void;
  value: () => SpringValue<T>;
};

export { useMotion };
