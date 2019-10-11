import { getRegistery } from '@core/scope';


function delegateEvent(
  uid: number,
  rootDOMElement: HTMLElement,
  node: HTMLElement,
  eventName: string,
  handler: (e: Event) => void,
) {
  const app = getRegistery().get(uid);
  const eventHandler = (e: Event, idx: number) => {
    node === e.target && handler(e);
    !document.documentElement.contains(node) && app.eventHandlers.get(eventName).splice(idx, 1);
  };

  if (!app.eventHandlers.get(eventName)) {
    const mapHandlers = (e: Event) => app.eventHandlers.get(eventName).forEach((fn, idx) => fn(e, idx));

    app.eventHandlers.set(eventName, [eventHandler]);
    rootDOMElement.addEventListener(eventName, mapHandlers);
  } else {
    app.eventHandlers.get(eventName).push(eventHandler);
  }
}

export {
  delegateEvent, //
};
