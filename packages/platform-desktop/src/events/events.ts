import { type QWidgetSignals, WidgetEventTypes } from '@nodegui/nodegui';
import { type NativeRawPointer } from '@nodegui/nodegui/dist/lib/core/Component';
import { useMemo, $$scope } from '@dark-engine/core';

class SyntheticEvent<T> {
  type = '';
  value: T = null;

  constructor(options: SyntheticEvent<T>) {
    this.type = options.type;
    this.value = options.value;
  }
}

function createSyntheticEventHandler(eventName: string, handler: Function) {
  const $scope = $$scope();

  return (value: NativeRawPointer<'QEvent'>) => {
    $scope.setIsEventZone(true);
    handler(new SyntheticEvent({ type: eventName, value }));
    $scope.setIsEventZone(false);
  };
}

const detectIsEvent = (attrName: string) => attrName === 'on';

export type EventHandler<T = any> = (e: SyntheticEvent<T>) => void;

function useEvents<T>(
  map: Partial<
    Record<T extends QWidgetSignals ? keyof T : T extends WidgetEventTypes ? WidgetEventTypes : never, EventHandler>
  >,
) {
  const scope = useMemo(() => ({ map }), []);
  const $map = useMemo(() => {
    const state: typeof map = {};

    for (const key of Object.keys(scope.map)) {
      state[key] = (...args: Array<any>) => scope.map[key](...args);
    }

    return state;
  }, []);

  scope.map = map;

  return $map;
}

export { SyntheticEvent, createSyntheticEventHandler, detectIsEvent, useEvents };
