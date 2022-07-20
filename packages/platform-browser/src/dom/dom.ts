import {
  type Fiber,
  type VirtualNode,
  type TagVirtualNode,
  type TextVirtualNode,
  type CommentVirtualNode,
  type MutableRef,
  EffectTag,
  detectIsFunction,
  detectIsUndefined,
  NodeType,
  detectIsVirtualNode,
  detectIsTagVirtualNode,
  detectIsTextVirtualNode,
  detectIsCommentVirtualNode,
  detectIsComponentFactory,
  runEffectCleanup,
  detectIsRef,
  ATTR_KEY,
  ATTR_REF,
  EMPTY_NODE,
  fromHookUpdateHelper,
} from '@dark-engine/core';
import { detectIsPortal, getPortalContainer } from '../portal';
import { delegateEvent, detectIsEvent, getEventName } from '../events';
import type { DomElement } from './model';

const attrBlackListMap = {
  [ATTR_KEY]: true,
  [ATTR_REF]: true,
};

function createElement(vNode: VirtualNode): DomElement {
  const map = {
    [NodeType.TAG]: (vNode: VirtualNode) => {
      const tagNode = vNode as TagVirtualNode;
      const node = detectIsSvgElement(tagNode.name)
        ? document.createElementNS('http://www.w3.org/2000/svg', tagNode.name)
        : document.createElement(tagNode.name);

      return node;
    },
    [NodeType.TEXT]: (vNode: VirtualNode) => {
      const textNode = vNode as TextVirtualNode;
      const node = document.createTextNode(textNode.value);

      return node;
    },
    [NodeType.COMMENT]: (vNode: VirtualNode) => {
      const commentNode = vNode as CommentVirtualNode;
      const node = document.createComment(commentNode.value);

      return node;
    },
  };

  return map[vNode.type](vNode);
}

function createDomElement(fiber: Fiber<Element>): DomElement {
  if (!detectIsVirtualNode(fiber.instance)) {
    throw new Error('createDomElement receives only Element into fiber!');
  }

  const vNode: VirtualNode = fiber.instance;

  return createElement(vNode);
}

function applyRef(ref: MutableRef, element: Element) {
  if (detectIsRef(ref)) {
    ref.current = element;
  }
}

function addAttributes(element: Element, vNode: VirtualNode) {
  if (!detectIsTagVirtualNode(vNode)) return;
  const attrNames = Object.keys(vNode.attrs);

  for (const attrName of attrNames) {
    const attrValue = vNode.attrs[attrName];

    if (attrName === ATTR_REF) {
      applyRef(attrValue as MutableRef, element);
      continue;
    }

    if (detectIsFunction(attrValue)) {
      if (detectIsEvent(attrName)) {
        delegateEvent({
          target: element,
          handler: attrValue,
          eventName: getEventName(attrName),
        });
      }
    } else if (!detectIsUndefined(attrValue) && !attrBlackListMap[attrName]) {
      upgradeInputAttributes({
        tagName: vNode.name,
        value: attrValue,
        attrName,
        element,
      });

      element.setAttribute(attrName, attrValue);
    }
  }
}

function updateAttributes(element: Element, vNode: TagVirtualNode, nextVNode: TagVirtualNode) {
  const attrNames = new Set([...Object.keys(vNode.attrs), ...Object.keys(nextVNode.attrs)]);

  for (const attrName of attrNames) {
    const attrValue = vNode.attrs[attrName];
    const nextAttrValue = nextVNode.attrs[attrName];

    if (attrName === ATTR_REF) {
      applyRef(attrValue as MutableRef, element);
      continue;
    }

    if (!detectIsUndefined(nextAttrValue)) {
      if (detectIsFunction(attrValue)) {
        if (detectIsEvent(attrName) && attrValue !== nextAttrValue) {
          delegateEvent({
            target: element,
            handler: nextAttrValue,
            eventName: getEventName(attrName),
          });
        }
      } else if (!attrBlackListMap[attrName] && attrValue !== nextAttrValue) {
        upgradeInputAttributes({
          tagName: nextVNode.name,
          value: nextAttrValue,
          attrName,
          element,
        });

        element.setAttribute(attrName, nextAttrValue);
      }
    } else {
      element.removeAttribute(attrName);
    }
  }
}

