import {
  type Fiber,
  type VirtualNode,
  type TagVirtualNode,
  type TextVirtualNode,
  type CommentVirtualNode,
  ROOT,
  ATTR_KEY,
  ATTR_REF,
  ATTR_FLAG,
  EffectTag,
  detectIsFunction,
  detectIsUndefined,
  keyBy,
  NodeType,
  detectIsTagVirtualNode,
  getFiberWithElement,
  detectIsPlainVirtualNode,
} from '@dark-engine/core';

import { VOID_TAG_NAMES } from '../constants';
import {
  NativeElement,
  TagNativeElement,
  TextNativeElement,
  CommentNativeElement,
  type AttributeValue,
} from '../native-element';

const attrBlackListMap = {
  [ATTR_KEY]: true,
  [ATTR_REF]: true,
  [ATTR_FLAG]: true,
};
const voidTagNamesMap = keyBy(VOID_TAG_NAMES.split(','), x => x);
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

function detectIsVoidElement(tagName: string) {
  return Boolean(voidTagNamesMap[tagName]);
}

function addAttributes(element: NativeElement, vNode: TagVirtualNode) {
  if (!vNode.attrs) return;
  const attrNames = Object.keys(vNode.attrs);
  const tagElement = element as TagNativeElement;

  for (const attrName of attrNames) {
    const attrValue = vNode.attrs[attrName];

    if (attrName === ATTR_REF || detectIsFunction(attrValue)) {
      continue;
    } else if (!detectIsUndefined(attrValue) && !attrBlackListMap[attrName]) {
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

function append(fiber: Fiber<NativeElement>, parentElement: TagNativeElement) {
  parentElement.appendChild(fiber.element);
}

function commitCreation(fiber: Fiber<NativeElement>) {
  const parentFiber = getFiberWithElement<NativeElement, TagNativeElement>(fiber.parent);
  const parentElement = parentFiber.element;
  const vNode = parentFiber.inst as TagVirtualNode;

  !detectIsVoidElement(vNode.name) && append(fiber, parentElement);
  detectIsTagVirtualNode(fiber.inst) && addAttributes(fiber.element, fiber.inst as TagVirtualNode);
}

const commitMap: Record<EffectTag, (fiber: Fiber<NativeElement>) => void> = {
  [EffectTag.C]: (fiber: Fiber<NativeElement>) => fiber.element && commitCreation(fiber),
  [EffectTag.U]: () => {},
  [EffectTag.D]: () => {},
  [EffectTag.S]: () => {},
};

function commit(fiber: Fiber<NativeElement>) {
  commitMap[fiber.tag](fiber);
}

function chunk(fiber: Fiber<NativeElement>) {
  let chunk = '';
  const tagNode = fiber?.inst as TagVirtualNode;
  const tagElement = fiber?.element as TagNativeElement;

  if (!fiber || tagNode.name === ROOT) return chunk;

  if (!chunkIds[fiber.id]) {
    if (detectIsTagVirtualNode(fiber.inst)) {
      addAttributes(tagElement, fiber.inst);
      chunk = tagElement.renderToChunk(true);
    } else if (detectIsPlainVirtualNode(fiber.inst)) {
      chunk = fiber.element.renderToChunk();
    }
  } else if (detectIsTagVirtualNode(fiber.inst)) {
    chunk = tagElement.renderToChunk(false);
  }

  chunkIds[fiber.id] = true;

  return chunk;
}

const finishCommit = () => {
  chunkIds = {};
};

export { createNativeElement, commit, finishCommit, chunk, detectIsVoidElement };
