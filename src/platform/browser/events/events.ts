import { getRegistery } from '@core/scope';
import { getAttribute, VirtualNode } from '@core/vdom';
import { isFunction } from '../../../helpers';
import { getDOMElementByRoute } from '../dom/dom';

function makeEvents(vNode: VirtualNode, uid: number) {
  const app = getRegistery().get(uid);
  const rootDOMElement = app.nativeElement;

  if (vNode.type === 'TAG') {
    const filterNodeFn = (vNode: VirtualNode) => vNode.type === 'TAG';
    const getKey = (key: any) => key;
    const attrNames = Object.keys(vNode.attrs).map(getKey) || [];
    const chidren = vNode.children.filter(filterNodeFn);
    const mapAttrsFn = (attrName: string) => {
      if (/^on/.test(attrName) && isFunction(getAttribute(vNode, attrName))) {
        const node = getDOMElementByRoute(rootDOMElement, [...vNode.route]);
        const eventName = attrName.slice(2, attrName.length).toLowerCase();
        const handler = getAttribute(vNode, attrName);

        delegateEvent(rootDOMElement, uid, node, eventName, handler);
      }
    };
    const mapNodesFn = (vNode: VirtualNode) => makeEvents(vNode, uid);

    attrNames.forEach(mapAttrsFn);
    chidren.forEach(mapNodesFn);
  }
}

function delegateEvent(
  rootDOMElement: HTMLElement,
  uid: number,
  node: HTMLElement,
  eventName: string,
  handler: (e: Event) => void,
) {
  const app = getRegistery().get(uid);
  const eventHandler = (e: Event) => node === e.target && handler(e);

  if (!app.eventHandlers.get(node)) {
    app.eventHandlers.set(node, {});
  }

  if (!app.eventHandlers.get(node)[eventName]) {
    app.eventHandlers.get(node)[eventName] = {
      addEvent: null,
      removeEvent: null,
    };
  }

  isFunction(app.eventHandlers.get(node)[eventName].removeEvent) &&
    app.eventHandlers.get(node)[eventName].removeEvent();

  app.eventHandlers.get(node)[eventName] = {
    addEvent: () => rootDOMElement.addEventListener(eventName, eventHandler),
    removeEvent: () => rootDOMElement.removeEventListener(eventName, eventHandler),
  };

  app.eventHandlers.get(node)[eventName].addEvent();
}

export {
  makeEvents, //
  delegateEvent,
};
