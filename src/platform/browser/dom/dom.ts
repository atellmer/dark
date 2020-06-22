import { DomElement } from './model';
import { Fiber, EffectTag } from '@core/fiber';
import {
  NodeType,
  VirtualNode,
  TagVirtualNode,
  TextVirtualNode,
  CommentVirtualNode,
  detectIsVirtualNode,
  detectIsTagVirtualNode,
  detectIsTextVirtualNode,
  getAttribute,
} from '@core/view';
import { isFunction, isUndefined } from '@helpers';
import { delegateEvent, detectIsEvent, getEventName } from '../events';
import { ATTR_KEY } from '@core/constants';
import { rootLinkHelper, deletionsHelper } from '@core/scope';
import { detectIsComponentFactory } from '@core/component';


const attrBlackList = [ATTR_KEY];

function createElement(vNode: VirtualNode): DomElement {
  const map = {
    [NodeType.TAG]: (vNode: VirtualNode) => {
      const tagNode = vNode as TagVirtualNode;
      const node = document.createElement(tagNode.name);

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

  return map[vNode.type](vNode);
}

function createDomLink(fiber: Fiber<Element>): DomElement {
  if (!detectIsVirtualNode(fiber.instance)) {
    throw new Error('createDomLink receives only Element into fiber!');
  }

  const vNode: VirtualNode = fiber.instance;

  return createElement(vNode);
}

function addAttributes(element: Element, vNode: VirtualNode) {
  if (!detectIsTagVirtualNode(vNode)) return;
  const attrNames = Object.keys(vNode.attrs);

  for (const attrName of attrNames) {
    const attrValue = getAttribute(vNode, attrName);

    if (isFunction(attrValue)){
      if (detectIsEvent(attrName)) {
        delegateEvent({
          root: rootLinkHelper.get() as Element,
          target: element,
          handler: attrValue,
          eventName: getEventName(attrName),
        });
      }
    } else if (!isUndefined(attrValue) && !attrBlackList.includes(attrName)) {
      element.setAttribute(attrName, attrValue);
    }
  }
}

function updateAttributes(element: Element, vNode: TagVirtualNode, nextVNode: TagVirtualNode) {
  if (!detectIsTagVirtualNode(vNode) || !detectIsTagVirtualNode(nextVNode)) return;
  const attrNames = new Set([
    ...Object.keys(vNode.attrs),
    ...Object.keys(nextVNode.attrs),
  ]);

  for (const attrName of attrNames) {
    const attrValue = getAttribute(vNode, attrName);;
    const nextAttrValue = getAttribute(nextVNode, attrName)

    if (!isUndefined(nextAttrValue)) {
      if (isFunction(attrValue)) {
        if (detectIsEvent(attrName) && attrValue !== nextAttrValue) {
          delegateEvent({
            root: rootLinkHelper.get() as Element,
            target: element,
            handler: nextAttrValue,
            eventName: getEventName(attrName),
          });
        }
      } else if (!isUndefined(nextAttrValue) && attrValue !== nextAttrValue && !attrBlackList.includes(attrName)) {

        if (nextVNode.name === 'input') {
          const input = element as HTMLInputElement;
          const inputType = input.type.toLowerCase();

          if (inputType === 'text' && attrName === 'value') {
            input.value = nextAttrValue;
          } else if (inputType === 'checkbox' && attrName === 'checked') {
            input.checked = nextAttrValue;
          }
        }

        element.setAttribute(attrName, nextAttrValue);
      }
    } else {
      element.removeAttribute(attrName);
    }
  }
}

function updateDom(element: Element, instance: VirtualNode, nextInstance: VirtualNode) {
  if (detectIsTextVirtualNode(instance) && detectIsTextVirtualNode(nextInstance) && instance.value !== nextInstance.value) {
    return (element.textContent = nextInstance.value);
  }

  if (detectIsTagVirtualNode(instance) && detectIsTagVirtualNode(nextInstance)) {
    return updateAttributes(element, instance, nextInstance);
  }
}

function mutateDom(fiber: Fiber<Element>) {
  let linkParentFiber = fiber.parent;

  while (!linkParentFiber.link) {
    linkParentFiber = linkParentFiber.parent;
  }

  const parent = linkParentFiber.link;

  if (fiber.link !== null && fiber.effectTag === EffectTag.PLACEMENT) {
    const isParentComponentFactory = detectIsComponentFactory(fiber.parent.instance);
    const node = isParentComponentFactory && getSiblingDomNode(fiber);

    if (node) {
      node.parentElement.insertBefore(fiber.link, node);
    } else {
      parent.appendChild(fiber.link);
    }

    addAttributes(fiber.link, fiber.instance as VirtualNode);
  } else if (fiber.link !== null && fiber.effectTag === EffectTag.UPDATE) {
    const instance = fiber.alternate.instance as VirtualNode;
    const nextInstance = fiber.instance as VirtualNode;

    updateDom(fiber.link, instance, nextInstance)
  } else if (fiber.effectTag === EffectTag.DELETION) {
    commitDeletion(fiber, parent);
  }
}

function commitDeletion(fiber: Fiber<Element>, parent: Element, fromChild = false) {
  if (fiber.link) {
    parent.removeChild(fiber.link);
  } else {
    commitDeletion(fiber.child, parent, true);
  }

  if (fromChild && fiber.sibling) {
    commitDeletion(fiber.sibling, parent, true);
  }
}

function getDomNode(fiber: Fiber<Element>): Element | null {
  if (!fiber) return null;
  let prevFiber = fiber;

  while (prevFiber) {
    if (prevFiber.link) return prevFiber.link;
    prevFiber = prevFiber.child;
  }

  return null;
}

function getSiblingDomNode(fiber: Fiber<Element>): Element | null {
  if (!fiber) return null;
  let prevFiber = fiber;

  while (prevFiber) {
    if (prevFiber.sibling) {
      const link = getDomNode(prevFiber.sibling);

      if (link && link.parentElement) return link;
    }

    prevFiber = prevFiber.parent;
  }

  return null;
}

export {
  createDomLink,
  mutateDom,
  commitDeletion,
};
