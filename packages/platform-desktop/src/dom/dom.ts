import {
  type Fiber,
  type VirtualNode,
  type TagVirtualNode,
  type TextVirtualNode,
  type CommentVirtualNode,
  type PlainVirtualNode,
  type Ref,
  ATTR_REF,
  ATTR_BLACK_LIST,
  EFFECT_TAG_CREATE,
  EFFECT_TAG_UPDATE,
  EFFECT_TAG_DELETE,
  EFFECT_TAG_SKIP,
  MASK_MOVE,
  detectIsUndefined,
  detectIsObject,
  NodeType,
  detectIsTagVirtualNode,
  detectIsPlainVirtualNode,
  getFiberWithElement,
  collectElements,
  walk,
  applyRef as applyRef$,
} from '@dark-engine/core';

import { type EventHandler, detectIsEvent } from '../events';
import { type NativeElement, TagNativeElement, TextNativeElement, CommentNativeElement } from '../native-element';
import { type QElement } from '../shared';

type PlainNativeElement = TextNativeElement | CommentNativeElement;
type Callback = () => void;

let moves: Array<Callback> = [];
let callbacks: Array<Callback> = [];

const createNativeElementMap = {
  [NodeType.TAG]: (vNode: VirtualNode): TagNativeElement => {
    const tagNode = vNode as TagVirtualNode;
    const node = new TagNativeElement(tagNode.name);

    return node;
  },
  [NodeType.TEXT]: (vNode: VirtualNode): TextNativeElement => {
    const textNode = vNode as TextVirtualNode;
    const node = new TextNativeElement(textNode.value);

    return node;
  },
  [NodeType.COMMENT]: (vNode: VirtualNode): CommentNativeElement => {
    const commentNode = vNode as CommentVirtualNode;
    const node = new CommentNativeElement(commentNode.value);

    return node;
  },
};

function createNativeElement(vNode: VirtualNode): NativeElement {
  return createNativeElementMap[vNode.type](vNode);
}

function applyRef(ref: Ref<QElement>, element: TagNativeElement) {
  applyRef$(ref, element.getNativeView());
}

function addAttributes(element: NativeElement, vNode: TagVirtualNode) {
  if (!vNode.attrs) return;
  const attrNames = Object.keys(vNode.attrs);
  const tagElement = element as TagNativeElement;

  for (const attrName of attrNames) {
    const attrValue = vNode.attrs[attrName];

    if (attrName === ATTR_REF) {
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

function updateAttributes(element: NativeElement, vNode: TagVirtualNode, nextVNode: TagVirtualNode) {
  if (!nextVNode.attrs) return;
  const attrNames = Object.keys(nextVNode.attrs);
  const tagElement = element as TagNativeElement;

  for (const attrName of attrNames) {
    const prevAttrValue = vNode.attrs[attrName];
    const nextAttrValue = nextVNode.attrs[attrName];

    if (attrName === ATTR_REF) {
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
  const keys = Object.keys(value);

  for (const key of keys) {
    tagElement.addEventListener(key, value[key]);
  }
}

function removeEvents(tagElement: TagNativeElement, value: EventHandlersMap) {
  const keys = Object.keys(value);

  for (const key of keys) {
    tagElement.removeEventListener(key);
  }
}

function commitCreation(fiber: Fiber<NativeElement>) {
  const parentFiber = getFiberWithElement<NativeElement, TagNativeElement>(fiber.parent);
  const parentElement = parentFiber.element;
  const children = parentElement.children;

  if (children.length === 0 || fiber.eidx > children.length - 1) {
    appendNativeElement(fiber.element, parentElement);
  } else {
    insertNativeElement(fiber.element, parentElement.children[fiber.eidx], parentElement);
  }

  detectIsTagVirtualNode(fiber.inst) && addAttributes(fiber.element, fiber.inst as TagVirtualNode);
}

function commitUpdate(fiber: Fiber<NativeElement>) {
  const element = fiber.element;
  const prevInstance = fiber.alt.inst as VirtualNode;
  const nextInstance = fiber.inst as VirtualNode;

  detectIsPlainVirtualNode(nextInstance)
    ? (prevInstance as PlainVirtualNode).value !== nextInstance.value &&
      ((element as PlainNativeElement).value = nextInstance.value)
    : updateAttributes(element, prevInstance as TagVirtualNode, nextInstance as TagVirtualNode);
}

function commitDeletion(fiber: Fiber<NativeElement>) {
  const parentFiber = getFiberWithElement<NativeElement, TagNativeElement>(fiber.parent);

  walk<NativeElement>(fiber, (fiber, skip) => {
    if (fiber.element) {
      removeNativeElement(fiber.element, parentFiber.element);
      return skip();
    }
  });
}

function move(fiber: Fiber<NativeElement>) {
  const sourceNodes = collectElements(fiber, x => x.element);
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

const commitMap: Record<string, (fiber: Fiber<NativeElement>) => void> = {
  [EFFECT_TAG_CREATE]: (fiber: Fiber<NativeElement>) => {
    if (!fiber.element) return;
    commitCreation(fiber);
  },
  [EFFECT_TAG_UPDATE]: (fiber: Fiber<NativeElement>) => {
    fiber.mask & MASK_MOVE && (move(fiber), (fiber.mask &= ~MASK_MOVE));
    if (!fiber.element) return;
    commitUpdate(fiber);
  },
  [EFFECT_TAG_DELETE]: commitDeletion,
  [EFFECT_TAG_SKIP]: () => {},
};

function commit(fiber: Fiber<NativeElement>) {
  commitMap[fiber.tag](fiber);
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

const insertNativeElement = (element: NativeElement, sibling: NativeElement, parent: TagNativeElement) => {
  parent.insertBefore(element, sibling);
};

const insertNativeElementByIndex = (element: NativeElement, idx: number, parent: TagNativeElement) => {
  parent.insertBefore(element, parent.children[idx]);
};

const removeNativeElement = (element: NativeElement, parent: TagNativeElement) => parent.removeChild(element);

export { createNativeElement, commit, finishCommit, runAtTheEndOfCommit, insertNativeElementByIndex };
