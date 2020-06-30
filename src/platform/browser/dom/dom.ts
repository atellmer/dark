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
import { rootLinkHelper } from '@core/scope';
import { detectIsComponentFactory } from '@core/component';
import { platform } from '@core/global';


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

    if (isFunction(attrValue)) {
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
  const attrNames = new Set([
    ...Object.keys(vNode.attrs),
    ...Object.keys(nextVNode.attrs),
  ]);

  for (const attrName of attrNames) {
    const attrValue = getAttribute(vNode, attrName);
    const nextAttrValue = getAttribute(nextVNode, attrName);

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
    const node = isParentComponentFactory ? getSiblingDomNode(fiber) : null;

    if (node) {
      parent.insertBefore(fiber.link, node);
    } else {
      parent.appendChild(fiber.link);
    }

    addAttributes(fiber.link, fiber.instance as VirtualNode);
  } else if (fiber.link !== null && fiber.effectTag === EffectTag.UPDATE) {
    if (!detectIsVirtualNode(fiber.alternate.instance) || !detectIsVirtualNode(fiber.instance)) return;
    const vNode: VirtualNode = fiber.alternate.instance;
    const nextVNode: VirtualNode = fiber.instance;

    updateDom(fiber.link, vNode, nextVNode);
  } else if (fiber.effectTag === EffectTag.DELETION) {
    commitDeletion({
      fiber,
      parent,
      onBeforeCommit: fiber => {},
    });
  }
}

type CommitDeletionOptions = {
  fiber: Fiber<Element>;
  parent: Element;
  fromChild?: boolean;
  onBeforeCommit: (fiber: Fiber) => void;
};

function commitDeletion(options: CommitDeletionOptions) {
  const {
    fiber,
    parent,
    fromChild = false,
    onBeforeCommit,
  } = options;

  if (fiber.link) {
    onBeforeCommit(fiber);
    parent.removeChild(fiber.link);
  } else {
    commitDeletion({
      fiber: fiber.child,
      parent,
      fromChild: true,
      onBeforeCommit,
    });
  }

  if (fromChild && fiber.nextSibling) {
    commitDeletion({
      fiber: fiber.nextSibling,
      parent,
      fromChild: true,
      onBeforeCommit,
    });
  }
}

function getChildDomNode(fiber: Fiber<Element>): Element | null {
  let nextFiber = fiber;

  while (nextFiber) {
    if (nextFiber.link) return nextFiber.link;
    nextFiber = nextFiber.child;
  }

  return null;
}

function getSiblingDomNode(fiber: Fiber<Element>): Element | null {
  if (!fiber) return null;
  let nextFiber = fiber;

  while (nextFiber) {
    if (nextFiber.nextSibling) {
      const link = getChildDomNode(nextFiber.nextSibling);

      if (link && link.parentElement) return link;
    }

    nextFiber = nextFiber.nextSibling || nextFiber.parent;
  }

  return null;
}

export {
  createDomLink,
  mutateDom,
  commitDeletion,
};
