import {
  type Fiber,
  type VirtualNode,
  type TagVirtualNode,
  type TextVirtualNode,
  type CommentVirtualNode,
  type MutableRef,
  ATTR_KEY,
  ATTR_REF,
  EffectTag,
  detectIsFunction,
  detectIsUndefined,
  NodeType,
  detectIsVirtualNode,
  detectIsTagVirtualNode,
  detectIsTextVirtualNode,
  detectIsRef,
  walkFiber,
} from '@dark-engine/core';
import { detectIsPortal, getPortalContainer } from '../portal';
import { delegateEvent, detectIsEvent, getEventName } from '../events';
import type { DOMElement, DOMFragment } from './types';

const attrBlackListMap = {
  [ATTR_KEY]: true,
  [ATTR_REF]: true,
};

let fragmentsMap: Map<Element, DOMFragment> = new Map();

function createElement(vNode: VirtualNode): DOMElement {
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

function createNativeElement(fiber: Fiber<Element>): DOMElement {
  if (!detectIsVirtualNode(fiber.instance)) {
    throw new Error('[Dark]: createNativeElement receives only virtual node!');
  }

  return createElement(fiber.instance);
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
    const prevAttrValue = vNode.attrs[attrName];
    const nextAttrValue = nextVNode.attrs[attrName];

    if (attrName === ATTR_REF) {
      applyRef(prevAttrValue as MutableRef, element);
      continue;
    }

    if (!detectIsUndefined(nextAttrValue)) {
      if (detectIsFunction(prevAttrValue)) {
        if (detectIsEvent(attrName) && prevAttrValue !== nextAttrValue) {
          delegateEvent({
            target: element,
            handler: nextAttrValue,
            eventName: getEventName(attrName),
          });
        }
      } else if (!attrBlackListMap[attrName] && prevAttrValue !== nextAttrValue) {
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

type UpgradeInputAttributesOptions = {
  tagName: string;
  element: Element;
  attrName: string;
  value: string | boolean;
};

function upgradeInputAttributes(options: UpgradeInputAttributesOptions) {
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

function getParentFiberWithNativeElement(fiber: Fiber<Element>): Fiber<Element> {
  let nextFiber = fiber;

  while (nextFiber) {
    nextFiber = nextFiber.parent;

    if (detectIsPortal(nextFiber.instance)) {
      nextFiber.nativeElement = getPortalContainer(nextFiber.instance);
    }

    if (nextFiber.nativeElement) return nextFiber;
  }

  return nextFiber;
}

function getNodeOnTheRight(fiber: Fiber<Element>, parentElement: Element) {
  let node: Element = null;

  walkFiber<Element>({
    fiber,
    onLoop: ({ nextFiber, stop, resetIsDeepWalking }) => {
      if (nextFiber.nativeElement && nextFiber.nativeElement.parentElement === parentElement) {
        node = nextFiber.nativeElement;

        return stop();
      }

      if (!nextFiber.mountedToHost) {
        return resetIsDeepWalking();
      }
    },
  });

  return node;
}

function getChildIndex(fiber: Fiber<Element>, parentNativeElement: Element) {
  let nextFiber = fiber;

  while (nextFiber) {
    if (nextFiber?.parent?.nativeElement === parentNativeElement) {
      return nextFiber.idx;
    }

    nextFiber = nextFiber.parent;
  }

  return -1;
}

function commitPlacement(fiber: Fiber<Element>, parentFiber: Fiber<Element>) {
  const parentNativeElement = parentFiber.nativeElement;
  const childNodes = parentNativeElement.childNodes;

  const append = () => {
    const { fragment } =
      fragmentsMap.get(parentNativeElement) ||
      ({
        fragment: document.createDocumentFragment(),
        callback: () => {},
      } as DOMFragment);

    fragmentsMap.set(parentNativeElement, {
      fragment,
      callback: () => {
        parentNativeElement.appendChild(fragment);
      },
    });
    fragment.appendChild(fiber.nativeElement);
    fiber.markMountedToHost();
  };

  const insert = () => {
    parentNativeElement.insertBefore(fiber.nativeElement, getNodeOnTheRight(fiber, parentNativeElement));
    fiber.markMountedToHost();
  };

  if (childNodes.length === 0 || getChildIndex(fiber, parentNativeElement) > childNodes.length - 1) {
    append();
  } else {
    insert();
  }

  addAttributes(fiber.nativeElement, fiber.instance as VirtualNode);
}

function commitUpdate(element: Element, instance: VirtualNode, nextInstance: VirtualNode) {
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

function commitDeletion(fiber: Fiber<Element>, parentFiber: Fiber<Element>) {
  walkFiber<Element>({
    fiber,
    onLoop: ({ nextFiber, isReturn, resetIsDeepWalking, stop }) => {
      if (nextFiber === fiber.nextSibling || nextFiber === fiber.parent) {
        return stop();
      }

      if (!isReturn && nextFiber.nativeElement) {
        !detectIsPortal(nextFiber.instance) && parentFiber.nativeElement.removeChild(nextFiber.nativeElement);

        return resetIsDeepWalking();
      }
    },
  });
}

function applyCommit(fiber: Fiber<Element>) {
  const parentFiber = getParentFiberWithNativeElement(fiber);

  if (fiber.nativeElement !== null && fiber.effectTag === EffectTag.PLACEMENT) {
    commitPlacement(fiber, parentFiber);
  } else if (fiber.nativeElement !== null && fiber.effectTag === EffectTag.UPDATE) {
    if (!detectIsVirtualNode(fiber.alternate.instance) || !detectIsVirtualNode(fiber.instance)) return;
    const vNode: VirtualNode = fiber.alternate.instance;
    const nextVNode: VirtualNode = fiber.instance;

    commitUpdate(fiber.nativeElement, vNode, nextVNode);
  } else if (fiber.effectTag === EffectTag.DELETION) {
    commitDeletion(fiber, parentFiber);
  }
}

function finishCommitWork() {
  for (const { callback } of fragmentsMap.values()) {
    callback();
  }

  fragmentsMap = new Map();
}

export { createNativeElement, applyCommit, finishCommitWork };
