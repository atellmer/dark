import { Fiber } from '@core/fiber';
import { DarkElement } from '@core/shared/model';
import { createComponent, detectIsComponentFactory } from '@core/component';
import { componentFiberHelper, currentRootHelper } from '@core/scope';
import { useEffect } from '@core/use-effect';
import { error } from '@helpers';
import { useMemo } from '@core';


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
        const removedNativeElements = Array.from(mutation.removedNodes) as Array<Element>;

        for (const nativeElement of removedNativeElements) {
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
  const fiber = componentFiberHelper.get() as Fiber<Element>;

  useEffect(() => {
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

  useMemo(() => container.innerHTML = '', []);

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
  const parentNativeElement = fiber.nativeElement;
  let nextFiber = fiber;
  let isDeepWalking = true;
  let isReturn = false;

  while (nextFiber) {
    if (!isReturn) {
      if (nextFiber.nativeElement && nextFiber.nativeElement.parentElement === parentNativeElement) {
        parentNativeElement.removeChild(nextFiber.nativeElement);
        isDeepWalking = false;
      }
    }

    if (nextFiber.child && isDeepWalking) {
      nextFiber = nextFiber.child;
      isReturn = false;
    } else if (nextFiber.nextSibling) {
      isDeepWalking = true;
      isReturn = false;
      nextFiber = nextFiber.nextSibling;
    } else if (nextFiber.parent && nextFiber.parent !== fiber && nextFiber.parent !== fiber.parent) {
      isDeepWalking = false;
      isReturn = true;
      nextFiber = nextFiber.parent;
    } else {
      nextFiber = null;
    }
  }
}

export {
  createPortal,
  detectIsPortal,
  getPortalContainer,
  runPortalMutationObserver,
};
