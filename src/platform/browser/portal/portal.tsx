import { Fiber } from '@core/fiber';
import { DarkElement } from '@core/shared/model';
import { createComponent, detectIsComponentFactory } from '@core/component';
import { componentFiberHelper, currentRootHelper } from '@core/scope';
import { useEffect } from '@core/use-effect';
import { error } from '@helpers';


type PortalListener = {
  fn: () => void;
  nativeElement: Element;
};

const $$portal = Symbol('portal');
const portalListenersMap = new Map<Element, Map<Element, PortalListener>>();

function runPortalMutationObserver(rootNativeElement: Element) {
  const listenerMap = new Map();
  const observer = new MutationObserver(mutationsList => {
    const removedListenersMap = new Map();

    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
        const removednativeElements = Array.from(mutation.removedNodes) as Array<Element>;

        for (const nativeElement of removednativeElements) {
          for (const listener of listenerMap.values()) {
            if (nativeElement.contains(listener.nativeElement)) {
              listener.fn();
              removedListenersMap.set(listener.nativeElement, true);
            }
          }
        }
      }
    }

    for (const key of removedListenersMap.keys()) {
      listenerMap.delete(key);
    }
  });

  portalListenersMap.set(rootNativeElement, listenerMap);
  observer.observe(rootNativeElement, {
    childList: true,
    subtree: true,
  });
}

const Portal = createComponent(({ slot }) => {

  useEffect(() => {
    const fiber = componentFiberHelper.get() as Fiber<Element>;
    const rootElement = currentRootHelper.get().nativeElement as Element;
    const listenerMap = portalListenersMap.get(rootElement);
    const parentNativeElement = getParentNativeElement(fiber.parent);

    if (!listenerMap.get(parentNativeElement)) {
      listenerMap.set(parentNativeElement, {
        nativeElement: parentNativeElement,
        fn: () => removeNativeElements(fiber),
      });
    }
  }, []);

  return slot;
}, { token: $$portal });

function createPortal(slot: DarkElement, container: Element) {

  if (!(container instanceof Element)) {
    if (process.env.NODE_ENV === 'development') {
      error(`[Dark]: createPortal receives only Element as container!`);
    }

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

function getParentNativeElement(fiber: Fiber<Element>) {
  let nextFiber = fiber;

  while (nextFiber) {
    if (nextFiber.nativeElement) return nextFiber.nativeElement;
    nextFiber = nextFiber.parent;
  }

  return null;
}

function removeNativeElements(fiber: Fiber<Element>) {
  const parentnativeElement = fiber.nativeElement;
  let nextFiber = fiber;
  let isDeepWalking = true;

  while (nextFiber) {
    if (nextFiber.nativeElement && nextFiber.nativeElement.parentElement === parentnativeElement) {
      parentnativeElement.removeChild(nextFiber.nativeElement);

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
