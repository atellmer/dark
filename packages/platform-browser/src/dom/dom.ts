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
  MOVE_MASK,
  FLUSH_MASK,
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
  applyRef,
  detectIsHydration,
} from '@dark-engine/core';

import { detectIsSvgElement, detectIsVoidElement, illegal, removeContent } from '../utils';
import { delegateEvent, detectIsEvent, getEventName } from '../events';
import {
  INPUT_TAG,
  TEXTAREA_TAG,
  STYLE_ATTR,
  CLASS_ATTR,
  CLASS_NAME_ATTR,
  VALUE_ATTR,
  AS_ATTR,
  EXCLUDE_ATTR_MARK,
  DANGER_HTML_CONTENT,
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

const cache: Record<string, NativeElement> = {};
let moves: Array<Callback> = [];
let patches: Array<Callback> = [];
let trackUpdate: (nativeElement: NativeElement) => void = null;

function createNativeElement(vNode: VirtualNode): NativeElement {
  switch (vNode.type) {
    case NodeType.TAG:
      const name = (vNode as TagVirtualNode).name;
      const tag = cache[name]
        ? cache[name].cloneNode(false)
        : detectIsSvgElement(name)
        ? document.createElementNS('http://www.w3.org/2000/svg', name)
        : document.createElement(name);

      !cache[name] && (cache[name] = tag.cloneNode(false) as NativeElement);

      return tag as TagNativeElement;
    case NodeType.TEXT:
      return document.createTextNode((vNode as TextVirtualNode).value) as TextNativeElement;
    case NodeType.COMMENT:
      return document.createComment((vNode as CommentVirtualNode).value) as CommentNativeElement;
  }
}

function setObjectStyle(element: TagNativeElement, style: CSSProperties) {
  for (const key in style) {
    (element as HTMLElement).style.setProperty(key, String(style[key]));
  }
}

function addAttributes(element: NativeElement, vNode: TagVirtualNode, isHydration: boolean) {
  const tagElement = element as TagNativeElement;

  for (let attrName in vNode.attrs) {
    const attrValue = vNode.attrs[attrName];
    const attribute = performAttribute(tagElement, attrName, attrValue);

    if (attribute === null) {
      continue;
    } else {
      attrName = attribute;
    }

    if (detectIsEvent(attrName)) {
      delegateEvent(tagElement, getEventName(attrName), attrValue);
    } else if (!isHydration && !detectIsUndefined(attrValue) && !ATTR_BLACK_LIST[attrName]) {
      !patchAttributes(tagElement, vNode.name, attrName, attrValue) && tagElement.setAttribute(attrName, attrValue);
    }
  }
}

function updateAttributes(element: NativeElement, prevVNode: TagVirtualNode, nextVNode: TagVirtualNode) {
  const attrNames = getAttributeNames(prevVNode, nextVNode);
  const tagElement = element as TagNativeElement;

  for (let attrName of attrNames) {
    const prevAttrValue = prevVNode.attrs[attrName];
    const nextAttrValue = nextVNode.attrs[attrName];
    const attribute = performAttribute(tagElement, attrName, nextAttrValue, prevAttrValue);

    if (attribute === null) {
      continue;
    } else {
      attrName = attribute;
    }

    if (!detectIsUndefined(nextAttrValue)) {
      if (detectIsEvent(attrName)) {
        prevAttrValue !== nextAttrValue && delegateEvent(tagElement, getEventName(attrName), nextAttrValue);
      } else if (!ATTR_BLACK_LIST[attrName] && prevAttrValue !== nextAttrValue) {
        !patchAttributes(tagElement, nextVNode.name, attrName, nextAttrValue) &&
          tagElement.setAttribute(attrName, nextAttrValue);
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
  if (attrName[0] === EXCLUDE_ATTR_MARK) return null;

  if (attrName === DANGER_HTML_CONTENT && tagElement.innerHTML !== nextAttrValue) {
    tagElement.innerHTML = String(nextAttrValue);
    return null;
  }

  if (attrName === REF_ATTR) {
    applyRef(nextAttrValue as unknown as Ref<TagNativeElement>, tagElement);
    return null;
  }

  if ((attrName === CLASS_ATTR || attrName === CLASS_NAME_ATTR) && nextAttrValue !== prevAttrValue) {
    toggleAttribute(tagElement, CLASS_ATTR, nextAttrValue as string);
    return null;
  }

  if (attrName === STYLE_ATTR && nextAttrValue && nextAttrValue !== prevAttrValue && detectIsObject(nextAttrValue)) {
    setObjectStyle(tagElement, nextAttrValue as CSSProperties);
    return null;
  }

  if (attrName === AS_ATTR) {
    attrName = attrName.slice(1, AS_ATTR.length);
  }

  return attrName;
}

function toggleAttribute(element: TagNativeElement, name: string, value: string) {
  value ? element.setAttribute(name, value) : element.removeAttribute(name);
}

function getAttributeNames(prevVNode: TagVirtualNode, nextVNode: TagVirtualNode) {
  const attrNames = new Set<string>();
  const prevAttrs = Object.keys(prevVNode.attrs);
  const nextAttrs = Object.keys(nextVNode.attrs);
  const size = Math.max(prevAttrs.length, nextAttrs.length);

  for (let i = 0; i < size; i++) {
    attrNames.add(prevAttrs[i] || nextAttrs[i]);
  }

  return attrNames;
}

const ATTR_TRANSFORM_MAP = {
  readonly: 'readOnly',
};

function patchAttributes(
  element: TagNativeElement,
  tagName: string,
  attrName: string,
  attrValue: AttributeValue,
): boolean {
  const fn = specialCasesMap[tagName];
  const $attrName = ATTR_TRANSFORM_MAP[attrName] || attrName;
  let stop = fn ? fn(element, attrName, attrValue) : false;

  if (canSetProperty(element, $attrName)) {
    element[$attrName] = attrValue;
  }

  if (!stop && detectIsBoolean(attrValue)) {
    stop = !$attrName.includes('-');
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
  const parent = getFiberWithElement<NativeElement, TagNativeElement>(fiber.parent);
  const parentElement = parent.element;
  const childNodes = parentElement.childNodes;
  const isHydration = detectIsHydration();

  if (isHydration) {
    let nativeElement = childNodes[fiber.eidx] as NativeElement;

    if (nativeElement instanceof DocumentType) {
      nativeElement = nativeElement.nextSibling as NativeElement;
    }

    if (
      detectIsTextVirtualNode(fiber.inst) &&
      nativeElement instanceof Text &&
      fiber.inst.value.length !== nativeElement.length
    ) {
      nativeElement.splitText(fiber.inst.value.length);
    }

    if (fiber.element.nodeName !== nativeElement.nodeName) {
      illegal('Inconsistent element for hydration!');
    }

    fiber.element = nativeElement;
  } else {
    if (detectIsTagVirtualNode(parent.inst) && parent.inst.attrs[DANGER_HTML_CONTENT]) {
      illegal(`The element with danger content can't have a children!`);
    }

    if (childNodes.length === 0 || fiber.eidx > childNodes.length - 1) {
      !detectIsVoidElement((parent.inst as TagVirtualNode).name) && appendNativeElement(fiber.element, parentElement);
    } else {
      insertNativeElement(fiber.element, parentElement.childNodes[fiber.eidx], parentElement);
    }
  }

  detectIsTagVirtualNode(fiber.inst) && addAttributes(fiber.element, fiber.inst, isHydration);
}

function commitUpdate(fiber: Fiber<NativeElement>) {
  const element = fiber.element;
  const prevInst = fiber.alt.inst as VirtualNode;
  const nextInst = fiber.inst as VirtualNode;

  detectIsPlainVirtualNode(nextInst)
    ? (prevInst as PlainVirtualNode).value !== nextInst.value && (element.nodeValue = nextInst.value)
    : updateAttributes(element, prevInst as TagVirtualNode, nextInst as TagVirtualNode);
}

function commitDeletion(fiber: Fiber<NativeElement>) {
  const parent = getFiberWithElement<NativeElement, TagNativeElement>(fiber.parent);

  if (fiber.mask & FLUSH_MASK) {
    parent.element.children.length > 0 && removeContent(parent.element);
  } else {
    walk<NativeElement>(fiber, onWalkInCommitDeletion(parent.element));
  }
}

const onWalkInCommitDeletion = (parentElement: TagNativeElement) => (fiber: Fiber<NativeElement>, skip: Callback) => {
  if (fiber.element) {
    !fiber.isPortal && removeNativeElement(fiber.element, parentElement);
    return skip();
  }
};

function move(fiber: Fiber<NativeElement>) {
  const sourceNodes = collectElements(fiber, x => x.element);
  const sourceNode = sourceNodes[0];
  const parentElement = sourceNode.parentElement;
  const sourceFragment = new DocumentFragment();
  const elementIdx = fiber.eidx;
  const move = () => {
    for (let i = 1; i < sourceNodes.length; i++) {
      removeNativeElement(parentElement.childNodes[elementIdx + 1], parentElement);
    }

    replaceNativeElement(sourceFragment, parentElement.childNodes[elementIdx], parentElement);
  };
  let idx = 0;

  for (const node of sourceNodes) {
    insertNativeElement(document.createComment(`${elementIdx}:${idx}`), node, parentElement);
    appendNativeElement(node, sourceFragment);
    idx++;
  }

  moves.push(move);
}

function commit(fiber: Fiber<NativeElement>) {
  switch (fiber.tag) {
    case CREATE_EFFECT_TAG:
      if (!fiber.element || fiber.isPortal) return;
      trackUpdate && trackUpdate(fiber.element);
      commitCreation(fiber);
      break;
    case UPDATE_EFFECT_TAG:
      fiber.mask & MOVE_MASK && (move(fiber), (fiber.mask &= ~MOVE_MASK));
      if (!fiber.element || fiber.isPortal) return;
      trackUpdate && trackUpdate(fiber.element);
      commitUpdate(fiber);
      break;
    case DELETE_EFFECT_TAG:
      commitDeletion(fiber);
      break;
    default:
      break;
  }
}

function finishCommit() {
  moves.forEach(x => x());
  patches.forEach(x => x());
  moves = [];
  patches = [];
}

const setTrackUpdate = (fn: typeof trackUpdate) => (trackUpdate = fn);

const appendNativeElement = (element: NativeNode, parent: NativeNode) => parent.appendChild(element);

const insertNativeElement = (element: NativeNode, sibling: NativeNode, parent: TagNativeElement) =>
  parent.insertBefore(element, sibling);

const replaceNativeElement = (element: NativeNode, candidate: NativeNode, parent: TagNativeElement) =>
  parent.replaceChild(element, candidate);

const removeNativeElement = (element: NativeNode, parent: TagNativeElement) =>
  element.parentElement === parent && parent.removeChild(element);

const toggle = (element: HTMLElement | SVGElement, isVisible: boolean) => {
  isVisible
    ? element.hasAttribute(STYLE_ATTR) && element.removeAttribute(STYLE_ATTR)
    : element.style.setProperty('display', 'none', 'important');
};

export { createNativeElement, commit, finishCommit, setTrackUpdate, toggle };
