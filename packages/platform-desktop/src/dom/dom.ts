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
  detectIsUndefined,
  detectIsObject,
  NodeType,
  detectIsTagVirtualNode,
  detectIsPlainVirtualNode,
  getFiberWithElement,
  collectElements,
  walk,
  applyRef as $applyRef,
} from '@dark-engine/core';

import {
  type NativeElement,
  type PlainNativeElement,
  TagNativeElement,
  TextNativeElement,
  CommentNativeElement,
} from '../native-element';
import { type EventHandler, detectIsEvent } from '../events';
import { HIDDEN_ATTR } from '../constants';
import { type QElement } from '../shared';

let moves: Array<Callback> = [];
let callbacks: Array<Callback> = [];

function createNativeElement(vNode: VirtualNode): NativeElement {
  switch (vNode.type) {
    case NodeType.TAG:
      return new TagNativeElement((vNode as TagVirtualNode).name);
    case NodeType.TEXT:
      return new TextNativeElement((vNode as TextVirtualNode).value);
    case NodeType.COMMENT:
      return new CommentNativeElement((vNode as CommentVirtualNode).value);
  }
}

function applyRef(ref: Ref<QElement>, element: TagNativeElement) {
  $applyRef(ref, element.getNativeView());
}

function addAttributes(element: NativeElement, vNode: TagVirtualNode) {
  const tagElement = element as TagNativeElement;

  for (const attrName in vNode.attrs) {
    const attrValue = vNode.attrs[attrName];

    if (attrName === REF_ATTR) {
      applyRef(attrValue, tagElement);
      continue;
    }

    if (detectIsEvent(attrName)) {
      attrValue && detectIsObject(attrValue) && addEvents(tagElement, attrValue as EventHandlersMap);
    } else if (!detectIsUndefined(attrValue) && !ATTR_BLACK_LIST[attrName]) {
      tagElement.setAttribute(attrName, attrValue);
    }
  }
}

function updateAttributes(element: NativeElement, prevVNode: TagVirtualNode, nextVNode: TagVirtualNode) {
  const attrNames = getAttributeNames(prevVNode, nextVNode);
  const tagElement = element as TagNativeElement;

  for (const attrName of attrNames) {
    const prevAttrValue = prevVNode.attrs[attrName];
    const nextAttrValue = nextVNode.attrs[attrName];

    if (attrName === REF_ATTR) {
      applyRef(prevAttrValue, tagElement);
      continue;
    }

    if (!detectIsUndefined(nextAttrValue)) {
      if (detectIsEvent(attrName)) {
        nextAttrValue &&
          detectIsObject(nextAttrValue) &&
          prevAttrValue !== nextAttrValue &&
          addEvents(tagElement, nextAttrValue as EventHandlersMap);
      } else if (!ATTR_BLACK_LIST[attrName] && prevAttrValue !== nextAttrValue) {
        tagElement.setAttribute(attrName, nextAttrValue);
      }
    } else {
      if (detectIsEvent(attrName)) {
        prevAttrValue && detectIsObject(prevAttrValue) && removeEvents(tagElement, prevAttrValue as EventHandlersMap);
      } else {
        tagElement.removeAttribute(attrName);
      }
    }
  }
}

type EventHandlersMap = Record<string, EventHandler>;

function addEvents(tagElement: TagNativeElement, value: EventHandlersMap) {
  for (const key in value) {
    tagElement.addEventListener(key, value[key]);
  }
}

function removeEvents(tagElement: TagNativeElement, value: EventHandlersMap) {
  for (const key in value) {
    tagElement.removeEventListener(key);
  }
}

function commitCreation(fiber: Fiber<NativeElement>) {
  const parent = getFiberWithElement<NativeElement, TagNativeElement>(fiber.parent);
  const parentElement = parent.el;
  const children = parentElement.children;

  if (children.length === 0 || fiber.eidx > children.length - 1) {
    appendNativeElement(fiber.el, parentElement);
  } else {
    insertNativeElement(fiber.el, parentElement.children[fiber.eidx], parentElement);
  }

  detectIsTagVirtualNode(fiber.inst) && addAttributes(fiber.el, fiber.inst as TagVirtualNode);
}

function commitUpdate(fiber: Fiber<NativeElement>) {
  const element = fiber.el;
  const prevInst = fiber.alt.inst as VirtualNode;
  const nextInst = fiber.inst as VirtualNode;

  detectIsPlainVirtualNode(nextInst)
    ? (prevInst as PlainVirtualNode).value !== nextInst.value &&
      ((element as PlainNativeElement).value = nextInst.value)
    : updateAttributes(element, prevInst as TagVirtualNode, nextInst as TagVirtualNode);
}

function commitDeletion(fiber: Fiber<NativeElement>) {
  const parent = getFiberWithElement<NativeElement, TagNativeElement>(fiber.parent);

  walk<NativeElement>(fiber, onWalkInCommitDeletion(parent.el));
}

const onWalkInCommitDeletion = (parentElement: TagNativeElement) => (fiber: Fiber<NativeElement>, skip: Callback) => {
  if (fiber.el) {
    removeNativeElement(fiber.el, parentElement);
    return skip();
  }
};

function move(fiber: Fiber<NativeElement>) {
  const sourceNodes = collectElements(fiber, x => x.el);
  const sourceNode = sourceNodes[0];
  const parentElement = sourceNode.parentElement;
  const elementIdx = fiber.eidx;
  const move = () => {
    for (let i = 0; i < sourceNodes.length; i++) {
      insertNativeElement(sourceNodes[i], parentElement.children[elementIdx + i], parentElement);
      removeNativeElement(parentElement.children[elementIdx + i + 1], parentElement);
    }
  };

  for (let i = 0; i < sourceNodes.length; i++) {
    const node = sourceNodes[i];

    insertNativeElement(new CommentNativeElement(`${elementIdx}:${i}`), node, parentElement);
    removeNativeElement(node, parentElement);
  }

  moves.push(move);
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

function commit(fiber: Fiber<NativeElement>) {
  switch (fiber.tag) {
    case CREATE_EFFECT_TAG:
      fiber.el && commitCreation(fiber);
      break;
    case UPDATE_EFFECT_TAG:
      fiber.mask & MOVE_MASK && (move(fiber), (fiber.mask &= ~MOVE_MASK));
      fiber.el && commitUpdate(fiber);
      break;
    case DELETE_EFFECT_TAG:
      commitDeletion(fiber);
      break;
    default:
      break;
  }
}

function finishCommit() {
  callbacks.forEach(x => x());
  moves.forEach(x => x());
  callbacks = [];
  moves = [];
}

function runAtTheEndOfCommit(cb: Callback) {
  callbacks.push(cb);
}

const appendNativeElement = (element: NativeElement, parent: TagNativeElement) => parent.appendChild(element);

const insertNativeElement = (element: NativeElement, sibling: NativeElement, parent: TagNativeElement) =>
  parent.insertBefore(element, sibling);

const removeNativeElement = (element: NativeElement, parent: TagNativeElement) => parent.removeChild(element);

const toggle = (element: TagNativeElement, isVisible: boolean) => element.setAttribute(HIDDEN_ATTR, isVisible);

export { createNativeElement, commit, finishCommit, runAtTheEndOfCommit, toggle };
