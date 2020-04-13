import { isFunction } from '@helpers';
import { eventsHelper } from '@core/scope';


type DelegateEventOptions = {
  root: Element,
  target: Element,
  eventName: string,
  handler: (e: Event) => void,
};

function delegateEvent(options: DelegateEventOptions) {
  const {
    root,
    target,
    eventName,
    handler,
  } = options;
  const eventsStore = eventsHelper.get();
  const handlerMap = eventsStore.get(eventName);

  if (!handlerMap) {
    const rootHandler = (e: Event) => {
      const fireEvent =  eventsStore.get(eventName).get(e.target);
      isFunction(fireEvent) && fireEvent(e);
    };

    eventsStore.set(eventName, new WeakMap([[target, handler]]));
    root.addEventListener(eventName, rootHandler);
  } else {
    handlerMap.set(target, handler);
  }
}

const detectIsEvent = (attr: string): boolean => attr.startsWith('on');

export {
  delegateEvent,
  detectIsEvent,
};
