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
  detectIsUndefined,
  detectIsBoolean,
  keyBy,
  NodeType,
  detectIsTagVirtualNode,
  detectIsTextVirtualNode,
  detectIsPlainVirtualNode,
  getFiberWithElement,
  collectElements,
  walkFiber,
  isHydrateZone,
  applyRef as applyRef$,
} from '@dark-engine/core';

import { detectIsPortal } from '../portal';
import { delegateEvent, detectIsEvent, getEventName } from '../events';
import { SVG_TAG_NAMES, VOID_TAG_NAMES } from '../constants';
import type {
  NativeElement,
  TagNativeElement,
  TextNativeElement,
  CommentNativeElement,
  NativeNode,
  AttributeValue,
} from '../native-element';

const attrBlackListMap = {
  [ATTR_KEY]: true,
  [ATTR_REF]: true,
  [ATTR_FLAG]: true,
};
const patchPropsBlackListMap = {
  transform: true,
  fill: true,
};

let moves: Array<() => void> = [];
let trackUpdate: (nativeElement: NativeElement) => void = null;
const svgTagNamesMap = keyBy(SVG_TAG_NAMES.split(','), x => x);
const voidTagNamesMap = keyBy(VOID_TAG_NAMES.split(','), x => x);

const createNativeElementMap = {
  [NodeType.TAG]: (vNode: VirtualNode): TagNativeElement => {
    const tagNode = vNode as TagVirtualNode;

    return detectIsSvgElement(tagNode.name)
      ? document.createElementNS('http://www.w3.org/2000/svg', tagNode.name)
      : document.createElement(tagNode.name);
  },
  [NodeType.TEXT]: (vNode: VirtualNode): TextNativeElement => {
    return document.createTextNode((vNode as TextVirtualNode).value);
  },
  [NodeType.COMMENT]: (vNode: VirtualNode): CommentNativeElement => {
    return document.createComment((vNode as CommentVirtualNode).value);
  },
};

function createNativeElement(vNode: VirtualNode): NativeElement {
  return createNativeElementMap[vNode.type](vNode);
}

function detectIsSvgElement(tagName: string) {
  return Boolean(svgTagNamesMap[tagName]);
}

function detectIsVoidElement(tagName: string) {
  return Boolean(voidTagNamesMap[tagName]);
}

function applyRef(ref: Ref<NativeElement>, element: NativeElement) {
  applyRef$(ref, element);
}

function addAttributes(element: NativeElement, vNode: TagVirtualNode) {
  if (!vNode.attrs) return;
  const attrNames = Object.keys(vNode.attrs);
  const tagElement = element as TagNativeElement;

  for (const attrName of attrNames) {
    const attrValue = vNode.attrs[attrName];

    if (attrName === ATTR_REF) {
      applyRef(attrValue, element);
      continue;
    }

    if (detectIsEvent(attrName)) {
      delegateEvent(tagElement, getEventName(attrName), attrValue);
    } else if (!detectIsUndefined(attrValue) && !attrBlackListMap[attrName]) {
      const stop = patchProperties({
        tagName: vNode.name,
        element: tagElement,
        attrValue,
        attrName,
      });

      !stop && tagElement.setAttribute(attrName, attrValue);
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
      applyRef(prevAttrValue, element);
      continue;
    }

    if (!detectIsUndefined(nextAttrValue)) {
      if (detectIsEvent(attrName)) {
        prevAttrValue !== nextAttrValue && delegateEvent(tagElement, getEventName(attrName), nextAttrValue);
      } else if (!attrBlackListMap[attrName] && prevAttrValue !== nextAttrValue) {
        const stop = !patchPropsBlackListMap[attrName]
          ? patchProperties({
              tagName: nextVNode.name,
              element: tagElement,
              attrValue: nextAttrValue,
              attrName,
            })
          : false;

        !stop && tagElement.setAttribute(attrName, nextAttrValue);
      }
    } else {
      tagElement.removeAttribute(attrName);
    }
  }
}

type PatchPropertiesOptions = {
  tagName: string;
  element: TagNativeElement;
  attrName: string;
  attrValue: AttributeValue;
};

function patchProperties(options: PatchPropertiesOptions): boolean {
  const { tagName, element, attrName, attrValue } = options;
  const fn = patchPropertiesSpecialCasesMap[tagName];
  let stop = fn ? fn(element, attrName, attrValue) : false;

  if (canSetProperty(Object.getPrototypeOf(element), attrName)) {
    element[attrName] = attrValue;
  }

  if (!stop && detectIsBoolean(attrValue)) {
    stop = !attrName.includes('-');
  }

  return stop;
}

function canSetProperty(prototype: TagNativeElement, key: string) {
  return prototype.hasOwnProperty(key) && Boolean(Object.getOwnPropertyDescriptor(prototype, key)?.set);
}

const patchPropertiesSpecialCasesMap: Record<
  string,
  (element: NativeElement, attrName: string, attrValue: AttributeValue) => boolean
> = {
  input: (element: HTMLInputElement, attrName: string, attrValue: AttributeValue) => {
    if (attrName === 'value' && detectIsBoolean(attrValue)) {
      element.checked = attrValue;
    } else if (attrName === 'autoFocus') {
      element.autofocus = Boolean(attrValue);
    }

    return false;
  },
  textarea: (element: HTMLTextAreaElement, attrName: string, attrValue: AttributeValue) => {
    if (attrName === 'value') {
      element.innerHTML = String(attrValue);

      return true;
    }

    return false;
  },
};

