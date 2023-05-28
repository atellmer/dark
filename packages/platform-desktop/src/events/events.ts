import type { WidgetEventTypes } from '@nodegui/nodegui';

import { type NGElement } from '../registry';

class SyntheticEvent<E, T = NGElement> {
  public type = '';
  public sourceEvent: E = null;
  public target: T = null;

  constructor(options: SyntheticEvent<E, T>) {
    this.type = options.type;
    this.sourceEvent = options.sourceEvent;
    this.target = options.target;
  }
}

function createSyntheticEventHandler(eventName: WidgetEventTypes, handler: Function) {
  const syntheticHandler = (sourceEvent: any) => {
    const event = new SyntheticEvent({ type: eventName, sourceEvent, target: sourceEvent.object });

    handler(event);
  };

  return syntheticHandler;
}

const detectIsEvent = (attrName: string) => attrName.startsWith('on');

const getEventName = (attrName: string) =>
  attrName
    .slice(2, attrName.length)
    .split('')
    .map((x, idx) => (idx === 0 ? x.toLowerCase() : x))
    .join('') as WidgetEventTypes;

export { SyntheticEvent, createSyntheticEventHandler, detectIsEvent, getEventName };
