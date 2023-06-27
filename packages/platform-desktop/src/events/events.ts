import { type QWidgetSignals, WidgetEventTypes } from '@nodegui/nodegui';
import { type NativeRawPointer } from '@nodegui/nodegui/dist/lib/core/Component';
import { useMemo } from '@dark-engine/core';

class SyntheticEvent<T> {
  public type = '';
  public value: T = null;

  constructor(options: SyntheticEvent<T>) {
    this.type = options.type;
    this.value = options.value;
  }
}

function createSyntheticEventHandler(eventName: string, handler: Function) {
  return (value: NativeRawPointer<'QEvent'>) => handler(new SyntheticEvent({ type: eventName, value }));
}

const detectIsEvent = (attrName: string) => attrName === 'on';

export type EventHandler<T = any> = (e: SyntheticEvent<T>) => void;

function useEventSystem<T>(
  map: Partial<
    Record<T extends QWidgetSignals ? keyof T : T extends WidgetEventTypes ? WidgetEventTypes : never, EventHandler>
  >,
) {
  const scope = useMemo(() => ({ map }), []);
  const map$ = useMemo(() => {
    const state: typeof map = {};

    for (const key of Object.keys(scope.map)) {
      state[key] = (...args: Array<any>) => scope.map[key](...args);
    }

    return state;
  }, []);

  scope.map = map;

  return map$;
}

export { SyntheticEvent, createSyntheticEventHandler, detectIsEvent, useEventSystem };
