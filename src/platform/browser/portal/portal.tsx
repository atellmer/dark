import { Fiber } from '@core/fiber';
import { DarkElement } from '@core/shared/model';
import { createComponent, detectIsComponentFactory } from '@core/component';
import { componentFiberHelper, currentRootHelper } from '@core/scope';
import { useEffect } from '@core/use-effect';
import { error } from '@helpers';


type PortalListener = {
  fn: () => void;
  link: Element;
};

const $$portal = Symbol('portal');
const portalListenersMap = new Map<Element, Map<Element, PortalListener>>();

function runPortalMutationObserver(rootLink: Element) {
  const listenerMap = new Map();
  const observer = new MutationObserver(mutationsList => {
    const removedListenersMap = new Map();

    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
        const removedLinks = Array.from(mutation.removedNodes) as Array<Element>;

        for (const link of removedLinks) {
          for (const listener of listenerMap.values()) {
            if (link.contains(listener.link)) {
              listener.fn();
              removedListenersMap.set(listener.link, true);
            }
          }
        }
      }
    }

    for (const key of removedListenersMap.keys()) {
      listenerMap.delete(key);
    }
  });

  portalListenersMap.set(rootLink, listenerMap);
  observer.observe(rootLink, {
    childList: true,
    subtree: true,
  });
}

const Portal = createComponent(({ slot }) => {

  useEffect(() => {
    const fiber = componentFiberHelper.get() as Fiber<Element>;
    const rootElement = currentRootHelper.get().link as Element;
    const listenerMap = portalListenersMap.get(rootElement);
    const parentLink = getParentLink(fiber.parent);

    if (!listenerMap.get(parentLink)) {
      listenerMap.set(parentLink, {
        link: parentLink,
        fn: () => removeLinks(fiber),
      });
    }
  }, []);

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

function getParentLink(fiber: Fiber<Element>) {
  let nextFiber = fiber;

  while (nextFiber) {
    if (nextFiber.link) return nextFiber.link;
    nextFiber = nextFiber.parent;
  }

  return null;
}

function removeLinks(fiber: Fiber<Element>) {
  const parentLink = fiber.link;
  let nextFiber = fiber;
  let isDeepWalking = true;

  while (nextFiber) {
    if (nextFiber.link && nextFiber.link.parentElement === parentLink) {
      parentLink.removeChild(nextFiber.link);

      if (nextFiber.nextSibling) {
        isDeepWalking = true;
        nextFiber = nextFiber.nextSibling;
      } else if (nextFiber.parent) {
        isDeepWalking = false;
        nextFiber = nextFiber.parent;
      }

      continue;
    }

    if (nextFiber.child && isDeepWalking) {
      nextFiber = nextFiber.child;
    } else if (nextFiber.nextSibling) {
      isDeepWalking = true;
      nextFiber = nextFiber.nextSibling;
    } else if (nextFiber.parent) {
      isDeepWalking = false;
      nextFiber = nextFiber.parent;
    }

    if (nextFiber === fiber) return;
  }
}

export {
  createPortal,
  detectIsPortal,
  getPortalContainer,
  runPortalMutationObserver,
};
