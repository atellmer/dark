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
  NodeType,
  detectIsVirtualNode,
  detectIsTagVirtualNode,
  detectIsTextVirtualNode,
  detectIsMutableRef,
  walkFiber,
  applyRef as applyRef$,
} from '@dark-engine/core';
import { detectIsEvent, getEventName } from '../events';
import { type NativeElement, TagNativeElement, TextNativeElement, CommentNativeElement } from '../native-element';
import { type NSElement } from '../registry';

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

function addAttributes(element: NativeElement, vNode: VirtualNode) {
  if (!detectIsTagVirtualNode(vNode)) return;
  const attrNames = Object.keys(vNode.attrs);
  const tagElement = element as TagNativeElement;

  for (const attrName of attrNames) {
    const attrValue = vNode.attrs[attrName];

    if (attrName === ATTR_REF) {
      applyRef(attrValue, tagElement);
      continue;
    }

    if (detectIsFunction(attrValue)) {
      if (detectIsEvent(attrName)) {
        tagElement.addEventListener(getEventName(attrName), attrValue);
      }
    } else if (!detectIsUndefined(attrValue) && !attrBlackListMap[attrName]) {
      tagElement.setAttribute(attrName, attrValue);
    }
  }
}

function updateAttributes(element: NativeElement, vNode: TagVirtualNode, nextVNode: TagVirtualNode) {
  const attrNames = new Set([...Object.keys(vNode.attrs), ...Object.keys(nextVNode.attrs)]);
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
        if (detectIsEvent(attrName) && prevAttrValue !== nextAttrValue) {
          tagElement.addEventListener(getEventName(attrName), nextAttrValue);
        }
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

function getParentFiberWithNativeElement(fiber: Fiber<NativeElement>): Fiber<TagNativeElement> {
  let nextFiber = fiber;

  while (nextFiber) {
    nextFiber = nextFiber.parent;

    if (nextFiber.nativeElement) return nextFiber as Fiber<TagNativeElement>;
  }

  return nextFiber as Fiber<TagNativeElement>;
}

function append(fiber: Fiber<NativeElement>, parentElement: TagNativeElement) {
  parentElement.appendChild(fiber.nativeElement);
}

function insert(fiber: Fiber<NativeElement>, parentElement: TagNativeElement) {
  parentElement.insertBefore(fiber.nativeElement, parentElement.children[fiber.elementIdx]);
}

function commitCreation(fiber: Fiber<NativeElement>) {
  const parentFiber = getParentFiberWithNativeElement(fiber);
  const parentElement = parentFiber.nativeElement;
  const children = parentElement.children;

  if (children.length === 0 || fiber.elementIdx > children.length - 1) {
    append(fiber, parentElement);
  } else {
    insert(fiber, parentElement);
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
    const simpleElement = element as TextNativeElement | CommentNativeElement;

    return (simpleElement.value = nextInstance.value);
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
      parentFiber.nativeElement.removeChild(nextFiber.nativeElement);

      return resetIsDeepWalking();
    }
  });
}

function move(fiber: Fiber<NativeElement>) {
  const sourceNodes = collectElements(fiber);
  const sourceNode = sourceNodes[0];
  const parentElement = sourceNode.parentElement;
  const elementIdx = fiber.elementIdx;
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

function collectElements(fiber: Fiber<NativeElement>) {
  const store: Array<NativeElement> = [];

  walkFiber<NativeElement>(fiber, ({ nextFiber, isReturn, resetIsDeepWalking, stop }) => {
    if (nextFiber === fiber.nextSibling || nextFiber === fiber.parent) {
      return stop();
    }

    if (!isReturn && nextFiber.nativeElement) {
      store.push(nextFiber.nativeElement);

      return resetIsDeepWalking();
    }
  });

  return store;
}

const applyCommitMap: Record<EffectTag, (fiber: Fiber<NativeElement>) => void> = {
  [EffectTag.CREATE]: (fiber: Fiber<NativeElement>) => {
    if (fiber.nativeElement === null) return;
    commitCreation(fiber);
  },
  [EffectTag.UPDATE]: (fiber: Fiber<NativeElement>) => {
    if (fiber.move) {
      move(fiber);
      fiber.move = false;
    }

    if (
      fiber.nativeElement === null ||
      !detectIsVirtualNode(fiber.alternate.instance) ||
      !detectIsVirtualNode(fiber.instance)
    ) {
      return;
    }
    commitUpdate(fiber);
  },
  [EffectTag.DELETE]: (fiber: Fiber<NativeElement>) => commitDeletion(fiber),
  [EffectTag.SKIP]: () => {},
};

function applyCommit(fiber: Fiber<NativeElement>) {
  applyCommitMap[fiber.effectTag](fiber);
}

function finishCommitWork() {
  for (const move of moves) {
    move();
  }

  moves = [];
}

export { createNativeElement, applyCommit, finishCommitWork };