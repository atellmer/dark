import { useMemo, useUpdate, detectIsFunction } from '@dark-engine/core';

import { type SpringValue, type Config } from '../shared';
import { MotionController } from '../controller';

type UseMotionOptions<T extends string> = {
  from: SpringValue<T>;
  to: SpringValue<T>;
  config?: Partial<Config>;
  outside?: (spring: SpringValue<T>) => void;
};

function useMotion<T extends string>(options: UseMotionOptions<T>): [SpringValue<T>, Api] {
  const { from, to, config, outside } = options;
  const update$ = useUpdate();
  const update = (springs: SpringValue<T>) => (detectIsFunction(outside) ? outside(springs) : update$());
  const scope = useMemo(() => ({ controller: new MotionController(from, update, config) }), []);
  const springs = scope.controller.getSpring();
  const api: Api = {
    start: () => {
      scope.controller.setParams(from, to, config);
      scope.controller.start();
    },
    reverse: () => {
      scope.controller.setParams(from, to, config);
      scope.controller.reverse();
    },
    toggle: () => {
      scope.controller.setParams(from, to, config);
      scope.controller.toggle();
    },
    pause: () => {
      scope.controller.setParams(from, to, config);
      scope.controller.pause();
    },
    resume: () => {
      scope.controller.setParams(from, to, config);
      scope.controller.resume();
    },
  };

  return [springs, api];
}

type Api = {
  start: () => void;
  reverse: () => void;
  toggle: () => void;
  pause: () => void;
  resume: () => void;
};

export { useMotion };
