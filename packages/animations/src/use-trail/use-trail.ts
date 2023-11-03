import { useMemo, useUpdate, useLayoutEffect, detectIsFunction, batch } from '@dark-engine/core';

import { type Updater, SharedState, MotionController, Flow } from '../controller';
import { type SpringValue } from '../shared';
import { range } from '../utils';
import { type UseMotionOptions } from '../use-motion';

type TrailItemOptions<T extends string> = Pick<UseMotionOptions<T>, 'from' | 'to' | 'config' | 'outside'>;

function useTrail<T extends string>(
  count: number,
  configurator: (idx: number) => TrailItemOptions<T>,
  deps: Array<any> = [],
): [Array<SpringValue<T>>, TrailApi<T>] {
  const update = useUpdate();
  const shared = useMemo(() => new SharedState(true), []);
  const scope = useMemo(() => {
    const controllers = range(count).map(key => new MotionController(String(key), shared));

    return { controllers };
  }, []);

  useMemo(() => {
    const { controllers } = scope;
    if (count === controllers.length) return;
    const diff = Math.abs(count - controllers.length);

    if (count > controllers.length) {
      controllers.push(...range(diff).map(key => new MotionController(String(key), shared)));
    } else {
      controllers.splice(count, controllers.length);

      if (controllers.length > 0) {
        controllers[controllers.length - 1].setRight(null);
      }

      console.log('controllers', controllers);
    }
  }, [count]);

  useMemo(() => {
    const { controllers } = scope;

    controllers.forEach((controller, idx) => {
      const { from, to, config, outside } = configurator(idx);
      const left = controllers[idx - 1] || null;
      const right = controllers[idx + 1] || null;
      const notifier = detectIsFunction(outside) ? outside : () => batch(() => update());

      controller.setFrom(from);
      controller.setTo(to);
      controller.setConfigFn(config);
      controller.setLeft(left);
      controller.setRight(right);
      controller.setNotifier(notifier);
    });
  }, [...deps, count]);

  const api = useMemo<TrailApi<T>>(() => {
    const { controllers } = scope;

    return {
      start: (fn?: Updater<T>) => {
        const [controller] = controllers;

        if (!controller) return;
        controller.setFlow(Flow.RIGHT);
        controller.start(fn);
      },
      reverse: () => {
        const controller = controllers[controllers.length - 1];

        if (!controller) return;
        controller.setFlow(Flow.LEFT);
        controller.reverse();
      },
      toggle: () => {
        const [controller] = controllers;

        if (!controller) return;
        controller.setFlow(Flow.RIGHT);
        controller.toggle();
      },
    };
  }, []);

  useLayoutEffect(() => () => scope.controllers.map(x => x.cancel()), []);

  const values = scope.controllers.map(x => x.getValue());

  return [values, api];
}

export type TrailApi<T extends string> = {
  start: (fn?: Updater<T>) => void;
  reverse: () => void;
  toggle: () => void;
};

export { useTrail };