function commitCreation(fiber: Fiber<NativeElement>) {
  const parentFiber = getFiberWithElement<NativeElement, TagNativeElement>(fiber.parent);
  const parentElement = parentFiber.element;
  const childNodes = parentElement.childNodes;

  if (isHydrateZone.get()) {
    const nativeElement = childNodes[fiber.eidx] as NativeElement;

    if (
      detectIsTextVirtualNode(fiber.inst) &&
      nativeElement instanceof Text &&
      fiber.inst.value.length !== nativeElement.length
    ) {
      nativeElement.splitText(fiber.inst.value.length);
    }

    fiber.element = nativeElement;
  } else {
    if (!fiber.shadow) {
      if (childNodes.length === 0 || fiber.eidx > childNodes.length - 1) {
        !detectIsVoidElement((parentFiber.inst as TagVirtualNode).name) &&
          appendNativeElement(fiber.element, parentElement);
      } else {
        insertNativeElement(fiber.element, parentElement.childNodes[fiber.eidx], parentElement);
      }
    }
  }

  detectIsTagVirtualNode(fiber.inst) && addAttributes(fiber.element, fiber.inst);
}

function commitUpdate(fiber: Fiber<NativeElement>) {
  const element = fiber.element;
  const prevInstance = fiber.alt.inst as VirtualNode;
  const nextInstance = fiber.inst as VirtualNode;

  detectIsPlainVirtualNode(nextInstance)
    ? (prevInstance as PlainVirtualNode).value !== nextInstance.value && (element.textContent = nextInstance.value)
    : updateAttributes(element, prevInstance as TagVirtualNode, nextInstance as TagVirtualNode);
}

function commitDeletion(fiber: Fiber<NativeElement>) {
  const parentFiber = getFiberWithElement<NativeElement, TagNativeElement>(fiber.parent);

  if (fiber.flush) {
    parentFiber.element.textContent && (parentFiber.element.textContent = '');
    return;
  }

  walkFiber<NativeElement>(fiber, (nextFiber, isReturn, resetIsDeepWalking, stop) => {
    if (nextFiber === fiber.next || nextFiber === fiber.parent) return stop();
    if (!isReturn && nextFiber.element) {
      !nextFiber.shadow &&
        !detectIsPortal(nextFiber.inst) &&
        removeNativeElement(nextFiber.element, parentFiber.element);

      return resetIsDeepWalking();
    }
  });
}

function move(fiber: Fiber<NativeElement>) {
  const sourceNodes = collectElements(fiber, x => x.element);
  const sourceNode = sourceNodes[0];
  const parentElement = sourceNode.parentElement;
  const sourceFragment = new DocumentFragment();
  const elementIdx = fiber.eidx;
  let idx = 0;
  const move = () => {
    for (let i = 1; i < sourceNodes.length; i++) {
      removeNativeElement(parentElement.childNodes[elementIdx + 1], parentElement);
    }

    replaceNativeElement(sourceFragment, parentElement.childNodes[elementIdx], parentElement);
  };

  for (const node of sourceNodes) {
    insertNativeElement(document.createComment(`${elementIdx}:${idx}`), node, parentElement);
    appendNativeElement(node, sourceFragment);
    idx++;
  }

  moves.push(move);
}

const commitMap: Record<EffectTag, (fiber: Fiber<NativeElement>) => void> = {
  [EffectTag.C]: (fiber: Fiber<NativeElement>) => {
    if (fiber.element === null || detectIsPortal(fiber.inst)) return;
    trackUpdate && trackUpdate(fiber.element);
    commitCreation(fiber);
  },
  [EffectTag.U]: (fiber: Fiber<NativeElement>) => {
    fiber.move && (move(fiber), (fiber.move = false));
    if (fiber.element === null || detectIsPortal(fiber.inst)) return;
    trackUpdate && trackUpdate(fiber.element);
    commitUpdate(fiber);
  },
  [EffectTag.D]: commitDeletion,
  [EffectTag.S]: () => {},
};

function commit(fiber: Fiber<NativeElement>) {
  commitMap[fiber.tag](fiber);
}

function finishCommit() {
  moves.forEach(x => x());
  moves = [];
}

function setTrackUpdate(fn: typeof trackUpdate) {
  trackUpdate = fn;
}

const appendNativeElement = (element: NativeNode, parent: NativeNode) => parent.appendChild(element);

const insertNativeElement = (element: NativeNode, sibling: NativeNode, parent: TagNativeElement) => {
  parent.insertBefore(element, sibling);
};

const insertNativeElementByIndex = (element: NativeNode, idx: number, parent: TagNativeElement) => {
  parent.insertBefore(element, parent.childNodes[idx]);
};

const replaceNativeElement = (element: NativeNode, candidate: NativeNode, parent: TagNativeElement) => {
  parent.replaceChild(element, candidate);
};

const removeNativeElement = (element: NativeNode, parent: TagNativeElement) => parent.removeChild(element);

export { createNativeElement, commit, finishCommit, setTrackUpdate, insertNativeElementByIndex };
