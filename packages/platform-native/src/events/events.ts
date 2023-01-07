import { EventData } from '@nativescript/core';

import type { TagNativeElement } from '../native-element';

class SyntheticEvent<E extends EventData, T = TagNativeElement> {
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
    const event = new SyntheticEvent({
      sourceEvent,
      target: sourceEvent.object,
    });

    handler(event);
  };

  return syntheticHandler;
}

const detectIsEvent = (attrName: string) => attrName.startsWith('on');

const getEventName = (attrName: string) => attrName.slice(2, attrName.length).toLowerCase();

export { SyntheticEvent, createSyntheticEventHandler, detectIsEvent, getEventName };
