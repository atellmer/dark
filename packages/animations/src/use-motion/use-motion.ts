import { useMemo, useUpdate, useLayoutEffect, detectIsFunction } from '@dark-engine/core';

import { type SpringValue, type Config } from '../shared';
import { type Updater, MotionController } from '../controller';

type UseMotionOptions<T extends string> = {
  from: SpringValue<T>;
  to?: SpringValue<T>;
  config?: Partial<Config>;
  outside?: (spring: SpringValue<T>) => void;
};

function useMotion<T extends string>(options: UseMotionOptions<T>): [SpringValue<T>, Api<T>] {
  const { from, to, config, outside } = options;
  const update$ = useUpdate();
  const update = (value: SpringValue<T>) => (detectIsFunction(outside) ? outside(value) : update$());
  const scope = useMemo(() => ({ controller: new MotionController(from, to, update, config) }), []);
  const value = scope.controller.getValue();
  const api: Api<T> = {
    start: (fn?: Updater<T>) => {
      const fn$ = ((pv: SpringValue<T>) => ({ ...to, ...(fn && fn(pv)) })) as Updater<T>;

      scope.controller.start(fn$);
    },
    reverse: () => scope.controller.reverse(),
    pause: () => scope.controller.pause(),
  };

  useLayoutEffect(() => () => scope.controller.cancel(), []);

  return [value, api];
}

type Api<T extends string> = {
  start: (fn?: Updater<T>) => void;
  reverse: () => void;
  pause: () => void;
};

export { useMotion };
