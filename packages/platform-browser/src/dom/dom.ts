import {
  type Fiber,
  type VirtualNode,
  type TagVirtualNode,
  type TextVirtualNode,
  type CommentVirtualNode,
  type PlainVirtualNode,
  type Callback,
  type Ref,
  REF_ATTR,
  ATTR_BLACK_LIST,
  CREATE_EFFECT_TAG,
  UPDATE_EFFECT_TAG,
  DELETE_EFFECT_TAG,
  SKIP_EFFECT_TAG,
  MOVE_MASK,
  FLUSH_MASK,
  SHADOW_MASK,
  detectIsUndefined,
  detectIsBoolean,
  detectIsObject,
  NodeType,
  detectIsTagVirtualNode,
  detectIsTextVirtualNode,
  detectIsPlainVirtualNode,
  getFiberWithElement,
  collectElements,
  walk,
  dummyFn,
  $$scope,
  applyRef,
} from '@dark-engine/core';

import { detectIsSvgElement, detectIsVoidElement } from '../utils';
import { delegateEvent, detectIsEvent, getEventName } from '../events';
import { detectIsPortal } from '../portal';
import {
  INPUT_TAG,
  TEXTAREA_TAG,
  STYLE_ATTR,
  CLASS_ATTR,
  CLASS_NAME_ATTR,
  VALUE_ATTR,
  AS_ATTR,
  EXCLUDE_ATTR_MARK,
} from '../constants';
import type {
  NativeElement,
  TagNativeElement,
  TextNativeElement,
  CommentNativeElement,
  NativeNode,
  AttributeValue,
} from '../native-element';

export type CSSProperties = Record<string, string | number>;

let moves: Array<Callback> = [];
let patches: Array<Callback> = [];
let trackUpdate: (nativeElement: NativeElement) => void = null;

const createNativeElementMap = {
  [NodeType.TAG]: (vNode: VirtualNode): TagNativeElement => {
    const tagNode = vNode as TagVirtualNode;
    const name = tagNode.name;

    return detectIsSvgElement(name)
      ? document.createElementNS('http://www.w3.org/2000/svg', name)
      : document.createElement(name);
  },
  [NodeType.TEXT]: (vNode: VirtualNode): TextNativeElement => {
    return document.createTextNode((vNode as TextVirtualNode).value);
  },
  [NodeType.COMMENT]: (vNode: VirtualNode): CommentNativeElement => {
    return document.createComment((vNode as CommentVirtualNode).value);
  },
};

function createNativeElement(node: VirtualNode): NativeElement {
  return createNativeElementMap[node.type](node);
}

function setObjectStyle(element: TagNativeElement, style: CSSProperties) {
  const keys = Object.keys(style);

  for (const key of keys) {
    element.style.setProperty(key, String(style[key]));
  }
}

function addAttributes(element: NativeElement, node: TagVirtualNode, isHydrateZone: boolean) {
  const attrNames = Object.keys(node.attrs);
  const tagElement = element as TagNativeElement;

  for (let attrName of attrNames) {
    const attrValue = node.attrs[attrName];
    const attribute = performAttribute(tagElement, attrName, attrValue);

    if (attribute === true) {
      continue;
    } else {
      attrName = attribute;
    }

    if (detectIsEvent(attrName)) {
      delegateEvent(tagElement, getEventName(attrName), attrValue);
    } else if (!isHydrateZone && !detectIsUndefined(attrValue) && !ATTR_BLACK_LIST[attrName]) {
      const stop = patchProperties({
        tagName: node.name,
        element: tagElement,
        attrValue,
        attrName,
      });

      !stop && tagElement.setAttribute(attrName, attrValue);
    }
  }
}

function updateAttributes(element: NativeElement, prevNode: TagVirtualNode, nextNode: TagVirtualNode) {
  const attrNames = getAttributeNames(prevNode, nextNode);
  const tagElement = element as TagNativeElement;

  for (let attrName of attrNames) {
    const prevAttrValue = prevNode.attrs[attrName];
    const nextAttrValue = nextNode.attrs[attrName];
    const attribute = performAttribute(tagElement, attrName, nextAttrValue, prevAttrValue);

    if (attribute === true) {
      continue;
    } else {
      attrName = attribute;
    }

    if (!detectIsUndefined(nextAttrValue)) {
      if (detectIsEvent(attrName)) {
        prevAttrValue !== nextAttrValue && delegateEvent(tagElement, getEventName(attrName), nextAttrValue);
      } else if (!ATTR_BLACK_LIST[attrName] && prevAttrValue !== nextAttrValue) {
        const stop = patchProperties({
          tagName: nextNode.name,
          element: tagElement,
          attrValue: nextAttrValue,
          attrName,
        });

        !stop && tagElement.setAttribute(attrName, nextAttrValue);
      }
    } else {
      tagElement.removeAttribute(attrName);
    }
  }
}

