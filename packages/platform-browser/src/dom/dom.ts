import {
  type Fiber,
  type VirtualNode,
  type TagVirtualNode,
  type TextVirtualNode,
  type CommentVirtualNode,
  type Ref,
  ATTR_KEY,
  ATTR_REF,
  EffectTag,
  detectIsFunction,
  detectIsUndefined,
  detectIsBoolean,
  keyBy,
  NodeType,
  detectIsVirtualNode,
  detectIsTagVirtualNode,
  detectIsTextVirtualNode,
  detectIsMutableRef,
  walkFiber,
} from '@dark-engine/core';
import { detectIsPortal, getPortalContainer } from '../portal';
import { delegateEvent, detectIsEvent, getEventName } from '../events';
import type { DOMElement, DOMFragment, AttributeValue } from './types';
import { SVG_TAG_NAMES, VOID_TAG_NAMES } from '../constants';

const attrBlackListMap = {
  [ATTR_KEY]: true,
  [ATTR_REF]: true,
  void: true,
};
let fragmentsMap: Map<Element, DOMFragment> = new Map();
let trackUpdate: (nativeElement: Element) => void = null;
const svgTagNamesMap = keyBy(SVG_TAG_NAMES.split(','), x => x);
const voidTagNamesMap = keyBy(VOID_TAG_NAMES.split(','), x => x);

const createNativeElementMap = {
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

function createNativeElement(vNode: VirtualNode): DOMElement {
  return createNativeElementMap[vNode.type](vNode);
}

function detectIsSvgElement(tagName: string) {
  return Boolean(svgTagNamesMap[tagName]);
}

function detectIsVoidElement(tagName: string) {
  return Boolean(voidTagNamesMap[tagName]);
}

function applyRef(ref: Ref<Element>, element: Element) {
  if (detectIsFunction(ref)) {
    ref(element);
  } else if (detectIsMutableRef(ref)) {
    ref.current = element;
  }
}

function addAttributes(element: Element, vNode: VirtualNode) {
  if (!detectIsTagVirtualNode(vNode)) return;
  const attrNames = Object.keys(vNode.attrs);

  for (const attrName of attrNames) {
    const attrValue = vNode.attrs[attrName];

    if (attrName === ATTR_REF) {
      applyRef(attrValue, element);
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
      const stop = patchProperties({
        tagName: vNode.name,
        attrValue,
        attrName,
        element,
      });

      !stop && element.setAttribute(attrName, attrValue);
    }
  }
}

function updateAttributes(element: Element, vNode: TagVirtualNode, nextVNode: TagVirtualNode) {
  const attrNames = new Set([...Object.keys(vNode.attrs), ...Object.keys(nextVNode.attrs)]);

  for (const attrName of attrNames) {
    const prevAttrValue = vNode.attrs[attrName];
    const nextAttrValue = nextVNode.attrs[attrName];

    if (attrName === ATTR_REF) {
      applyRef(prevAttrValue, element);
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
        const stop = patchProperties({
          tagName: nextVNode.name,
          attrValue: nextAttrValue,
          attrName,
          element,
        });

        !stop && element.setAttribute(attrName, nextAttrValue);
      }
    } else {
      element.removeAttribute(attrName);
    }
  }
}

type PatchPropertiesOptions = {
  tagName: string;
  element: Element;
  attrName: string;
  attrValue: AttributeValue;
};

function patchProperties(options: PatchPropertiesOptions): boolean {
  const { tagName, element, attrName, attrValue } = options;
  const fn = patchPropertiesSpecialCasesMap[tagName];
  let stop = fn ? fn(element, attrName, attrValue) : false;
  const hasIDL =
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement ||
    element instanceof HTMLOptionElement;

  if (hasIDL && Object.getPrototypeOf(element).hasOwnProperty(attrName)) {
    element[attrName] = attrValue;
  }

  if (!stop && detectIsBoolean(attrValue)) {
    // blocking the setting of all boolean attributes, except for data attributes or other custom attributes
    stop = !attrName.includes('-');
  }

  return stop;
}

const patchPropertiesSpecialCasesMap: Record<
  string,
  (element: Element, attrName: string, attrValue: AttributeValue) => boolean
> = {
  input: (element: HTMLInputElement, attrName: string, attrValue: AttributeValue) => {
    if (attrName === 'value' && detectIsBoolean(attrValue)) {
      // checkbox case
      element.checked = attrValue;
    } else if (attrName === 'autoFocus') {
      // autofocus case
      element.autofocus = Boolean(attrValue);
    }

    return false;
  },
  textarea: (element: HTMLTextAreaElement, attrName: string, attrValue: AttributeValue) => {
    if (attrName === 'value') {
      // redirect value to innerHTML
      element.innerHTML = String(attrValue);

      return true;
    }

    return false;
  },
};

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

  walkFiber<Element>(fiber, ({ nextFiber, stop, resetIsDeepWalking }) => {
    if (nextFiber.nativeElement && nextFiber.nativeElement.parentElement === parentElement) {
      node = nextFiber.nativeElement;

      return stop();
    }

    if (!nextFiber.mountedToHost) {
      return resetIsDeepWalking();
    }
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

const append = (fiber: Fiber<Element>, parentNativeElement: Element) => {
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

const insert = (fiber: Fiber<Element>, parentNativeElement: Element) => {
  parentNativeElement.insertBefore(fiber.nativeElement, getNodeOnTheRight(fiber, parentNativeElement));
  fiber.markMountedToHost();
};

function commitCreation(fiber: Fiber<Element>) {
  const parentFiber = getParentFiberWithNativeElement(fiber);
  const parentNativeElement = parentFiber.nativeElement;
  const childNodes = parentNativeElement.childNodes;

  if (childNodes.length === 0 || getChildIndex(fiber, parentNativeElement) > childNodes.length - 1) {
    const vNode = parentFiber.instance as TagVirtualNode;

    !detectIsVoidElement(vNode.name) && append(fiber, parentNativeElement);
  } else {
    insert(fiber, parentNativeElement);
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

  walkFiber<Element>(fiber, ({ nextFiber, isReturn, resetIsDeepWalking, stop }) => {
    if (nextFiber === fiber.nextSibling || nextFiber === fiber.parent) {
      return stop();
    }

    if (!isReturn && nextFiber.nativeElement) {
      !detectIsPortal(nextFiber.instance) && parentFiber.nativeElement.removeChild(nextFiber.nativeElement);

      return resetIsDeepWalking();
    }
  });
}

const applyCommitMap: Record<EffectTag, (fiber: Fiber<Element>) => void> = {
  [EffectTag.CREATE]: (fiber: Fiber<Element>) => {
    if (fiber.nativeElement === null) return;
    trackUpdate && trackUpdate(fiber.nativeElement);
    commitCreation(fiber);
  },
  [EffectTag.UPDATE]: (fiber: Fiber<Element>) => {
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
  [EffectTag.DELETE]: (fiber: Fiber<Element>) => commitDeletion(fiber),
  [EffectTag.SKIP]: () => {},
};

function applyCommit(fiber: Fiber<Element>) {
  applyCommitMap[fiber.effectTag](fiber);
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
