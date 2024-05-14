import {
  type TagVirtualNode,
  type Fiber,
  component,
  useLayoutEffect,
  detectIsArray,
  useMemo,
  detectIsVirtualNodeFactory,
  keys,
  useRef,
  $$scope,
  __useSSR as useSSR,
  __useCursor as useCursor,
} from '@dark-engine/core';

import { type TagNativeElement } from '../native-element';
import { illegal } from '../utils';

type MetatagsProps = {
  slot: TagVirtualNode | Array<TagVirtualNode>;
};

const Metatags = component<MetatagsProps>(({ slot }) => {
  const { isServer } = useSSR();
  const vNodes = (detectIsArray(slot) ? slot : [slot])
    .map(x => (detectIsVirtualNodeFactory(x) ? x() : null))
    .filter(Boolean) as Array<TagVirtualNode>;
  const ref = useRef(vNodes);
  const cursor = useCursor();
  const scope = useMemo(() => ({ isDirty: false }), []);

  if (isServer && !scope.isDirty) {
    const $scope = $$scope();
    const emitter = $scope.getEmitter();
    const off = emitter.on<Fiber>('chunk', fiber => {
      if (fiber === cursor) {
        emitter.emit('box', new MetatagsBox(vNodes));
        off();
      }
    });

    scope.isDirty = true;
  }

  useLayoutEffect(() => {
    const prevVNodes = ref.current;

    for (let i = 0; i < prevVNodes.length; i++) {
      const prevVNode = prevVNodes[i];
      const nextVNode = vNodes[i];
      const element = resolveElement(prevVNode);
      const { children, attrs } = nextVNode;
      const textContent = children.join('');

      setTextContent(element, textContent);
      setAttributes(element, attrs);
    }

    ref.current = vNodes;
  });

  return null;
});

function resolveElement(vNode: TagVirtualNode) {
  let tag: TagNativeElement = null;

  try {
    tag = document.querySelector(`head ${createSelector(vNode)}`) || createElement(vNode);
  } catch (error) {
    illegal(`Can't resolve an element for metadata! ${[error]}`);
  }

  return tag;
}

function createSelector(vNode: TagVirtualNode) {
  const attrs = createSelectorByAttributes(vNode);
  const selector = `${vNode.name}${attrs}`;

  return selector;
}

function createSelectorByAttributes(vNode: TagVirtualNode) {
  const { attrs } = vNode;
  const selector = keys(attrs).reduce((acc, key) => (acc += `[${key}="${attrs[key]}"]`), '');

  return selector;
}

function createElement(vNode: TagVirtualNode) {
  const element = document.createElement(vNode.name);

  setAttributes(element, vNode.attrs);
  document.head.appendChild(element);

  return element;
}

function setTextContent(element: TagNativeElement, textContent: string) {
  if (element.textContent !== textContent) {
    element.textContent = textContent;
  }
}

function setAttributes(element: TagNativeElement, attrs: Record<string, string>) {
  for (const key in attrs) {
    const value = String(attrs[key]);

    if (element.getAttribute(key) !== value) {
      element.setAttribute(key, value);
    }
  }
}

export class MetatagsBox {
  constructor(public vNodes: Array<TagVirtualNode>) {}
}

const detectIsMetatagsBox = (x: unknown): x is MetatagsBox => x instanceof MetatagsBox;

export { Metatags, detectIsMetatagsBox };
