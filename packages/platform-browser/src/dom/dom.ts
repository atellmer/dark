import {
  type Fiber,
  type VirtualNode,
  type TagVirtualNode,
  type TextVirtualNode,
  type CommentVirtualNode,
  type Ref,
  ATTR_KEY,
  ATTR_REF,
  ATTR_FLAG,
  EffectTag,
  detectIsFunction,
  detectIsUndefined,
  detectIsBoolean,
  keyBy,
  NodeType,
  detectIsTagVirtualNode,
  detectIsTextVirtualNode,
  walkFiber,
  isHydrateZone,
  applyRef as applyRef$,
} from '@dark-engine/core';

import { detectIsPortal, getPortalContainer } from '../portal';
import { delegateEvent, detectIsEvent, getEventName } from '../events';
import { SVG_TAG_NAMES, VOID_TAG_NAMES } from '../constants';
import type {
  NativeElement,
  TagNativeElement,
  TextNativeElement,
  CommentNativeElement,
  AttributeValue,
} from '../native-element';

type DOMFragment = {
  fragment: DocumentFragment;
  callback: () => void;
};

const attrBlackListMap = {
  [ATTR_KEY]: true,
  [ATTR_REF]: true,
  [ATTR_FLAG]: true,
};
const patchPropsBlackListMap = {
  transform: true,
  fill: true,
};

let fragmentsMap: Map<NativeElement, DOMFragment> = new Map();
let moves: Array<() => void> = [];
let trackUpdate: (nativeElement: NativeElement) => void = null;
const svgTagNamesMap = keyBy(SVG_TAG_NAMES.split(','), x => x);
const voidTagNamesMap = keyBy(VOID_TAG_NAMES.split(','), x => x);

const createNativeElementMap = {
  [NodeType.TAG]: (vNode: VirtualNode): TagNativeElement => {
    const tagNode = vNode as TagVirtualNode;

    return detectIsSvgElement(tagNode.name)
      ? document.createElementNS('http://www.w3.org/2000/svg', tagNode.name)
      : document.createElement(tagNode.name);
  },
  [NodeType.TEXT]: (vNode: VirtualNode): TextNativeElement => {
    return document.createTextNode((vNode as TextVirtualNode).value);
  },
  [NodeType.COMMENT]: (vNode: VirtualNode): CommentNativeElement => {
    return document.createComment((vNode as CommentVirtualNode).value);
  },
};

function createNativeElement(vNode: VirtualNode): NativeElement {
  return createNativeElementMap[vNode.type](vNode);
}

function detectIsSvgElement(tagName: string) {
  return Boolean(svgTagNamesMap[tagName]);
}

function detectIsVoidElement(tagName: string) {
  return Boolean(voidTagNamesMap[tagName]);
}

function applyRef(ref: Ref<NativeElement>, element: NativeElement) {
  applyRef$(ref, element);
}

function addAttributes(element: NativeElement, vNode: VirtualNode) {
  if (!detectIsTagVirtualNode(vNode)) return;
  const attrNames = Object.keys(vNode.attrs);
  const tagElement = element as TagNativeElement;

  for (const attrName of attrNames) {
    const attrValue = vNode.attrs[attrName];

    if (attrName === ATTR_REF) {
      applyRef(attrValue, element);
      continue;
    }

    if (detectIsFunction(attrValue)) {
      if (detectIsEvent(attrName)) {
        delegateEvent({
          target: tagElement,
          handler: attrValue,
          eventName: getEventName(attrName),
        });
      }
    } else if (!detectIsUndefined(attrValue) && !attrBlackListMap[attrName]) {
      const stop = patchProperties({
        tagName: vNode.name,
        element: tagElement,
        attrValue,
        attrName,
      });

      !stop && tagElement.setAttribute(attrName, attrValue);
    }
  }
}

