import { useMemo, useUpdate, useLayoutEffect, detectIsFunction, type Callback } from '@dark-engine/core';

import { type SpringValue } from '../shared';
import { type Updater, type GetPartialConfig, MotionController } from '../controller';
import { getFirstKey } from '../utils';

type UseMotionOptions<T extends string> = {
  from: SpringValue<T>;
  to?: SpringValue<T>;
  config?: GetPartialConfig<T>;
  loop?: boolean;
  reverse?: boolean;
  outside?: (spring: SpringValue<T>) => void;
  onStart?: () => void;
  onChange?: () => void;
  onEnd?: () => void;
};

function useMotion<T extends string>(options: UseMotionOptions<T>): [SpringValue<T>, MotionApi<T>] {
  const { from, to, config, loop, reverse, outside, onStart, onChange, onEnd } = options;
  const update$ = useUpdate();
  const update = (value: SpringValue<T>) => (detectIsFunction(outside) ? outside(value) : update$());
  const scope = useMemo(() => ({ controller: new MotionController(from, to, update, config) }), []);
  const { controller } = scope;
  const value = controller.getValue();
  const api = useMemo<MotionApi<T>>(
    () => ({
      start: (fn?: Updater<T>) => {
        return controller.start(((pv: SpringValue<T>) => ({ ...to, ...(fn && fn(pv)) })) as Updater<T>);
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
          const key = getFirstKey(from);

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
