import { useMemo, useUpdate, useLayoutEffect, detectIsFunction, batch, type Callback } from '@dark-engine/core';

import { type SpringValue } from '../shared';
import { type Updater, type PartialConfigFn, MotionController } from '../controller';

export type UseMotionOptions<T extends string> = {
  from: SpringValue<T>;
  to?: SpringValue<T>;
  config?: PartialConfigFn<T>;
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
  const update$ = useUpdate();
  const update = (value: SpringValue<T>) => (detectIsFunction(outside) ? outside(value) : batch(() => update$()));
  const scope = useMemo(() => ({ controller: new MotionController() }), []);
  const { controller } = scope;

  useMemo(() => {
    controller.setFrom(from);
    controller.setTo(to);
    controller.setConfigFn(config);
    controller.setUpdate(update);
  }, deps);

  const value = controller.getValue();
  const api = useMemo<MotionApi<T>>(
    () => ({
      start: (fn?: Updater<T>) => {
        const fn$ = ((pv: SpringValue<T>) => ({ ...controller.getTo(), ...(fn && fn(pv)) })) as Updater<T>;

        return controller.start(fn$);
      },
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
          const key = MotionController.getAvailableKey(value, from);

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
