import {
  type Fiber,
  type VirtualNode,
  type TagVirtualNode,
  type TextVirtualNode,
  type CommentVirtualNode,
  type TextBased,
  Text,
  ROOT,
  REF_ATTR,
  ATTR_BLACK_LIST,
  CREATE_TAG,
  detectIsFunction,
  detectIsUndefined,
  NodeType,
  detectIsTagVirtualNode,
  getFiberWithElement,
  detectIsPlainVirtualNode,
  detectIsTextVirtualNode,
  createReplacer,
  detectIsTextBased,
} from '@dark-engine/core';
import { type AttributeValue, VALUE_ATTR, TEXTAREA_TAG, detectIsVoidElement } from '@dark-engine/platform-browser';

import { NativeElement, TagNativeElement, TextNativeElement, CommentNativeElement } from '../native-element';

let chunkIds: Record<string, boolean> = {};

function createNativeElement(vNode: VirtualNode): NativeElement {
  switch (vNode.type) {
    case NodeType.TAG:
      return new TagNativeElement((vNode as TagVirtualNode).kind);
    case NodeType.TEXT:
      return new TextNativeElement((vNode as TextVirtualNode).value);
    case NodeType.COMMENT:
      return new CommentNativeElement((vNode as CommentVirtualNode).value);
  }
}

function addAttributes(element: NativeElement, vNode: TagVirtualNode) {
  const tagElement = element as TagNativeElement;

  for (const attrName in vNode.attrs) {
    const attrValue = vNode.attrs[attrName];

    if (attrName === REF_ATTR || detectIsFunction(attrValue)) {
      continue;
    } else if (!detectIsUndefined(attrValue) && !ATTR_BLACK_LIST[attrName]) {
      !patchAttributes(tagElement, attrName, attrValue) && tagElement.setAttribute(attrName, attrValue);
    }
  }
}

function patchAttributes(element: TagNativeElement, attrName: string, attrValue: AttributeValue): boolean {
  const fn = specialCasesMap[element.name];
  const stop = fn ? fn(element, attrName, attrValue) : false;

  return stop;
}

const specialCasesMap: Record<
  string,
  (element: TagNativeElement, attrName: string, attrValue: AttributeValue) => boolean
> = {
  [TEXTAREA_TAG]: (element: TagNativeElement, attrName: string, attrValue: AttributeValue) => {
    if (attrName === VALUE_ATTR && attrValue) {
      const textElement = new TextNativeElement(String(attrValue));

      element.children = [textElement];
      textElement.parentElement = element;

      return true;
    }

    return false;
  },
};

function commitCreation(fiber: Fiber<NativeElement>) {
  const parent = getFiberWithElement<NativeElement, TagNativeElement>(fiber.parent);
  const parentElement = parent.element;
  const vNode = parent.inst as TagVirtualNode;

  !detectIsVoidElement(vNode.kind) && appendNativeElement(fiber.element, parentElement);
  detectIsTagVirtualNode(fiber.inst) && addAttributes(fiber.element, fiber.inst as TagVirtualNode);
}

function commit(fiber: Fiber<NativeElement>) {
  switch (fiber.tag) {
    case CREATE_TAG:
      fiber.element && commitCreation(fiber);
      break;
    default:
      break;
  }
}

const finishCommit = () => {
  chunkIds = {};
};

function createChunk(fiber: Fiber<NativeElement>) {
  let chunk = '';
  const tagNode = fiber?.inst as TagVirtualNode;
  const tagElement = fiber?.element as TagNativeElement;

  if (!fiber || tagNode.kind === ROOT) return;

  if (!chunkIds[fiber.id]) {
    if (detectIsTagVirtualNode(fiber.inst)) {
      addAttributes(tagElement, fiber.inst);
      chunk = tagElement.render(true);
    } else if (detectIsPlainVirtualNode(fiber.inst)) {
      chunk = fiber.element.render();
    }
  } else if (detectIsTagVirtualNode(fiber.inst)) {
    chunk = tagElement.render(false);
  }

  chunkIds[fiber.id] = true;

  return chunk;
}

function createNativeChildrenNodes(children: Array<VirtualNode | TextBased>, parent?: TagNativeElement) {
  const elements: Array<NativeElement> = [];

  for (const child of children) {
    const isTag = detectIsTagVirtualNode(child);
    const isText = detectIsTextVirtualNode(child);
    const content = isTag || isText ? child : detectIsTextBased(child) ? Text(child) : createReplacer();
    const element = createNativeElement(content);

    isTag && addAttributes(element, child);
    parent && appendNativeElement(element, parent);

    if (isTag && child.children.length > 0) {
      createNativeChildrenNodes(child.children as Array<VirtualNode>, element as TagNativeElement);
    }

    elements.push(element);
  }

  return elements;
}

const appendNativeElement = (element: NativeElement, parent: TagNativeElement) => parent.appendChild(element);

export { createNativeElement, commit, finishCommit, createChunk, createNativeChildrenNodes };