function updateAttributes(element: NativeElement, vNode: TagVirtualNode, nextVNode: TagVirtualNode) {
  const attrNames = Object.keys(nextVNode.attrs);
  const tagElement = element as TagNativeElement;

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
            target: tagElement,
            handler: nextAttrValue,
            eventName: getEventName(attrName),
          });
        }
      } else if (!attrBlackListMap[attrName] && prevAttrValue !== nextAttrValue) {
        const stop = !patchPropsBlackListMap[attrName]
          ? patchProperties({
              tagName: nextVNode.name,
              element: tagElement,
              attrValue: nextAttrValue,
              attrName,
            })
          : false;

        !stop && tagElement.setAttribute(attrName, nextAttrValue);
      }
    } else {
      tagElement.removeAttribute(attrName);
    }
  }
}

type PatchPropertiesOptions = {
  tagName: string;
  element: TagNativeElement;
  attrName: string;
  attrValue: AttributeValue;
};

function patchProperties(options: PatchPropertiesOptions): boolean {
  const { tagName, element, attrName, attrValue } = options;
  const fn = patchPropertiesSpecialCasesMap[tagName];
  let stop = fn ? fn(element, attrName, attrValue) : false;

  if (canSetProperty(Object.getPrototypeOf(element), attrName)) {
    element[attrName] = attrValue;
  }

  if (!stop && detectIsBoolean(attrValue)) {
    stop = !attrName.includes('-');
  }

  return stop;
}

function canSetProperty(prototype: TagNativeElement, key: string) {
  return prototype.hasOwnProperty(key) && Boolean(Object.getOwnPropertyDescriptor(prototype, key)?.set);
}

const patchPropertiesSpecialCasesMap: Record<
  string,
  (element: NativeElement, attrName: string, attrValue: AttributeValue) => boolean
> = {
  input: (element: HTMLInputElement, attrName: string, attrValue: AttributeValue) => {
    if (attrName === 'value' && detectIsBoolean(attrValue)) {
      element.checked = attrValue;
    } else if (attrName === 'autoFocus') {
      element.autofocus = Boolean(attrValue);
    }

    return false;
  },
  textarea: (element: HTMLTextAreaElement, attrName: string, attrValue: AttributeValue) => {
    if (attrName === 'value') {
      element.innerHTML = String(attrValue);

      return true;
    }

    return false;
  },
};

function getParentFiberWithNativeElement(fiber: Fiber<NativeElement>): Fiber<TagNativeElement> {
  let nextFiber = fiber;

  while (nextFiber) {
    nextFiber = nextFiber.parent;

    if (detectIsPortal(nextFiber.instance)) {
      nextFiber.nativeElement = getPortalContainer(nextFiber.instance);
    }

    if (nextFiber.nativeElement) return nextFiber as Fiber<TagNativeElement>;
  }

  return nextFiber as Fiber<TagNativeElement>;
}

function append(fiber: Fiber<NativeElement>, parentElement: TagNativeElement) {
  const { fragment } =
    fragmentsMap.get(parentElement) ||
    ({
      fragment: document.createDocumentFragment(),
      callback: () => {},
    } as DOMFragment);

  fragmentsMap.set(parentElement, {
    fragment,
    callback: () => {
      parentElement.appendChild(fragment);
    },
  });
  fragment.appendChild(fiber.nativeElement);
}

function insert(fiber: Fiber<NativeElement>, parentElement: TagNativeElement) {
  parentElement.insertBefore(fiber.nativeElement, parentElement.childNodes[fiber.elementIdx]);
}

function commitCreation(fiber: Fiber<NativeElement>) {
  const parentFiber = getParentFiberWithNativeElement(fiber);
  const parentElement = parentFiber.nativeElement;
  const childNodes = parentElement.childNodes;

  if (isHydrateZone.get()) {
    const nativeElement = childNodes[fiber.elementIdx] as NativeElement;

    if (
      detectIsTextVirtualNode(fiber.instance) &&
      nativeElement instanceof Text &&
      fiber.instance.value.length !== nativeElement.length
    ) {
      nativeElement.splitText(fiber.instance.value.length);
    }

    fiber.nativeElement = nativeElement;
  } else {
    if (childNodes.length === 0 || fiber.elementIdx > childNodes.length - 1) {
      const vNode = parentFiber.instance as TagVirtualNode;

      !detectIsVoidElement(vNode.name) && append(fiber, parentElement);
    } else {
      insert(fiber, parentElement);
    }
  }

  addAttributes(fiber.nativeElement, fiber.instance as VirtualNode);
}

