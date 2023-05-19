import { EventData } from '@nativescript/core';

import { type NSElement } from '../registry';

class SyntheticEvent<E extends EventData, T = NSElement> {
  public type = '';
  public sourceEvent: E = null;
  public target: T = null;

  constructor(options: Pick<SyntheticEvent<E, T>, 'sourceEvent' | 'target'>) {
    this.type = options.sourceEvent.eventName;
    this.sourceEvent = options.sourceEvent;
    this.target = options.target;
  }
}

function createSyntheticEventHandler(handler: Function) {
  const syntheticHandler = (sourceEvent: EventData) => {
    const event = new SyntheticEvent({ sourceEvent, target: sourceEvent.object });

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
    .join('');

export { SyntheticEvent, createSyntheticEventHandler, detectIsEvent, getEventName };