type UpdareInputAttributesOptions = {
  tagName: string;
  element: Element;
  attrName: string;
  value: string | boolean;
};

function upgradeInputAttributes(options: UpdareInputAttributesOptions) {
  const { tagName, element, attrName, value } = options;
  const map = {
    input: () => {
      const attrsMap = {
        value: true,
        checked: true,
      };

      if (attrsMap[attrName]) {
        element[attrName] = value;
      }
    },
    option: () => {
      const attrsMap = {
        selected: true,
      };

      if (attrsMap[attrName]) {
        element[attrName] = value;
      }
    },
  };

  map[tagName] && map[tagName]();
}

function updateDom(element: Element, instance: VirtualNode, nextInstance: VirtualNode) {
  if (
    detectIsTextVirtualNode(instance) &&
    detectIsTextVirtualNode(nextInstance) &&
    instance.value !== nextInstance.value
  ) {
    return (element.textContent = nextInstance.value);
  }

  if (detectIsTagVirtualNode(instance) && detectIsTagVirtualNode(nextInstance)) {
    return updateAttributes(element, instance, nextInstance);
  }
}

const fragmentMap: Map<Element, DocumentFragment> = new Map();
let nodeCacheMap: Map<Element, Element> = new Map();

function resetNodeCache() {
  nodeCacheMap = new Map();
}

function mutateDom(fiber: Fiber<Element>) {
  const fromHookUpdate = fromHookUpdateHelper.get();
  const nextFiber = getFiberWithNativeElement(fiber);
  const parentNativeElement = nextFiber.nativeElement;

  if (fiber.nativeElement !== null && fiber.effectTag === EffectTag.PLACEMENT) {
    const cachedNode = nodeCacheMap.get(parentNativeElement);
    const node = nextFiber.alternate
      ? !detectIsUndefined(cachedNode) && canTakeNodeFromCache(fiber, nextFiber)
        ? cachedNode
        : cachedNode === null
        ? null
        : getNodeOnTheRight(fiber, parentNativeElement)
      : fromHookUpdate
      ? getNodeOnTheRight(fiber, parentNativeElement)
      : null;

    nodeCacheMap.set(parentNativeElement, node);

    if (node) {
      parentNativeElement.insertBefore(fiber.nativeElement, node);
      fiber.mountedToHost = true;
      if (isEndOfInsertion(fiber, nextFiber)) {
        nodeCacheMap.delete(parentNativeElement);
      }
    } else {
      let fragment = fragmentMap.get(parentNativeElement);

      if (detectIsUndefined(fragment)) {
        fragment = document.createDocumentFragment();
        fragmentMap.set(parentNativeElement, fragment);
      }

      fragment.appendChild(fiber.nativeElement);
      fiber.mountedToHost = true;

      if (!hasNextSibling(fiber, nextFiber)) {
        parentNativeElement.appendChild(fragment);
        fragmentMap.delete(parentNativeElement);
        nodeCacheMap.delete(parentNativeElement);
      }
    }

    addAttributes(fiber.nativeElement, fiber.instance as VirtualNode);
  } else if (fiber.nativeElement !== null && fiber.effectTag === EffectTag.UPDATE) {
    if (!detectIsVirtualNode(fiber.alternate.instance) || !detectIsVirtualNode(fiber.instance)) return;
    const vNode: VirtualNode = fiber.alternate.instance;
    const nextVNode: VirtualNode = fiber.instance;

    updateDom(fiber.nativeElement, vNode, nextVNode);
  } else if (fiber.effectTag === EffectTag.DELETION) {
    commitDeletion(fiber, parentNativeElement);
  }
}

function hasNextSibling(fiber: Fiber, rootFilber: Fiber) {
  let nextFiber = fiber;

  if (nextFiber.nextSibling && detectIsPortal(nextFiber.nextSibling.instance)) {
    return false;
  }

  while (!nextFiber.nextSibling) {
    nextFiber = nextFiber.parent;

    if (nextFiber === rootFilber || nextFiber.nativeElement) {
      return false;
    }
  }

  return true;
}

