import { type ScheduleCallbackOptions, platform } from '../platform';
import { getRootId, scope$$ } from '../scope';
import { type UpdateChanger, createUpdateCallback } from '../workloop';
import { TaskPriority } from '../constants';
import { useMemo } from '../use-memo';

export type UseUpdateOptions = Pick<ScheduleCallbackOptions, 'priority' | 'forceAsync'>;
export type UpdateOptions = UpdateChanger;

function useUpdate({ priority: priority$ = TaskPriority.NORMAL, forceAsync: forceAsync$ }: UseUpdateOptions = {}) {
  const rootId = getRootId();
  const scope = useMemo(() => ({ fiber: null }), []);
  const update = (createChanger?: () => UpdateChanger) => {
    const scope$ = scope$$();
    if (scope$.getIsInsertionEffectsZone()) return;
    const isTransition = scope$.getIsTransitionZone();
    const priority = isTransition ? TaskPriority.LOW : priority$;
    const forceAsync = isTransition || forceAsync$;
    const getFiber = () => scope.fiber;
    const callback = createUpdateCallback({
      rootId,
      priority,
      isTransition,
      getFiber,
      createChanger,
    });
    const callbackOptions: ScheduleCallbackOptions = { forceAsync, priority };

    platform.schedule(callback, callbackOptions);
  };

  scope.fiber = scope$$().getCursorFiber();

  return update;
}

export { useUpdate };
