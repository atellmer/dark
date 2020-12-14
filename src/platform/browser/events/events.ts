import { isFunction } from '@helpers';
import { eventsHelper } from '@core/scope';

class DarkSyntheticEvent<E extends Event, T = EventTarget> {
  public sourceEvent: E;
  public type: string;
  public target: T;
  public _stopPropagation: boolean = false;

  constructor(options: Partial<DarkSyntheticEvent<E, T>>) {
    this.sourceEvent = options.sourceEvent || null;
    this.type = options.type || null;
    this.target = options.target || null;
  }

  public stopPropagation() {
    this._stopPropagation = true;
    this.sourceEvent.stopPropagation();
  }

  public preventDefault() {
    this.sourceEvent.preventDefault();
  }
}

type DelegateEventOptions = {
  target: Element,
  eventName: string,
  handler: (e: Event) => void,
};

function delegateEvent(options: DelegateEventOptions) {
  const {
    target,
    eventName,
    handler,
  } = options;
  const eventsStore = eventsHelper.get();
  const handlerMap = eventsStore.get(eventName);

  if (!handlerMap) {
    const rootHandler = (e: Event) => {
      const fireEvent =  eventsStore.get(eventName).get(e.target);

      if (isFunction(fireEvent)) {
        const event  = new DarkSyntheticEvent({
          sourceEvent: e,
          type: e.type,
          target: e.target,
        });
        const target = e.target as Element;

        fireEvent(event);

        if (!event._stopPropagation && target.parentElement) {
          const event = new (e as any).constructor(e.type, e);

          target.parentElement.dispatchEvent(event);
        }
      }
    };

    eventsStore.set(eventName, new WeakMap([[target, handler]]));
    document.addEventListener(eventName, rootHandler, true);
  } else {
    handlerMap.set(target, handler);
  }
}

const detectIsEvent = (attrName: string) => attrName.startsWith('on');

const getEventName = (attrName: string) => attrName.slice(2, attrName.length).toLowerCase();

export {
  DarkSyntheticEvent,
  delegateEvent,
  detectIsEvent,
  getEventName,
};
