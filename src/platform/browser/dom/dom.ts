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
  getAttribute,
} from '@core/view';
import { isFunction } from '@helpers';
import { delegateEvent, detectIsEvent } from '../events';
import { ATTR_KEY } from '@core/constants';
import { rootLinkHelper } from '@core/scope';


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

function createDomLink(fiber: Fiber<HTMLElement>): DomElement {
  if (!detectIsVirtualNode(fiber.instance)) {
    throw new Error('createDomLink receives only HTMLElement into fiber!');
  }

  const vNode: VirtualNode = fiber.instance;

  return createElement(vNode);
}

function updateAttributes(fiber: Fiber<Element>) {
  if (detectIsTagVirtualNode(fiber.instance)) {
    const vNode = fiber.instance;
    const element = fiber.link;
    const attrNames = Object.keys(fiber.instance.attrs);

    for (const attrName of attrNames) {
      const attrValue = getAttribute(vNode, attrName);

      if (Boolean(attrValue) && !isFunction(attrValue) && !attrBlackList.includes(attrName)) {
        element.setAttribute(attrName, attrValue);
      }

      if (detectIsEvent(attrName) && isFunction(attrValue)) {
        const eventName = attrName.slice(2, attrName.length).toLowerCase();

        delegateEvent({
          root: rootLinkHelper.get() as Element,
          target: element,
          handler: attrValue,
          eventName,
        });
      }
    }
  }
}

function updateDom(fiber: Fiber<Element>) {
  let linkParentFiber = fiber.parent;

  while (!linkParentFiber.link) {
    linkParentFiber = linkParentFiber.parent;
  }

  const parent = linkParentFiber.link;

  if (fiber.effectTag === EffectTag.PLACEMENT && fiber.link !== null) {
    parent.appendChild(fiber.link);
    updateAttributes(fiber);
  } else if (fiber.effectTag === EffectTag.UPDATE && fiber.link !== null) {

  } else if (fiber.effectTag === EffectTag.DELETION) {
    commitDeletion(fiber, parent);
  }
}

function commitDeletion(fiber: Fiber<Element>, parent: Element) {
  if (fiber.link) {
    parent.removeChild(fiber.link);
  } else {
    commitDeletion(fiber.child, parent);
  }
}

export {
  createDomLink,
  updateDom,
};
