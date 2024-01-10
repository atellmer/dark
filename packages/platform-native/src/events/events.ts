import { type EventData } from '@nativescript/core';
import { $$scope } from '@dark-engine/core';

import { type NSElement } from '../registry';

class SyntheticEvent<E, T = NSElement> {
  type = '';
  sourceEvent: E = null;
  target: T = null;

  constructor(options: Pick<SyntheticEvent<E, T>, 'sourceEvent' | 'target'>) {
    this.type = (options.sourceEvent as EventData).eventName;
    this.sourceEvent = options.sourceEvent;
    this.target = options.target;
  }
}

function createSyntheticEventHandler(handler: Function) {
  const $scope = $$scope();

  return (sourceEvent: EventData) => {
    $scope.setIsEventZone(true);
    handler(new SyntheticEvent({ sourceEvent, target: sourceEvent.object }));
    $scope.setIsEventZone(false);
  };
}

const detectIsEvent = (attrName: string) => attrName.startsWith('on');

const getEventName = (attrName: string) =>
  attrName
    .slice(2, attrName.length)
    .split('')
    .map((x, idx) => (idx === 0 ? x.toLowerCase() : x))
    .join('');

export { SyntheticEvent, createSyntheticEventHandler, detectIsEvent, getEventName };
