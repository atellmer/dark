import { ATTR_KEY, ATTR_SKIP } from '@core/constants';
import {
  ADD_ATTRIBUTE,
  ADD_NODE,
  Commit,
  getAttribute,
  INSERT_NODE,
  isTagVirtualNode,
  REMOVE_ATTRIBUTE,
  REMOVE_NODE,
  REPLACE_ATTRIBUTE,
  REPLACE_NODE,
  VirtualDOM,
  VirtualNode,
} from '@core/vdom';
import { getDiff } from '@core/vdom/diff';
import { isArray, isFunction, isUndefined } from '@helpers';
import { getAppUid, getRegistery } from '../../../core/scope/scope';
import { delegateEvent } from '../events/events';

type ProcessDOMOptions = {
  vNode: VirtualNode;
  nextVNode: VirtualNode;
  container?: HTMLElement;
};

const attrBlackList = [ATTR_KEY, ATTR_SKIP];

function mountRealNode(
  uid: number,
  vNode: VirtualNode,
  root: HTMLElement,
  parentNode: HTMLElement = null,
) {
  if (!vNode) return;
  let container: HTMLElement | Text | Comment | null = parentNode || null;
  const hasMountPoint = Boolean(container && container.nodeType === Node.ELEMENT_NODE);

  if (vNode.type === 'TAG') {
    const domElement = document.createElement(vNode.name);
    const attrNames = Object.keys(vNode.attrs);

    for (const attrName of attrNames) {
      const attrValue = getAttribute(vNode, attrName);

      if (Boolean(attrValue) && !isFunction(attrValue) && !attrBlackList.includes(attrName)) {
        domElement.setAttribute(attrName, attrValue);
      }

      if (isFunction(attrValue) && /^on/.test(attrName)) {
        const eventName = attrName.slice(2, attrName.length).toLowerCase();
        delegateEvent(uid, root, domElement, eventName, attrValue);
      }
    }

    if (hasMountPoint) {
      container.appendChild(domElement);
      if (!vNode.isVoid) {
        const node = mountRealDOM(vNode.children, root, domElement) as HTMLElement;
        node && container.appendChild(node);
      }
    } else {
      const node = mountRealDOM(vNode.children, root, domElement) as HTMLElement;
      container = node;
    }
  } else if (vNode.type === 'TEXT') {
    const textNode = document.createTextNode(vNode.text);
    if (hasMountPoint) {
      container.appendChild(textNode);
    } else {
      container = textNode;
    }
  } else if (vNode.type === 'COMMENT') {
    const commentNode = document.createComment(vNode.text);
    if (hasMountPoint) {
      container.appendChild(commentNode);
    } else {
      container = commentNode;
    }
  }

  return container;
}

function mountRealDOM(
  vdom: VirtualDOM,
  root: HTMLElement,
  parentNode: HTMLElement = null,
): HTMLElement | Text | Comment {
  const uid = getAppUid();
  const vNodes = isArray(vdom) ? vdom : [vdom];
  let node = null;

  for (const vNode of vNodes) {
    node = mountRealNode(uid, vNode, root, parentNode);
  }

  return node;
}

function getDomElementRoute(
  sourceDomElement: HTMLElement,
  targetDomElement: HTMLElement,
  prevRoute: number[] = [],
  level: number = 0,
  idx: number = 0,
  stop: boolean = false,
): [number[], boolean] {
  const children = Array.from(sourceDomElement.childNodes);
  let route = [...prevRoute];

  route[level] = idx;
  level++;

  if (targetDomElement === sourceDomElement) {
    route = route.slice(0, level);
    return [route, true];
  }

  for (let i = 0; i < children.length; i++) {
    const childSourceDomElement = sourceDomElement.childNodes[i] as HTMLElement;
    const [nextRoute, nextStop] = getDomElementRoute(childSourceDomElement, targetDomElement, route, level, i, stop);

    if (nextStop) {
      return [nextRoute, nextStop];
    }
  }

  return [route, stop];
}

