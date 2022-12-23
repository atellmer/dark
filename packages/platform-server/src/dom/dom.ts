import {
  type Fiber,
  type VirtualNode,
  type TagVirtualNode,
  type TextVirtualNode,
  type CommentVirtualNode,
  ATTR_KEY,
  ATTR_REF,
  ATTR_FLAG,
  EffectTag,
  detectIsFunction,
  detectIsUndefined,
  detectIsBoolean,
  keyBy,
  NodeType,
  detectIsTagVirtualNode,
} from '@dark-engine/core';
import type { DOMElement, DOMFragment, AttributeValue } from './types';
import { SVG_TAG_NAMES, VOID_TAG_NAMES } from '../constants';

const attrBlackListMap = {
  [ATTR_KEY]: true,
  [ATTR_REF]: true,
  [ATTR_FLAG]: true,
};
let fragmentsMap: Map<Element, DOMFragment> = new Map();
const svgTagNamesMap = keyBy(SVG_TAG_NAMES.split(','), x => x);
const voidTagNamesMap = keyBy(VOID_TAG_NAMES.split(','), x => x);

const createNativeElementMap = {
  [NodeType.TAG]: (vNode: VirtualNode) => {
    const tagNode = vNode as TagVirtualNode;
    const node = detectIsSvgElement(tagNode.name)
      ? document.createElementNS('http://www.w3.org/2000/svg', tagNode.name)
      : document.createElement(tagNode.name);

    return node;
  },
  [NodeType.TEXT]: (vNode: VirtualNode) => {
    const textNode = vNode as TextVirtualNode;
    const node = document.createTextNode(textNode.value);

    return node;
  },
  [NodeType.COMMENT]: (vNode: VirtualNode) => {
    const commentNode = vNode as CommentVirtualNode;
    const node = document.createComment(commentNode.value);

    return node;
  },
};

function createNativeElement(vNode: VirtualNode): DOMElement {
  return createNativeElementMap[vNode.type](vNode);
}

function detectIsSvgElement(tagName: string) {
  return Boolean(svgTagNamesMap[tagName]);
}

function detectIsVoidElement(tagName: string) {
  return Boolean(voidTagNamesMap[tagName]);
}

function addAttributes(element: Element, vNode: VirtualNode) {
  if (!detectIsTagVirtualNode(vNode)) return;
  const attrNames = Object.keys(vNode.attrs);

  for (const attrName of attrNames) {
    const attrValue = vNode.attrs[attrName];

    if (attrName === ATTR_REF) {
      continue;
    }

    if (detectIsFunction(attrValue)) {
      //
    } else if (!detectIsUndefined(attrValue) && !attrBlackListMap[attrName]) {
      const stop = patchProperties({
        tagName: vNode.name,
        attrValue,
        attrName,
        element,
      });

      !stop && element.setAttribute(attrName, attrValue);
    }
  }
}

type PatchPropertiesOptions = {
  tagName: string;
  element: Element;
  attrName: string;
  attrValue: AttributeValue;
};

function patchProperties(options: PatchPropertiesOptions): boolean {
  const { tagName, element, attrName, attrValue } = options;
  const fn = patchPropertiesSpecialCasesMap[tagName];
  let stop = fn ? fn(element, attrName, attrValue) : false;

  if (!stop && detectIsBoolean(attrValue)) {
    stop = !attrName.includes('-');
  }

  return stop;
}

const patchPropertiesSpecialCasesMap: Record<
  string,
  (element: Element, attrName: string, attrValue: AttributeValue) => boolean
> = {
  textarea: (element: HTMLTextAreaElement, attrName: string, attrValue: AttributeValue) => {
    if (attrName === 'value') {
      element.innerHTML = String(attrValue);

      return true;
    }

    return false;
  },
};

function getParentFiberWithNativeElement(fiber: Fiber<Element>): Fiber<Element> {
  let nextFiber = fiber;

  while (nextFiber) {
    nextFiber = nextFiber.parent;

    if (nextFiber.nativeElement) return nextFiber;
  }

  return nextFiber;
}

function append(fiber: Fiber<Element>, parentElement: Element) {
  const { fragment } =
    fragmentsMap.get(parentElement) ||
    ({
      fragment: document.createDocumentFragment(),
      callback: () => {},
    } as DOMFragment);

  fragmentsMap.set(parentElement, {
    fragment,
    callback: () => {
      parentElement.appendChild(fragment);
    },
  });
  fragment.appendChild(fiber.nativeElement);
}

function insert(fiber: Fiber<Element>, parentElement: Element) {
  parentElement.insertBefore(fiber.nativeElement, parentElement.childNodes[fiber.elementIdx]);
}

function commitCreation(fiber: Fiber<Element>) {
  const parentFiber = getParentFiberWithNativeElement(fiber);
  const parentElement = parentFiber.nativeElement;
  const childNodes = parentElement.childNodes;

  if (childNodes.length === 0 || fiber.elementIdx > childNodes.length - 1) {
    const vNode = parentFiber.instance as TagVirtualNode;

    !detectIsVoidElement(vNode.name) && append(fiber, parentElement);
  } else {
    insert(fiber, parentElement);
  }

  addAttributes(fiber.nativeElement, fiber.instance as VirtualNode);
}

const applyCommitMap: Record<EffectTag, (fiber: Fiber<Element>) => void> = {
  [EffectTag.CREATE]: (fiber: Fiber<Element>) => {
    if (fiber.nativeElement === null) return;
    commitCreation(fiber);
  },
  [EffectTag.UPDATE]: () => {},
  [EffectTag.DELETE]: () => {},
  [EffectTag.SKIP]: () => {},
};

function applyCommit(fiber: Fiber<Element>) {
  applyCommitMap[fiber.effectTag](fiber);
}

function finishCommitWork() {
  for (const { callback } of fragmentsMap.values()) {
    callback();
  }

  fragmentsMap = new Map();
}

export { createNativeElement, applyCommit, finishCommitWork };