function getFiberWithNativeElement(fiber: Fiber<Element>): Fiber<Element> {
  let nextFiber = fiber.parent;

  if (detectIsPortal(fiber.instance)) return fiber;

  while (nextFiber && !nextFiber.nativeElement) {
    if (detectIsPortal(nextFiber.instance)) {
      nextFiber.nativeElement = getPortalContainer(nextFiber.instance);
    } else {
      nextFiber = nextFiber.parent;
    }
  }

  return nextFiber;
}

function canTakeNodeFromCache(fiber: Fiber, parentFiber: Fiber) {
  let nextFiber = fiber;

  while (nextFiber) {
    if (nextFiber.alternate) {
      const alternate = nextFiber.alternate;
      const isEmptyNode = detectIsCommentVirtualNode(alternate.instance) && alternate.instance.value === EMPTY_NODE;

      return isEmptyNode;
    }

    nextFiber = nextFiber.parent;
    if (nextFiber === parentFiber) return false;
  }

  return false;
}

function isEndOfInsertion(fiber: Fiber, parentFiber: Fiber) {
  let nextFiber = fiber;

  do {
    if (!nextFiber) return false;
    nextFiber = nextFiber.nextSibling || nextFiber.parent.nextSibling;
    if (nextFiber && nextFiber.parent === parentFiber) break;
  } while (!nextFiber);

  if (nextFiber.effectTag === EffectTag.UPDATE) {
    return true;
  }

  return false;
}

function getNodeOnTheRight(fiber: Fiber<Element>, parentElement: Element) {
  let nextFiber = fiber;
  let isDeepWalking = true;

  while (nextFiber) {
    if (nextFiber.nativeElement && nextFiber.nativeElement.parentElement === parentElement) {
      return nextFiber.nativeElement;
    }

    if (nextFiber.nativeElement && !nextFiber.mountedToHost) {
      isDeepWalking = false;
    }

    if (nextFiber.child && isDeepWalking) {
      nextFiber = nextFiber.child;
    } else if (nextFiber.nextSibling) {
      isDeepWalking = true;
      nextFiber = nextFiber.nextSibling;
    } else if (nextFiber.parent && nextFiber.parent.nativeElement !== parentElement) {
      isDeepWalking = false;
      nextFiber = nextFiber.parent;
    } else {
      nextFiber = null;
    }
  }

  return null;
}

function commitDeletion(fiber: Fiber<Element>, parentElement: Element) {
  let nextFiber = fiber;
  let isDeepWalking = true;
  let isReturn = false;

  while (nextFiber) {
    if (!isReturn) {
      if (nextFiber.nativeElement) {
        const isPortal = detectIsPortal(nextFiber.instance);

        !isPortal && parentElement.removeChild(nextFiber.nativeElement);
        isDeepWalking = false;
      }

      if (!fiber.transposition && detectIsComponentFactory(nextFiber.instance)) {
        runEffectCleanup(nextFiber.hook);
      }
    }

    if (nextFiber.child && isDeepWalking) {
      nextFiber = nextFiber.child;
      isReturn = false;
    } else if (nextFiber.nextSibling && nextFiber.nextSibling !== fiber.nextSibling) {
      if (nextFiber.nextSibling.effectTag === EffectTag.DELETION) return;
      isDeepWalking = true;
      isReturn = false;
      nextFiber = nextFiber.nextSibling;
    } else if (
      nextFiber.parent &&
      nextFiber !== fiber &&
      nextFiber.parent !== fiber &&
      nextFiber.parent !== fiber.parent
    ) {
      isDeepWalking = false;
      isReturn = true;
      nextFiber = nextFiber.parent;
    } else {
      nextFiber = null;
    }
  }
}

function detectIsSvgElement(tagName) {
  const tagMap = {
    svg: true,
    circle: true,
    ellipse: true,
    g: true,
    text: true,
    tspan: true,
    textPath: true,
    path: true,
    polygon: true,
    polyline: true,
    line: true,
    rect: true,
    use: true,
    image: true,
    symbol: true,
    defs: true,
    linearGradient: true,
    radialGradient: true,
    stop: true,
    clipPath: true,
    pattern: true,
    mask: true,
    marker: true,
  };

  return Boolean(tagMap[tagName]);
}

export { createDomElement, mutateDom, resetNodeCache };
