import { useMemo, useUpdate, useLayoutEffect, detectIsFunction, batch, type Callback } from '@dark-engine/core';

import { type Updater, MotionController } from '../controller';
import { type SpringValue } from '../shared';
import { range } from '../utils';
import { type UseMotionOptions } from '../use-motion';

type TrailItemOptions<T extends string> = Omit<UseMotionOptions<T>, 'onStart' | 'onChange' | 'onEnd'>;

function useTrail<T extends string>(
  count: number,
  configurator: (idx: number) => TrailItemOptions<T>,
  deps: Array<any> = [],
): [Array<SpringValue<T>>, TrailApi<T>] {
  const update$ = useUpdate();
  const scope = useMemo(
    () => ({
      controllers: range(count).map(() => new MotionController()),
      unsubscribe: null,
      fromReverse: false,
    }),
    [],
  );

  useMemo(() => {
    scope.controllers.forEach((controller, idx) => {
      const { from, to, config, outside } = configurator(idx);
      const update = (value: SpringValue<T>) => (detectIsFunction(outside) ? outside(value) : batch(() => update$()));

      controller.setFrom(from);
      controller.setTo(to);
      controller.setConfigFn(config);
      controller.setUpdate(update);
    });
  }, deps);

  const values = scope.controllers.map(x => x.getValue());
  const api = useMemo<TrailApi<T>>(
    () => ({
      start: (fn?: Updater<T>) => {
        const [controller] = scope.controllers;
        const fn$ = ((pv: SpringValue<T>) => ({ ...controller.getTo(), ...(fn && fn(pv)) })) as Updater<T>;

        subscribeIfNecessary(false);
        controller.start(fn$);
      },
      reverse: () => {
        const lastController = scope.controllers[scope.controllers.length - 1];

        subscribeIfNecessary(true);
        lastController.reverse();
      },
      toggle: () => {
        const [controller] = scope.controllers;

        subscribeIfNecessary(false);
        controller.toggle();
      },
    }),
    [],
  );

  const subscribeIfNecessary = (fromReverse: boolean) => {
    if (scope.fromReverse || fromReverse) {
      scope.unsubscribe && scope.unsubscribe();
      scope.unsubscribe = subscribe(fromReverse);
    }

    scope.fromReverse = fromReverse;
  };

  const subscribe = (fromReverse = false) => {
    const { controllers } = scope;
    const unsubs: Array<Callback> = [];
    const processController = (idx: number) => {
      const controller = controllers[idx];
      const controller$ = fromReverse ? controllers[idx - 1] : controllers[idx + 1];

      if (controller$) {
        const unsub = controller.subscribe('change', value => controller$.start(() => value));

        unsubs.push(unsub);
      }
    };

    if (fromReverse) {
      for (let i = controllers.length - 1; i > 0; i--) {
        processController(i);
      }
    } else {
      for (let i = 0; i < controllers.length; i++) {
        processController(i);
      }
    }

    return () => unsubs.forEach(x => x());
  };

  useLayoutEffect(() => {
    scope.unsubscribe = subscribe();

    return () => scope.unsubscribe && scope.unsubscribe();
  }, []);

  useLayoutEffect(() => () => scope.controllers.map(x => x.cancel()), []);

  return [values, api];
}

export type TrailApi<T extends string> = {
  start: (fn?: Updater<T>) => void;
  reverse: () => void;
  toggle: () => void;
};

export { useTrail };
