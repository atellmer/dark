import { detectIsFunction, detectIsUndefined, $$scope, detectIsArray } from '@dark-engine/core';

import type { TagNativeElement } from '../native-element';
import { PREVENT } from '../constants';

export type EventHandler<E extends Event = Event, T = unknown> =
  | ((e: SyntheticEvent<E, T>) => void)
  | [(...args: Array<any>) => void, ...args: Array<any>];

type BrowserEvent = (type: string, event: Event) => void;

class SyntheticEvent<E extends Event, T = TagNativeElement> {
  type = '';
  sourceEvent: E = null;
  target: T = null;
  propagation = true; //should be private but typescript has a bug

  constructor(options: Pick<SyntheticEvent<E, T>, 'sourceEvent' | 'target'>) {
    this.type = options.sourceEvent.type;
    this.sourceEvent = options.sourceEvent;
    this.target = options.target;
  }

  stopPropagation() {
    this.propagation = false;
    this.sourceEvent.stopPropagation();
  }

  preventDefault() {
    this.sourceEvent.preventDefault();
  }

  getPropagation() {
    return this.propagation;
  }
}

function delegateEvent(target: Element, eventName: string, handler: EventHandler) {
  const $scope = $$scope();
  const eventsMap = $scope.getEvents();
  const handlersMap = eventsMap.get(eventName);
  const $handler = detectIsArray(handler) ? (e: Event) => handler[0](...handler.slice(1), e) : handler;

  if (!handlersMap) {
    const rootHandler = (event: Event) => {
      const handler = eventsMap.get(eventName).get(event.target);
      const target = event.target as TagNativeElement;
      let $event: SyntheticEvent<Event> = null;

      target[PREVENT] && event.preventDefault();

      if (detectIsFunction(handler)) {
        $event = new SyntheticEvent({ sourceEvent: event, target });
        $scope.setIsEventZone(true);
        exec($event, handler);
        $scope.setIsEventZone(false);
      }

      if (target.parentElement) {
        const shouldPropagate = $event ? $event.getPropagation() : true;

        if (shouldPropagate) {
          target.parentElement.dispatchEvent(new (event.constructor as BrowserEvent)(event.type, event));
        }
      }
    };

    eventsMap.set(eventName, new WeakMap([[target, $handler]]));
    document.addEventListener(eventName, rootHandler, true);
    $scope.addEventUnsubscriber(() => document.removeEventListener(eventName, rootHandler, true));
  } else {
    handlersMap.set(target, $handler);
  }
}

function exec(event: SyntheticEvent<Event>, handler: Function) {
  const arg = handler(event);

  if (detectIsUndefined(arg)) return;
  switch (event.type) {
    case 'input':
      (event.target as HTMLInputElement).value = String(arg);
      break;
  }
}

const detectIsEvent = (attrName: string) => attrName.startsWith('on');

const getEventName = (attrName: string) => attrName.slice(2, attrName.length).toLowerCase();

export { SyntheticEvent, delegateEvent, detectIsEvent, getEventName };
