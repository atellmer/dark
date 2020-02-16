import { getRegistery } from '@core/scope';


function delegateEvent(
  uid: number,
  root: HTMLElement,
  domElement: HTMLElement,
  eventName: string,
  handler: (e: Event) => void,
) {
  const app = getRegistery().get(uid);
  const eventStore = app.eventStore.get(eventName);

  if (!eventStore) {
    const rootHandler = (e: Event) => {
      const fireEvent = app.eventStore.get(eventName).get(e.target);
      typeof fireEvent === 'function' && fireEvent(e);
    };

    app.eventStore.set(eventName, new WeakMap([[domElement, handler]]));
    root.addEventListener(eventName, rootHandler, true);
  } else {
    eventStore.set(domElement, handler);
  }
}

export {
  delegateEvent, //
};
