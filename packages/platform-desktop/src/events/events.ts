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

function useEventHandler<T>(
  handlers: Partial<
    Record<T extends QWidgetSignals ? keyof T : T extends WidgetEventTypes ? WidgetEventTypes : never, EventHandler>
  >,
  deps: Array<any>,
) {
  return useMemo(() => handlers, deps);
}

export { SyntheticEvent, createSyntheticEventHandler, detectIsEvent, useEventHandler };
