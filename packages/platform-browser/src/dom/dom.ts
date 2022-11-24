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
  void: true,
};

let fragmentsMap: Map<Element, DOMFragment> = new Map();

let trackUpdate: (nativeElement: Element) => void = null;

function createNativeElement(vNode: VirtualNode): DOMElement {
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

function detectIsSvgElement(tagName: string) {
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
      const stopAttrsMap = upgradeInputAttributes({
        tagName: vNode.name,
        value: attrValue,
        attrName,
        element,
      });

      !stopAttrsMap[attrName] && element.setAttribute(attrName, attrValue);
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
        const stopAttrsMap = upgradeInputAttributes({
          tagName: nextVNode.name,
          value: nextAttrValue,
          attrName,
          element,
        });
        !stopAttrsMap[attrName] && element.setAttribute(attrName, nextAttrValue);
      }
    } else {
      element.removeAttribute(attrName);
    }
  }
}

const INPUT_STOP_ATTRS_MAP = {
  value: true,
  checked: true,
};

const TEXTAREA_STOP_ATTRS_MAP = {
  value: true,
};

const OPTIONS_STOP_ATTRS_MAP = {
  selected: true,
};

const DEFAULT_STOP_ATTRS_MAP = {};

type PatchedElements = 'input' | 'textarea' | 'option';

type UpgradeInputAttributesOptions = {
  tagName: string;
  element: Element;
  attrName: string;
  value: string | boolean;
};

function upgradeInputAttributes(options: UpgradeInputAttributesOptions): Record<string, boolean> {
  const { tagName, element, attrName, value } = options;
  const map: Record<PatchedElements, () => Record<string, boolean>> = {
    input: () => {
      if (INPUT_STOP_ATTRS_MAP[attrName]) {
        element[attrName] = value;
      }

      return INPUT_STOP_ATTRS_MAP;
    },
    textarea: () => {
      if (TEXTAREA_STOP_ATTRS_MAP[attrName]) {
        element[attrName] = value;
      }

      return TEXTAREA_STOP_ATTRS_MAP;
    },
    option: () => {
      if (OPTIONS_STOP_ATTRS_MAP[attrName]) {
        element[attrName] = value;
      }

      return OPTIONS_STOP_ATTRS_MAP;
    },
  };

  return map[tagName] ? map[tagName]() : DEFAULT_STOP_ATTRS_MAP;
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

function commitCreation(fiber: Fiber<Element>) {
  const parentFiber = getParentFiberWithNativeElement(fiber);
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

function commitUpdate(nativeElement: Element, instance: VirtualNode, nextInstance: VirtualNode) {
  if (
    detectIsTextVirtualNode(instance) &&
    detectIsTextVirtualNode(nextInstance) &&
    instance.value !== nextInstance.value
  ) {
    return (nativeElement.textContent = nextInstance.value);
  }

  if (detectIsTagVirtualNode(instance) && detectIsTagVirtualNode(nextInstance)) {
    return updateAttributes(nativeElement, instance, nextInstance);
  }
}

function commitDeletion(fiber: Fiber<Element>) {
  const parentFiber = getParentFiberWithNativeElement(fiber);

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
  const map: Record<EffectTag, () => void> = {
    [EffectTag.CREATE]: () => {
      if (fiber.nativeElement === null) return;
      trackUpdate && trackUpdate(fiber.nativeElement);
      commitCreation(fiber);
    },
    [EffectTag.UPDATE]: () => {
      if (
        fiber.nativeElement === null ||
        !detectIsVirtualNode(fiber.alternate.instance) ||
        !detectIsVirtualNode(fiber.instance)
      ) {
        return;
      }
      trackUpdate && trackUpdate(fiber.nativeElement);
      commitUpdate(fiber.nativeElement, fiber.alternate.instance, fiber.instance);
    },
    [EffectTag.DELETE]: () => commitDeletion(fiber),
    [EffectTag.SKIP]: () => {},
  };

  map[fiber.effectTag]();
}

function finishCommitWork() {
  for (const { callback } of fragmentsMap.values()) {
    callback();
  }

  fragmentsMap = new Map();
}

function setTrackUpdate(fn: typeof trackUpdate) {
  trackUpdate = fn;
}

export { createNativeElement, applyCommit, finishCommitWork, setTrackUpdate };