function commitUpdate(fiber: Fiber<NativeElement>) {
  const element = fiber.nativeElement;
  const prevInstance = fiber.alternate.instance as VirtualNode;
  const nextInstance = fiber.instance as VirtualNode;

  if (
    detectIsTextVirtualNode(prevInstance) &&
    detectIsTextVirtualNode(nextInstance) &&
    prevInstance.value !== nextInstance.value
  ) {
    return (element.textContent = nextInstance.value);
  }

  if (detectIsTagVirtualNode(prevInstance) && detectIsTagVirtualNode(nextInstance)) {
    return updateAttributes(element, prevInstance, nextInstance);
  }
}

function commitDeletion(fiber: Fiber<NativeElement>) {
  const parentFiber = getParentFiberWithNativeElement(fiber);

  walkFiber<NativeElement>(fiber, ({ nextFiber, isReturn, resetIsDeepWalking, stop }) => {
    if (nextFiber === fiber.nextSibling || nextFiber === fiber.parent) {
      return stop();
    }

    if (!isReturn && nextFiber.nativeElement) {
      !detectIsPortal(nextFiber.instance) && parentFiber.nativeElement.removeChild(nextFiber.nativeElement);

      return resetIsDeepWalking();
    }
  });
}

function move(fiber: Fiber<NativeElement>) {
  const sourceNodes = collectElements(fiber);
  const sourceNode = sourceNodes[0];
  const parentElement = sourceNode.parentElement;
  const sourceFragment = new DocumentFragment();
  const elementIdx = fiber.elementIdx;
  let idx = 0;
  const move = () => {
    for (let i = 1; i < sourceNodes.length; i++) {
      parentElement.removeChild(parentElement.childNodes[elementIdx + 1]);
    }

    parentElement.replaceChild(sourceFragment, parentElement.childNodes[elementIdx]);
  };

  for (const node of sourceNodes) {
    parentElement.insertBefore(document.createComment(`${elementIdx}:${idx}`), node);
    sourceFragment.appendChild(node);
    idx++;
  }

  moves.push(move);
}

function collectElements(fiber: Fiber<NativeElement>) {
  const store: Array<NativeElement> = [];

  walkFiber<NativeElement>(fiber, ({ nextFiber, isReturn, resetIsDeepWalking, stop }) => {
    if (nextFiber === fiber.nextSibling || nextFiber === fiber.parent) {
      return stop();
    }

    if (!isReturn && nextFiber.nativeElement) {
      !detectIsPortal(nextFiber.instance) && store.push(nextFiber.nativeElement);

      return resetIsDeepWalking();
    }
  });

  return store;
}

const applyCommitMap: Record<EffectTag, (fiber: Fiber<NativeElement>) => void> = {
  [EffectTag.CREATE]: (fiber: Fiber<NativeElement>) => {
    if (fiber.nativeElement === null) return;
    trackUpdate && trackUpdate(fiber.nativeElement);
    commitCreation(fiber);
  },
  [EffectTag.UPDATE]: (fiber: Fiber<NativeElement>) => {
    fiber.move && (move(fiber), (fiber.move = false));
    if (fiber.nativeElement === null) return;
    trackUpdate && trackUpdate(fiber.nativeElement);
    commitUpdate(fiber);
  },
  [EffectTag.DELETE]: (fiber: Fiber<NativeElement>) => commitDeletion(fiber),
  [EffectTag.SKIP]: () => {},
};

function applyCommit(fiber: Fiber<NativeElement>) {
  applyCommitMap[fiber.effectTag](fiber);
}

function finishCommitWork() {
  for (const { callback } of fragmentsMap.values()) {
    callback();
  }

  for (const move of moves) {
    move();
  }

  fragmentsMap = new Map();
  moves = [];
  isHydrateZone.set(false);
}

function setTrackUpdate(fn: typeof trackUpdate) {
  trackUpdate = fn;
}

export { createNativeElement, applyCommit, finishCommitWork, setTrackUpdate };
