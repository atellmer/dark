import { type NativeRawPointer } from '@nodegui/nodegui/dist/lib/core/Component';
import { useMemo } from '@dark-engine/core';

class SyntheticEvent<T> {
  public type = '';
  public data: T = null;

  constructor(options: SyntheticEvent<T>) {
    this.type = options.type;
    this.data = options.data;
  }
}

function createSyntheticEventHandler(eventName: string, handler: Function) {
  return (data: NativeRawPointer<'QEvent'>) => handler(new SyntheticEvent({ type: eventName, data }));
}

const detectIsEvent = (attrName: string) => attrName === 'on';

export type EventHandler<T = any> = (e: SyntheticEvent<T>) => void;

function useEventHandler<T>(handlers: Partial<Record<keyof T, EventHandler>>, deps: Array<any>) {
  return useMemo(() => handlers, deps);
}

export { SyntheticEvent, createSyntheticEventHandler, detectIsEvent, useEventHandler };
