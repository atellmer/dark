import { getRegistery } from '@core/scope';


function delegateEvent(
  uid: number,
  root: HTMLElement,
  domElement: HTMLElement,
  eventName: string,
  handler: (e: Event) => void,
) {
  const app = getRegistery().get(uid);
  const eventStore = app.eventHandlers.get(eventName);

  if (!eventStore) {
    const rootEventHandler = (e: Event) => {
      const fireEvent = app.eventHandlers.get(eventName).get(e.target);
      typeof fireEvent === 'function' && fireEvent(e);
    };

    app.eventHandlers.set(eventName, new WeakMap([[domElement, handler]]));
    root.addEventListener(eventName, rootEventHandler);
  } else {
    eventStore.set(domElement, handler);
  }
}

export {
  delegateEvent, //
};
