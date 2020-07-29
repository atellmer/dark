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
  detectIsCommentVirtualNode,
} from '@core/view';
import { isFunction, isUndefined } from '@helpers';
import { delegateEvent, detectIsEvent, getEventName } from '../events';
import { ATTR_KEY, EMPTY_NODE } from '@core/constants';
import { fromHookUpdateHelper } from '@core/scope';
import { detectIsPortal, getPortalContainer } from '../portal';


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

const fragmentMap: Map<Element, DocumentFragment> = new Map();
let nodeCacheMap: Map<Element, Element> = new Map();

function resetNodeCache() {
  nodeCacheMap = new Map();
}

function mutateDom(fiber: Fiber<Element>) {
  const fromHookUpdate = fromHookUpdateHelper.get();
  const nextFiber = getFiberWithLink(fiber);
  const parentLink = nextFiber.link;

  if (fiber.link !== null && fiber.effectTag === EffectTag.PLACEMENT) {
    const cachedNode = nodeCacheMap.get(parentLink);
    const node = nextFiber.alternate
      ? !isUndefined(cachedNode) && canTakeNodeFromCache(fiber, nextFiber)
          ? cachedNode
          : getNodeOnTheRight(fiber, parentLink)
      : fromHookUpdate
        ? getNodeOnTheRight(fiber, parentLink)
        : null;

    nodeCacheMap.set(parentLink, node);

    if (node) {
      parentLink.insertBefore(fiber.link, node);
      if (isEndOfInsertion(fiber, nextFiber)) {
        nodeCacheMap.delete(parentLink);
      }
    } else {
      let fragment = fragmentMap.get(parentLink);

      if (isUndefined(fragment)) {
        fragment = document.createDocumentFragment();
        fragmentMap.set(parentLink, fragment);
      }

      fragment.appendChild(fiber.link);

      if (!fiber.nextSibling) {
        parentLink.appendChild(fragment);
        fragmentMap.delete(parentLink);
        nodeCacheMap.delete(parentLink);
      }
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
      parent: parentLink,
      onBeforeCommit: fiber => { },
    });
  }
}

function getFiberWithLink(fiber: Fiber<Element>): Fiber<Element> {

  if (detectIsPortal(fiber.instance)) {
    return fiber;
  }

  let nextFiber = fiber.parent;

  while (!nextFiber.link) {
    if (detectIsPortal(nextFiber.instance)) {
      nextFiber.link = getPortalContainer(nextFiber.instance);
    } else {
      nextFiber = nextFiber.parent;
    }
  }

  return nextFiber;
}

function canTakeNodeFromCache(fiber: Fiber, parentFiber: Fiber) {
  let nextFiber = fiber;

  while (nextFiber) {
    if (nextFiber.alternate) {
      const alternate = nextFiber.alternate;
      const isEmptyNode = detectIsCommentVirtualNode(alternate.instance) && alternate.instance.value === EMPTY_NODE;

      return isEmptyNode;
    }

    nextFiber = nextFiber.parent;
    if (nextFiber === parentFiber) return false;
  }

  return false;
}

function isEndOfInsertion(fiber: Fiber, parentFiber: Fiber) {
  let nextFiber = fiber;

  do {
    if (!nextFiber) return false;
    nextFiber = nextFiber.nextSibling || nextFiber.parent.nextSibling;
    if (nextFiber && nextFiber.parent === parentFiber) break;
  } while (!nextFiber)

  if (nextFiber.effectTag === EffectTag.UPDATE) {
    return true;
  }

  return false;
}

function getNodeOnTheRight(fiber: Fiber<Element>, parentElement: Element) {
  let nextFiber = fiber;
  let isDeepWalking = true;
  const fromHookUpdate = fromHookUpdateHelper.get();

  while (nextFiber) {
    if (nextFiber.link && nextFiber.link.parentElement === parentElement) {
      return nextFiber.link;
    }

    if (!fromHookUpdate && nextFiber.effectTag === EffectTag.PLACEMENT) {
      isDeepWalking = false;
    }

    if (nextFiber.child && isDeepWalking) {
      nextFiber = nextFiber.child;
    } else if (nextFiber.nextSibling) {
      isDeepWalking = true;
      nextFiber = nextFiber.nextSibling;
    } else if (nextFiber.parent) {
      isDeepWalking = false;
      nextFiber = nextFiber.parent;
      if (nextFiber.link) return null;
    } else {
      nextFiber = null;
    }
  }

  return null;
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

  if (!fiber) return; // empty fiber without link for inserting

  if (detectIsPortal(fiber.instance)) {
    fiber.link.innerHTML = '';
    return;
  }

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



export {
  createDomLink,
  mutateDom,
  commitDeletion,
  resetNodeCache,
};