function performAttribute(
  tagElement: TagNativeElement,
  attrName: string,
  nextAttrValue: AttributeValue,
  prevAttrValue?: AttributeValue,
) {
  if (attrName[0] === EXCLUDE_ATTR_MARK) return true;

  if (attrName === REF_ATTR) {
    applyRef(nextAttrValue as unknown as Ref<TagNativeElement>, tagElement);
    return true;
  }

  if ((attrName === CLASS_ATTR || attrName === CLASS_NAME_ATTR) && nextAttrValue !== prevAttrValue) {
    toggleAttribute(tagElement, CLASS_ATTR, nextAttrValue as string);
    return true;
  }

  if (attrName === STYLE_ATTR && nextAttrValue && nextAttrValue !== prevAttrValue && detectIsObject(nextAttrValue)) {
    setObjectStyle(tagElement, nextAttrValue as CSSProperties);
    return true;
  }

  if (attrName === AS_ATTR) {
    attrName = attrName.slice(1, AS_ATTR.length);
  }

  return attrName;
}

function toggleAttribute(element: TagNativeElement, name: string, value: string) {
  value ? element.setAttribute(name, value) : element.removeAttribute(name);
}

function getAttributeNames(prevNode: TagVirtualNode, nextNode: TagVirtualNode) {
  const attrNames = new Set<string>();
  const prevAttrs = Object.keys(prevNode.attrs);
  const nextAttrs = Object.keys(nextNode.attrs);
  const size = Math.max(prevAttrs.length, nextAttrs.length);

  for (let i = 0; i < size; i++) {
    attrNames.add(prevAttrs[i] || nextAttrs[i]);
  }

  return attrNames;
}

type PatchPropertiesOptions = {
  tagName: string;
  element: TagNativeElement;
  attrName: string;
  attrValue: AttributeValue;
};

function patchProperties(options: PatchPropertiesOptions): boolean {
  const { tagName, element, attrName, attrValue } = options;
  const fn = specialCasesMap[tagName];
  let stop = fn ? fn(element, attrName, attrValue) : false;

  if (canSetProperty(element, attrName)) {
    element[attrName] = attrValue;
  }

  if (!stop && detectIsBoolean(attrValue)) {
    stop = !attrName.includes('-');
  }

  return stop;
}

function canSetProperty(element: TagNativeElement, key: string) {
  const prototype = Object.getPrototypeOf(element);
  const descriptor = Object.getOwnPropertyDescriptor(prototype, key);

  return Boolean(descriptor?.set);
}

const specialCasesMap: Record<
  string,
  (element: NativeElement, attrName: string, attrValue: AttributeValue) => boolean
> = {
  [INPUT_TAG]: (element: HTMLInputElement, attrName: string, attrValue: AttributeValue) => {
    if (attrName === VALUE_ATTR) {
      patches.push(() => {
        detectIsBoolean(attrValue) ? (element.checked = attrValue) : (element.value = String(attrValue));
      });
    }

    return false;
  },
  [TEXTAREA_TAG]: (element: HTMLTextAreaElement, attrName: string, attrValue: AttributeValue) => {
    if (attrName === VALUE_ATTR) {
      element.innerText = String(attrValue);

      return true;
    }

    return false;
  },
};

function commitCreation(fiber: Fiber<NativeElement>) {
  const parentFiber = getFiberWithElement<NativeElement, TagNativeElement>(fiber.parent);
  const parentElement = parentFiber.element;
  const childNodes = parentElement.childNodes;
  const isHydrateZone = $$scope().getIsHydrateZone();

  if (isHydrateZone) {
    const nativeElement = childNodes[fiber.eidx] as NativeElement;

    if (
      detectIsTextVirtualNode(fiber.inst) &&
      nativeElement instanceof Text &&
      fiber.inst.value.length !== nativeElement.length
    ) {
      nativeElement.splitText(fiber.inst.value.length);
    }

    fiber.element = nativeElement;
  } else {
    if (!(fiber.mask & SHADOW_MASK)) {
      if (childNodes.length === 0 || fiber.eidx > childNodes.length - 1) {
        !detectIsVoidElement((parentFiber.inst as TagVirtualNode).name) &&
          appendNativeElement(fiber.element, parentElement);
      } else {
        insertNativeElement(fiber.element, parentElement.childNodes[fiber.eidx], parentElement);
      }
    }
  }

  detectIsTagVirtualNode(fiber.inst) && addAttributes(fiber.element, fiber.inst, isHydrateZone);
}

