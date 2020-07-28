import { isFunction, error } from '@helpers';
import { eventsHelper } from '@core/scope';


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

      try {
        isFunction(fireEvent) && fireEvent(e);
      } catch (err) {
        error(err);
      }
    };

    eventsStore.set(eventName, new WeakMap([[target, handler]]));
    document.addEventListener(eventName, rootHandler);
  } else {
    handlerMap.set(target, handler);
  }
}

const detectIsEvent = (attrName: string) => attrName.startsWith('on');

const getEventName = (attrName: string) => attrName.slice(2, attrName.length).toLowerCase();

export {
  delegateEvent,
  detectIsEvent,
  getEventName,
};
