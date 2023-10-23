import { useMemo, useUpdate, detectIsFunction } from '@dark-engine/core';

import { type SpringValue, type Config } from '../shared';
import { MotionController } from '../controller';

type UseMotionOptions<T extends string> = {
  from: SpringValue<T>;
  to?: SpringValue<T>;
  config?: Partial<Config>;
  outside?: (spring: SpringValue<T>) => void;
};

function useMotion<T extends string>(options: UseMotionOptions<T>): [SpringValue<T>, Api<T>] {
  const { from, to, config, outside } = options;
  const update$ = useUpdate();
  const update = (springs: SpringValue<T>) => (detectIsFunction(outside) ? outside(springs) : update$());
  const scope = useMemo(() => ({ controller: new MotionController(from, update, config) }), []);
  const springs = scope.controller.getSpring();
  const api: Api<T> = {
    start: (dest: Partial<SpringValue<T>> = {}) => {
      scope.controller.start({ ...to, ...dest });
    },
  };

  return [springs, api];
}

type Api<T extends string> = {
  start: (dest?: Partial<SpringValue<T>>) => void;
};

export { useMotion };
