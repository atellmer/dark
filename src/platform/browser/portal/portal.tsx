import { Fiber } from '@core/fiber';
import { DarkElement } from '@core/shared/model';
import {
  createComponent,
  detectIsComponentFactory,
  ComponentFactory,
} from '@core/component';
import { componentFiberHelper } from '@core/scope';
import { useEffect } from '@core/use-effect';
import { error } from '@helpers';
import { useMemo } from '@core';


type PortalListener = {
  nativeElement: Element;
  fibers: Array<Fiber<Element>>
};

const $$portal = Symbol('portal');
const listenersMap = new Map<Element, PortalListener>();

function createPortal(slot: DarkElement, container: Element) {
  if (!(container instanceof Element)) {
    if (process.env.NODE_ENV === 'development') {
      error(`[Dark]: createPortal receives only Element as container!`);
    }

    return null;
  }

  useMemo(() => container.innerHTML = '', []);

  return Portal({
    [$$portal]: container,
    slot,
  });
}

const Portal = createComponent(({ slot }) => {
  const fiber = componentFiberHelper.get() as Fiber<Element>;
  const nativeElement = getParentNativeElement(fiber.parent);

  useEffect(() => {
    if (!listenersMap.get(nativeElement)) {
      listenersMap.set(nativeElement, {
        nativeElement,
        fibers: [],
      });
    }
    listenersMap.get(nativeElement).fibers.push(fiber);
  }, [nativeElement]);

  return slot;
}, { token: $$portal });

const detectIsPortal = (factory: unknown): factory is ComponentFactory =>
  detectIsComponentFactory(factory) && factory.token === $$portal;
const getPortalContainer = (factory: unknown): Element => detectIsPortal(factory) ? factory.props[$$portal] : null;

function getParentNativeElement(fiber: Fiber<Element>) {
  let nextFiber = fiber;

  while (nextFiber) {
    if (nextFiber.nativeElement && !detectIsPortal(nextFiber.instance)) {
      return nextFiber.nativeElement;
    }

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

function runMutationObserver() {
  const observer = new MutationObserver(mutationsList => {
    const deletions: Array<Element> = [];

    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
        const listeners = listenersMap.values();
        const removedNativeElements = Array.from(mutation.removedNodes) as Array<Element>;

        for (const nativeElement of removedNativeElements) {
          for (const listener of listeners) {
            if (nativeElement.contains(listener.nativeElement)) {
              listener.fibers.forEach(x => removeNativeElements(x));
              deletions.push(listener.nativeElement);
            }
          }
        }
      }
    }

    for (const nativeElement of deletions) {
      listenersMap.delete(nativeElement);
    }
  });

  observer.observe(document, {
    childList: true,
    subtree: true,
  });
}

export {
  createPortal,
  detectIsPortal,
  getPortalContainer,
  runMutationObserver,
};
