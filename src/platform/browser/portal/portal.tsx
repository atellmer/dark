import { createComponent, detectIsComponentFactory } from '@core/component';
import { DarkElement } from '@core/shared/model';
import { error } from '@helpers';
import { componentFiberHelper } from '@core/scope';
import { Fiber } from '@core/fiber';
import { useMemo } from '@core/use-memo';


const $$portal = Symbol('portal');

let isObserved = false;
let listeners = [];

const observer = new MutationObserver(mutationsList => {
  const removedListenersMap = new Map();

  for (const mutation of mutationsList) {
    if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
      const removedLinks = Array.from(mutation.removedNodes) as Array<Element>;

      for (const link of removedLinks) {
        for (const listener of listeners) {
          if (link.contains(listener.link)) {
            listener.fn();
            removedListenersMap.set(listener, true);
          }
        }
      }
    }
  }

  setImmediate(() => {
    listeners = listeners.filter(x => !removedListenersMap.get(x));
  });
});

const Portal = createComponent(({ slot }) => {
  const scope = useMemo(() => ({ isObserved: false }), []);
  const fiber = componentFiberHelper.get() as Fiber<Element>;

  if (!isObserved) {
    setImmediate(() => {
      const rootLink = getRootLink(fiber);

      observer.observe(rootLink, {
        childList: true,
        subtree: true,
      });

      isObserved = true;
    });
  }

  if (!scope.isObserved) {
    setImmediate(() => {
      const parentLink = getParentLink(fiber.parent);

      listeners.push({
        link: parentLink,
        fn: () => getPortalContainer(fiber.instance).innerHTML = '',
      });

      scope.isObserved = true;
    });
  }

  return slot;
}, { token: $$portal });

function createPortal(slot: DarkElement, container: Element) {

  if (!(container instanceof Element)) {
    error(`[Dark]: createPortal receives only Element as container!`);
    return null;
  }

  if (!container[$$portal]) {
    container.innerHTML = '';
    container[$$portal] = true;
  }

  return Portal({ [$$portal]: container, slot });
}

const detectIsPortal = (factory: any): boolean => detectIsComponentFactory(factory) && factory.token === $$portal;
const getPortalContainer = (factory: any): Element => detectIsPortal(factory) ? factory.props[$$portal] : null;

function getRootLink(fiber: Fiber<Element>) {
  let nextFiber = fiber;

  while (nextFiber.parent) {
    nextFiber = nextFiber.parent;
  }

  return nextFiber.link;
}

function getParentLink(fiber: Fiber<Element>) {
  let nextFiber = fiber;

  while (nextFiber) {
    if (nextFiber.link) return nextFiber.link;
    nextFiber = nextFiber.parent;
  }

  return null;
}

export {
  createPortal,
  detectIsPortal,
  getPortalContainer,
};
