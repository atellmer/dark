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

import {
  detectIsSvgElement,
  detectIsVoidElement,
  illegal,
  removeContent,
  setInnerHTML,
  detectIsBrowser,
} from '../utils';
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
  DANGER_HTML_ATTR,
  DASH_MARK,
  PREVENT,
} from '../constants';
import type {
  NativeElement,
  TagNativeElement,
  TextNativeElement,
  CommentNativeElement,
  AttributeValue,
} from '../native-element';

export type CSSProperties = Record<string, string | number>;

let moves: Array<Callback> = [];
let patches: Array<Callback> = [];
let trackUpdate: (nativeElement: NativeElement) => void = null;

function createNativeElement(vNode: VirtualNode): NativeElement {
  switch (vNode.type) {
    case NodeType.TAG:
      const name = (vNode as TagVirtualNode).name;
      const tag = detectIsSvgElement(name)
        ? document.createElementNS('http://www.w3.org/2000/svg', name)
        : document.createElement(name);

      return tag as TagNativeElement;
    case NodeType.TEXT:
      return document.createTextNode((vNode as TextVirtualNode).value) as TextNativeElement;
    case NodeType.COMMENT:
      return document.createComment((vNode as CommentVirtualNode).value) as CommentNativeElement;
  }
}

function setObjectStyle(element: TagNativeElement, style: CSSProperties) {
  for (const key in style) {
    m.setStyleProp.call((element as HTMLElement).style, key, String(style[key]));
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
      !patchAttributes(tagElement, vNode.name, attrName, attrValue) &&
        m.setAttribute.call(tagElement, attrName, attrValue);
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
          m.setAttribute.call(tagElement, attrName, nextAttrValue);
      }
    } else {
      m.removeAttribute.call(tagElement, attrName);
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

  if (attrName === DANGER_HTML_ATTR) {
    setInnerHTML(tagElement, String(nextAttrValue));
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

  if (attrName === PREVENT) {
    tagElement[PREVENT] = true;
    return null;
  }

  if (attrName === AS_ATTR) {
    attrName = attrName.slice(1, AS_ATTR.length);
  }

  return attrName;
}

function toggleAttribute(element: TagNativeElement, name: string, value: string) {
  value ? m.setAttribute.call(element, name, value) : m.removeAttribute.call(element, name);
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
    stop = !$attrName.includes(DASH_MARK);
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
    if (detectIsTagVirtualNode(parent.inst) && parent.inst.attrs[DANGER_HTML_ATTR]) {
      illegal(`The element with danger content can't have a children!`);
    }

    if (childNodes.length === 0 || fiber.eidx > childNodes.length - 1) {
      !detectIsVoidElement((parent.inst as TagVirtualNode).name) && m.appendElement.call(parentElement, fiber.element);
    } else {
      m.insertElement.call(parentElement, fiber.element, parentElement.childNodes[fiber.eidx]);
    }
  }

  detectIsTagVirtualNode(fiber.inst) && addAttributes(fiber.element, fiber.inst, isHydration);
  fiber.element.parentElement?.[PREVENT] && (fiber.element[PREVENT] = true);
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
    !fiber.hook?.getIsPortal() && m.removeElement.call(parentElement, fiber.element);
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
      m.removeElement.call(parentElement, parentElement.childNodes[elementIdx + 1]);
    }

    m.replaceElement.call(parentElement, sourceFragment, parentElement.childNodes[elementIdx]);
  };
  let idx = 0;

  for (const node of sourceNodes) {
    m.insertElement.call(parentElement, document.createComment(`${elementIdx}:${idx}`), node);
    m.appendElement.call(sourceFragment, node);
    idx++;
  }

  moves.push(move);
}

function commit(fiber: Fiber<NativeElement>) {
  switch (fiber.tag) {
    case CREATE_EFFECT_TAG:
      if (!fiber.element || fiber.hook?.getIsPortal()) return;
      trackUpdate && trackUpdate(fiber.element);
      commitCreation(fiber);
      break;
    case UPDATE_EFFECT_TAG:
      fiber.mask & MOVE_MASK && (move(fiber), (fiber.mask &= ~MOVE_MASK));
      if (!fiber.element || fiber.hook?.getIsPortal()) return;
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

function setup() {
  if (!detectIsBrowser()) return {};
  const np = Node.prototype;
  const ep = Element.prototype;

  return {
    appendElement: np.appendChild,
    insertElement: np.insertBefore,
    replaceElement: np.replaceChild,
    removeElement: np.removeChild,
    hasAttribute: ep.hasAttribute,
    setAttribute: ep.setAttribute,
    removeAttribute: ep.removeAttribute,
    setStyleProp: CSSStyleDeclaration.prototype.setProperty,
  };
}

const m = setup();

const setTrackUpdate = (fn: typeof trackUpdate) => (trackUpdate = fn);

const toggle = (element: HTMLElement | SVGElement, isVisible: boolean) => {
  isVisible
    ? m.hasAttribute.call(element, STYLE_ATTR) && m.removeAttribute.call(element, STYLE_ATTR)
    : m.setStyleProp.call(element.style, 'display', 'none', 'important');
};

export { createNativeElement, commit, finishCommit, setTrackUpdate, toggle };
