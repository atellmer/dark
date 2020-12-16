import { eventsHelper } from '@core/scope';
import { isFunction } from '@helpers';

class DarkSyntheticEvent<E extends Event, T = Element> {
  public type: string = '';
  public sourceEvent: E = null;
  public target: T = null;
  private propagation: boolean = false;

  constructor(options: Pick<DarkSyntheticEvent<E, T>, 'sourceEvent' | 'target'>) {
    this.type = options.sourceEvent.type;
    this.sourceEvent = options.sourceEvent;
    this.target = options.target;
  }

  public stopPropagation() {
    this.propagation = true;
    this.sourceEvent.stopPropagation();
  }

  public preventDefault() {
    this.sourceEvent.preventDefault();
  }

  public getPropagation() {
    return this.propagation;
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
    const rootHandler = (event: Event) => {
      const fireEvent =  eventsStore.get(eventName).get(event.target);

      if (isFunction(fireEvent)) {
        const syntheticEvent  = new DarkSyntheticEvent({
          sourceEvent: event,
          target: event.target,
        });
        const target = event.target as Element;

        fireEvent(syntheticEvent);

        if (!syntheticEvent.getPropagation() && target.parentElement) {
          const eventReplay = new (event as any).constructor(event.type, event);

          target.parentElement.dispatchEvent(eventReplay);
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