function getNodeByCommit(parentNode: HTMLElement, commit: Commit) {
  let node = parentNode;
  const { action, route, oldValue, nextValue } = commit;
  const isRoot = route.length === 1;

  if (isRoot) {
    const isVNodeTag = isTagVirtualNode(oldValue as VirtualNode);
    const isNextVNodeTag = isTagVirtualNode(nextValue as VirtualNode);

    if ((!isVNodeTag && isNextVNodeTag) || (!isVNodeTag && !isNextVNodeTag)) {
      node = node.childNodes[0] as HTMLElement;
    }

    return node;
  }

  const mapRoute = (routeId: number, idx: number, arr: number[]) => {
    if (idx > 0) {
      if (action === ADD_NODE && idx === arr.length - 1) {
        return;
      }

      if (action === REMOVE_NODE) {
        node = (node.childNodes[routeId] || node.childNodes[node.childNodes.length - 1]) as HTMLElement;
        return;
      }

      node = node.childNodes[routeId] as HTMLElement;
    }
  };

  route.forEach(mapRoute);

  return node;
}

function getDomElementByRoute(parentNode: HTMLElement, route: number[] = []): HTMLElement {
  let node = parentNode;
  let idx = 0;

  for (const routeIdx of route) {
    idx === 0 ? node : (node = node ? (node.childNodes[routeIdx] as HTMLElement) : node);
    idx++;
  }

  return node;
}

const patchAttributes = (name: string, value: any, node: HTMLElement) => {
  !isFunction(value) && !isUndefined(value) && node.setAttribute(name, value);

  if (node.nodeName.toLowerCase() === 'input') {
    const input = node as HTMLInputElement;
    const inputType = input.type.toLowerCase();

    if (inputType === 'text' && name === 'value') {
      input.value = value;
    } else if (inputType === 'checkbox' && name === 'checked') {
      input.checked = value;
    }
  }
};

const applyCommit = (commit: Commit, root: HTMLElement) => {
  const { action, nextValue, oldValue } = commit;
  const node = getNodeByCommit(root, commit);
  const nexVNode = nextValue as VirtualNode;

  if (action === ADD_NODE) {
    const mountedNode = mountRealDOM(nexVNode, root);
    node.appendChild(mountedNode);
  } else if (action === REMOVE_NODE) {
    node.parentNode.removeChild(node);
  } else if (action === REPLACE_NODE) {
    const mountedNode = mountRealDOM(nexVNode, root);
    node.replaceWith(mountedNode);
  } else if (action === INSERT_NODE) {
    const mountedNode = mountRealDOM(nexVNode, root);
    node.parentNode.insertBefore(mountedNode, node);
  } else if (action === ADD_ATTRIBUTE) {
    const filterAttrNamesFn = (name: string) => !attrBlackList.includes(name);
    const attrNames = Object.keys(nextValue).filter(filterAttrNamesFn);
    for (const attrName of attrNames) {
      node.setAttribute(attrName, nextValue[attrName]);
    }
  } else if (action === REMOVE_ATTRIBUTE) {
    const attrNames = Object.keys(oldValue);
    for (const attrName of attrNames) {
      node.removeAttribute(attrName);
    }
  } else if (action === REPLACE_ATTRIBUTE) {
    const attrNames = Object.keys(nextValue);

    for (const attrName of attrNames) {
      patchAttributes(attrName, nextValue[attrName], node);
    }
  }
};

function patchDOM(commits: Commit[], root: HTMLElement) {
  for (const commit of commits) {
    applyCommit(commit, root);
  }
}

function processDOM({ vNode = null, nextVNode = null, container = null }: ProcessDOMOptions) {
  const uid = getAppUid();
  const app = getRegistery().get(uid);
  const domElement = container || app.nativeElement;
  let commits = [];

  commits = getDiff(vNode, nextVNode);
  // console.log('commits:', commits);
  patchDOM(commits, domElement);
  app.vdom = nextVNode;
}

export {
  mountRealDOM, //
  getDomElementRoute,
  getDomElementByRoute,
  patchDOM,
  processDOM,
};
