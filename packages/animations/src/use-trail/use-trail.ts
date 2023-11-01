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
        return new Promise<boolean>(resolve => {
          const [controller] = scope.controllers;
          const controller$ = scope.controllers[scope.controllers.length - 1];
          const fn$ = ((pv: SpringValue<T>) => ({ ...controller.getTo(), ...(fn && fn(pv)) })) as Updater<T>;

          controller.start(fn$);
          scope.unsubscribe && scope.unsubscribe();
          scope.unsubscribe = controller$.subscribe('end', value => {
            const dest = controller.getDest();
            const isDiff = MotionController.detectAreValuesDiff(value, dest, controller.getConfigFn());

            if (!isDiff) {
              scope.unsubscribe();
              resolve(true);
            }
          });
        });
      },
    }),
    [],
  );

  useLayoutEffect(() => {
    const { controllers } = scope;
    const unsubs: Array<Callback> = [];

    for (let i = 0; i < controllers.length; i++) {
      const controller = controllers[i];
      const nextController = controllers[i + 1];

      if (nextController) {
        const unsub = controller.subscribe('change', value => nextController.start(() => value));

        unsubs.push(unsub);
      }
    }

    return () => unsubs.forEach(x => x());
  }, []);

  useLayoutEffect(() => () => scope.controllers.map(x => x.cancel()), []);

  return [values, api];
}

export type TrailApi<T extends string> = {
  start: (fn?: Updater<T>) => Promise<boolean>;
};

export { useTrail };
