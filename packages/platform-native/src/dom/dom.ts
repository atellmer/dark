import {
  type Fiber,
  type VirtualNode,
  type TagVirtualNode,
  type TextVirtualNode,
  type CommentVirtualNode,
  type PlainVirtualNode,
  type Ref,
  ATTR_KEY,
  ATTR_REF,
  ATTR_FLAG,
  EffectTag,
  detectIsFunction,
  detectIsUndefined,
  NodeType,
  detectIsTagVirtualNode,
  detectIsPlainVirtualNode,
  getFiberWithElement,
  collectElements,
  walkFiber,
  applyRef as applyRef$,
} from '@dark-engine/core';

import { detectIsEvent, getEventName } from '../events';
import { type NativeElement, TagNativeElement, TextNativeElement, CommentNativeElement } from '../native-element';
import { type NSElement } from '../registry';

type PlainNativeElement = TextNativeElement | CommentNativeElement;

const attrBlackListMap = {
  [ATTR_KEY]: true,
  [ATTR_REF]: true,
  [ATTR_FLAG]: true,
};
let moves: Array<() => void> = [];

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

function applyRef(ref: Ref<NSElement>, element: TagNativeElement) {
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

    if (detectIsFunction(attrValue)) {
      detectIsEvent(attrName) && tagElement.addEventListener(getEventName(attrName), attrValue);
    } else if (!detectIsUndefined(attrValue) && !attrBlackListMap[attrName]) {
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
      if (detectIsFunction(prevAttrValue)) {
        detectIsEvent(attrName) &&
          prevAttrValue !== nextAttrValue &&
          tagElement.addEventListener(getEventName(attrName), nextAttrValue);
      } else if (!attrBlackListMap[attrName] && prevAttrValue !== nextAttrValue) {
        tagElement.setAttribute(attrName, nextAttrValue);
      }
    } else {
      if (detectIsEvent(attrName)) {
        tagElement.removeEventListener(getEventName(attrName));
      } else {
        tagElement.removeAttribute(attrName);
      }
    }
  }
}

function commitCreation(fiber: Fiber<NativeElement>) {
  const parentFiber = getFiberWithElement<NativeElement, TagNativeElement>(fiber.parent);
  const parentElement = parentFiber.element;
  const children = parentElement.children;

  if (children.length === 0 || fiber.eidx > children.length - 1) {
    parentElement.appendChild(fiber.element);
  } else {
    parentElement.insertBefore(fiber.element, parentElement.children[fiber.eidx]);
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

  walkFiber<NativeElement>(fiber, (nextFiber, isReturn, resetIsDeepWalking, stop) => {
    if (nextFiber === fiber.next || nextFiber === fiber.parent) return stop();
    if (!isReturn && nextFiber.element) {
      parentFiber.element.removeChild(nextFiber.element);

      return resetIsDeepWalking();
    }
  });
}

function move(fiber: Fiber<NativeElement>) {
  const sourceNodes = collectElements(fiber);
  const sourceNode = sourceNodes[0];
  const parentElement = sourceNode.parentElement;
  const elementIdx = fiber.eidx;
  const move = () => {
    for (let i = 0; i < sourceNodes.length; i++) {
      parentElement.insertBefore(sourceNodes[i], parentElement.children[elementIdx + i]);
      parentElement.removeChild(parentElement.children[elementIdx + i + 1]);
    }
  };

  for (let i = 0; i < sourceNodes.length; i++) {
    const node = sourceNodes[i];

    parentElement.insertBefore(new CommentNativeElement(`${elementIdx}:${i}`), node);
    parentElement.removeChild(node);
  }

  moves.push(move);
}

const applyCommitMap: Record<EffectTag, (fiber: Fiber<NativeElement>) => void> = {
  [EffectTag.C]: (fiber: Fiber<NativeElement>) => {
    if (fiber.element === null) return;
    commitCreation(fiber);
  },
  [EffectTag.U]: (fiber: Fiber<NativeElement>) => {
    fiber.move && (move(fiber), (fiber.move = false));
    if (fiber.element === null) return;
    commitUpdate(fiber);
  },
  [EffectTag.D]: commitDeletion,
  [EffectTag.S]: () => {},
};

function applyCommit(fiber: Fiber<NativeElement>) {
  applyCommitMap[fiber.tag](fiber);
}

function finishCommitWork() {
  moves.forEach(x => x());
  moves = [];
}

export { createNativeElement, applyCommit, finishCommitWork };
