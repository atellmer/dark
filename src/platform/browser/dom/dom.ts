import { ATTR_KEY } from '@core/constants';
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

function mountDOM(
  vdom: VirtualNode | VirtualNode[],
  rootNode: HTMLElement,
  parentNode: HTMLElement = null,
): HTMLElement | Text | Comment {
  let container: HTMLElement | Text | Comment | null = parentNode || null;
  const uid = getAppUid();
  const app = getRegistery().get(uid);
  const attrValueBlackList = [ATTR_KEY];
  const mapVDOM = (vNode: VirtualNode) => {
    if (!vNode) return;

    const isContainerExists = Boolean(container) && container.nodeType === Node.ELEMENT_NODE;

    if (vNode.type === 'TAG') {
      const DOMElement = document.createElement(vNode.name);
      const mapAttrs = (attrName: string) => {
        !isFunction(getAttribute(vNode, attrName)) &&
          !attrValueBlackList.includes(attrName) &&
          DOMElement.setAttribute(attrName, vNode.attrs[attrName]);
        if (/^on/.test(attrName)) {
          const eventName = attrName.slice(2, attrName.length).toLowerCase();
          const handler = getAttribute(vNode, attrName);

          app.queue.push(() => delegateEvent(uid, rootNode, DOMElement, eventName, handler));
        }
      };

      Object.keys(vNode.attrs).forEach(mapAttrs);

      if (isContainerExists) {
        container.appendChild(DOMElement);
        if (!vNode.isVoid) {
          const node = mountDOM(vNode.children, rootNode, DOMElement) as HTMLElement;
          container.appendChild(node);
        }
      } else {
        const node = mountDOM(vNode.children, rootNode, DOMElement) as HTMLElement;
        container = node;
      }
    } else if (vNode.type === 'TEXT') {
      const textNode = document.createTextNode(vNode.text);
      if (isContainerExists) {
        container.appendChild(textNode);
      } else {
        container = textNode;
      }
    } else if (vNode.type === 'COMMENT') {
      const commentNode = document.createComment(vNode.text);
      if (isContainerExists) {
        container.appendChild(commentNode);
      } else {
        container = commentNode;
      }
    }
  };
  const mapVNodeFn = (vNode: VirtualNode) => mapVDOM(vNode);

  if (isArray(vdom)) {
    (vdom as Array<VirtualNode>).forEach(mapVNodeFn);
  } else {
    mapVDOM(vdom as VirtualNode);
  }

  return container;
}

function getDOMElementRoute(
  sourceDOMElement: HTMLElement,
  targetDOMElement: HTMLElement,
  prevRoute: number[] = [],
  level: number = 0,
  idx: number = 0,
  stop: boolean = false,
): [number[], boolean] {
  const children = Array.from(sourceDOMElement.childNodes);
  let route = [...prevRoute];

  route[level] = idx;
  level++;

  if (targetDOMElement === sourceDOMElement) {
    route = route.slice(0, level);

    return [route, true];
  }

  for (let i = 0; i < children.length; i++) {
    const childSourceDOMElement = sourceDOMElement.childNodes[i] as HTMLElement;
    const [nextRoute, nextStop] = getDOMElementRoute(childSourceDOMElement, targetDOMElement, route, level, i, stop);

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

function getDOMElementByRoute(parentNode: HTMLElement, route: number[] = []): HTMLElement {
  let node = parentNode;
  const mapRoute = (cIdx: number, idx: number) =>
    idx === 0 ? node : (node = node ? (node.childNodes[cIdx] as HTMLElement) : node);

  route.forEach(mapRoute);

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

function patchDOM(commits: Commit[], rootElement: HTMLElement) {
  const attrBlackList = [ATTR_KEY];
  const filterAttrNamesFn = (name: string) => !attrBlackList.includes(name);
  const applyCommit = (commit: Commit) => {
    const { action, nextValue, oldValue } = commit;
    const node = getNodeByCommit(rootElement, commit);
    const nexVNode = nextValue as VirtualNode;

    if (action === ADD_NODE) {
      const mountedNode = mountDOM(nexVNode, rootElement);
      node.appendChild(mountedNode);
    } else if (action === REMOVE_NODE) {
      node.parentNode.removeChild(node);
    } else if (action === REPLACE_NODE) {
      const mountedNode = mountDOM(nexVNode, rootElement);
      node.replaceWith(mountedNode);
    } else if (action === INSERT_NODE) {
      const mountedNode = mountDOM(nexVNode, rootElement);
      node.parentNode.insertBefore(mountedNode, node);
    } else if (action === ADD_ATTRIBUTE) {
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

  for (const commit of commits) {
    applyCommit(commit);
  }
}

function processDOM({ vNode = null, nextVNode = null, container = null }: ProcessDOMOptions) {
  const uid = getAppUid();
  const app = getRegistery().get(uid);
  const domElement = container || app.nativeElement;
  const mapFn = fn => fn();
  let commits = [];

  commits = getDiff(vNode, nextVNode);
  console.log('commits:', commits);
  patchDOM(commits, domElement);
  app.queue.forEach(mapFn);
  app.queue = [];
  app.vdom = nextVNode;
}

export {
  mountDOM, //
  getDOMElementRoute,
  getDOMElementByRoute,
  patchDOM,
  processDOM,
};
