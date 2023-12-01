import {
  type Fiber,
  type VirtualNode,
  type TagVirtualNode,
  type TextVirtualNode,
  type CommentVirtualNode,
  ROOT,
  ATTR_REF,
  ATTR_BLACK_LIST,
  EFFECT_TAG_CREATE,
  EFFECT_TAG_UPDATE,
  EFFECT_TAG_DELETE,
  EFFECT_TAG_SKIP,
  detectIsFunction,
  detectIsUndefined,
  NodeType,
  detectIsTagVirtualNode,
  getFiberWithElement,
  detectIsPlainVirtualNode,
  scope$$,
} from '@dark-engine/core';

import {
  NativeElement,
  TagNativeElement,
  TextNativeElement,
  CommentNativeElement,
  type AttributeValue,
} from '../native-element';
import { detectIsVoidElement } from '../utils';

let chunkIds: Record<string, boolean> = {};

const createNativeElementMap = {
  [NodeType.TAG]: (vNode: VirtualNode) => {
    const tagNode = vNode as TagVirtualNode;
    const node = new TagNativeElement(tagNode.name);

    return node;
  },
  [NodeType.TEXT]: (vNode: VirtualNode) => {
    const textNode = vNode as TextVirtualNode;
    const node = new TextNativeElement(textNode.value);

    return node;
  },
  [NodeType.COMMENT]: (vNode: VirtualNode) => {
    const commentNode = vNode as CommentVirtualNode;
    const node = new CommentNativeElement(commentNode.value);

    return node;
  },
};

function createNativeElement(vNode: VirtualNode): NativeElement {
  return createNativeElementMap[vNode.type](vNode);
}

function addAttributes(element: NativeElement, vNode: TagVirtualNode) {
  if (!vNode.attrs) return;
  const attrNames = Object.keys(vNode.attrs);
  const tagElement = element as TagNativeElement;

  for (const attrName of attrNames) {
    const attrValue = vNode.attrs[attrName];

    if (attrName === ATTR_REF || detectIsFunction(attrValue)) {
      continue;
    } else if (!detectIsUndefined(attrValue) && !ATTR_BLACK_LIST[attrName]) {
      const stop = patchProperties({
        element: tagElement,
        attrValue,
        attrName,
      });

      !stop && tagElement.setAttribute(attrName, attrValue);
    }
  }
}

type PatchPropertiesOptions = {
  element: TagNativeElement;
  attrName: string;
  attrValue: AttributeValue;
};

function patchProperties(options: PatchPropertiesOptions): boolean {
  const { element, attrName, attrValue } = options;
  const fn = patchPropertiesSpecialCasesMap[element.name];
  const stop = fn ? fn(element, attrName, attrValue) : false;

  return stop;
}

const patchPropertiesSpecialCasesMap: Record<
  string,
  (element: TagNativeElement, attrName: string, attrValue: AttributeValue) => boolean
> = {
  textarea: (element: TagNativeElement, attrName: string, attrValue: AttributeValue) => {
    if (attrName === 'value') {
      element.children = [new TextNativeElement(String(attrValue))];

      return true;
    }

    return false;
  },
};

function commitCreation(fiber: Fiber<NativeElement>) {
  const parentFiber = getFiberWithElement<NativeElement, TagNativeElement>(fiber.parent);
  const parentElement = parentFiber.element;
  const vNode = parentFiber.inst as TagVirtualNode;

  !detectIsVoidElement(vNode.name) && appendNativeElement(fiber.element, parentElement);
  detectIsTagVirtualNode(fiber.inst) && addAttributes(fiber.element, fiber.inst as TagVirtualNode);
}

const commitMap: Record<string, (fiber: Fiber<NativeElement>) => void> = {
  [EFFECT_TAG_CREATE]: (fiber: Fiber<NativeElement>) => fiber.element && commitCreation(fiber),
  [EFFECT_TAG_UPDATE]: () => {},
  [EFFECT_TAG_DELETE]: () => {},
  [EFFECT_TAG_SKIP]: () => {},
};

function commit(fiber: Fiber<NativeElement>) {
  commitMap[fiber.tag](fiber);
}

function chunk(fiber: Fiber<NativeElement>) {
  let chunk = '';
  const tagNode = fiber?.inst as TagVirtualNode;
  const tagElement = fiber?.element as TagNativeElement;

  if (!fiber || tagNode.name === ROOT) return;

  if (!chunkIds[fiber.id]) {
    if (detectIsTagVirtualNode(fiber.inst)) {
      addAttributes(tagElement, fiber.inst);
      chunk = tagElement.renderToChunk(true, fiber.inst.children.length === 0);
    } else if (detectIsPlainVirtualNode(fiber.inst)) {
      chunk = fiber.element.renderToChunk();
    }
  } else if (detectIsTagVirtualNode(fiber.inst)) {
    chunk = tagElement.renderToChunk(false);
  }

  chunkIds[fiber.id] = true;
  scope$$().getEmitter().emit('chunk', chunk);
}

const finishCommit = () => {
  chunkIds = {};
};

const appendNativeElement = (element: NativeElement, parent: TagNativeElement) => parent.appendChild(element);

export { createNativeElement, commit, finishCommit, chunk };