function commitUpdate(fiber: Fiber<NativeElement>) {
  const element = fiber.element;
  const prevInstance = fiber.alt.inst as VirtualNode;
  const nextInstance = fiber.inst as VirtualNode;

  detectIsPlainVirtualNode(nextInstance)
    ? (prevInstance as PlainVirtualNode).value !== nextInstance.value && (element.textContent = nextInstance.value)
    : updateAttributes(element, prevInstance as TagVirtualNode, nextInstance as TagVirtualNode);
}

function commitDeletion(fiber: Fiber<NativeElement>) {
  const parentFiber = getFiberWithElement<NativeElement, TagNativeElement>(fiber.parent);

  if (fiber.mask & FLUSH_MASK) {
    parentFiber.element.innerHTML && (parentFiber.element.innerHTML = '');
    return;
  }

  walk<NativeElement>(fiber, (fiber, skip) => {
    if (fiber.element) {
      !detectIsPortal(fiber.inst) &&
        canRemoveNativeElement(fiber.element, parentFiber.element) &&
        removeNativeElement(fiber.element, parentFiber.element);
      return skip();
    }
  });
}

function move(fiber: Fiber<NativeElement>) {
  const sourceNodes = collectElements(fiber, x => x.element);
  const sourceNode = sourceNodes[0];
  const parentElement = sourceNode.parentElement;
  const sourceFragment = new DocumentFragment();
  const elementIdx = fiber.eidx;
  let idx = 0;
  const move = () => {
    for (let i = 1; i < sourceNodes.length; i++) {
      removeNativeElement(parentElement.childNodes[elementIdx + 1], parentElement);
    }

    replaceNativeElement(sourceFragment, parentElement.childNodes[elementIdx], parentElement);
  };

  for (const node of sourceNodes) {
    insertNativeElement(document.createComment(`${elementIdx}:${idx}`), node, parentElement);
    appendNativeElement(node, sourceFragment);
    idx++;
  }

  moves.push(move);
}

const commitMap: Record<string, (fiber: Fiber<NativeElement>) => void> = {
  [CREATE_EFFECT_TAG]: (fiber: Fiber<NativeElement>) => {
    if (!fiber.element || detectIsPortal(fiber.inst)) return;
    trackUpdate && trackUpdate(fiber.element);
    commitCreation(fiber);
  },
  [UPDATE_EFFECT_TAG]: (fiber: Fiber<NativeElement>) => {
    fiber.mask & MOVE_MASK && (move(fiber), (fiber.mask &= ~MOVE_MASK));
    if (!fiber.element || detectIsPortal(fiber.inst)) return;
    trackUpdate && trackUpdate(fiber.element);
    commitUpdate(fiber);
  },
  [DELETE_EFFECT_TAG]: commitDeletion,
  [SKIP_EFFECT_TAG]: dummyFn,
};

function finishCommit() {
  moves.forEach(x => x());
  patches.forEach(x => x());
  moves = [];
  patches = [];
}

const commit = (fiber: Fiber<NativeElement>) => commitMap[fiber.tag](fiber);

const setTrackUpdate = (fn: typeof trackUpdate) => (trackUpdate = fn);

const appendNativeElement = (element: NativeNode, parent: NativeNode) => parent.appendChild(element);

const insertNativeElement = (element: NativeNode, sibling: NativeNode, parent: TagNativeElement) =>
  parent.insertBefore(element, sibling);

const insertNativeElementByIndex = (element: NativeNode, idx: number, parent: TagNativeElement) =>
  parent.insertBefore(element, parent.childNodes[idx]);

const replaceNativeElement = (element: NativeNode, candidate: NativeNode, parent: TagNativeElement) =>
  parent.replaceChild(element, candidate);

const canRemoveNativeElement = (element: NativeNode, parent: NativeNode) => element.parentElement === parent;

const removeNativeElement = (element: NativeNode, parent: TagNativeElement) => parent.removeChild(element);

export { createNativeElement, commit, finishCommit, setTrackUpdate, insertNativeElementByIndex };
