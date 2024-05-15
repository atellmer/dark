import {
  type TagVirtualNodeFactory,
  type TagVirtualNode,
  type Fiber,
  component,
  useMemo,
  keys,
  useRef,
  $$scope,
  detectIsArray,
  useLayoutEffect,
  detectIsComponent,
  __useSSR as useSSR,
  detectIsTextVirtualNode,
  detectIsVirtualNodeFactory,
} from '@dark-engine/core';

import { type TagNativeElement } from '../native-element';
import { DANGER_HTML_CONTENT } from '../constants';
import { illegal, setInnerHTML } from '../utils';

const $$metatags = Symbol('metatags');

type MetatagsProps = {
  slot: TagVirtualNodeFactory | Array<TagVirtualNodeFactory>;
};

const Metatags = component<MetatagsProps>(
  ({ slot }) => {
    const { isServer } = useSSR();
    const vNodes = (detectIsArray(slot) ? slot : [slot])
      .map(x => (detectIsVirtualNodeFactory(x) ? x() : null))
      .filter(Boolean)
      .map(x =>
        metatags.has(x.name) ? x : illegal(`Incorrect tag for metadata! ${[x.name]}`),
      ) as Array<TagVirtualNode>;
    const ref = useRef(vNodes);
    const scope = useMemo(() => ({ isDirty: false }), []);

    if (isServer && !scope.isDirty) {
      const $scope = $$scope();
      const emitter = $scope.getEmitter();
      const off = emitter.on<Fiber>('chunk', fiber => {
        if (detectIsMetatags(fiber.inst)) {
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
        const textContent = children.map(x => (detectIsTextVirtualNode(x) ? x.value : x)).join('');

        if (attrs[DANGER_HTML_CONTENT]) {
          setInnerHTML(element, attrs[DANGER_HTML_CONTENT]);
        } else {
          setTextContent(element, textContent);
        }

        setAttributes(element, attrs);
      }

      ref.current = vNodes;
    });

    return null;
  },
  { token: $$metatags, displayName: 'Metatags' },
);

function resolveElement(vNode: TagVirtualNode) {
  let tag: TagNativeElement = null;

  try {
    tag = document.querySelector(`head ${createSelector(vNode)}`) || createElement(vNode);
  } catch (error) {
    illegal(`Can't resolve an element for metadata! ${[error]}`);
  }

  return tag;
}

const metatags = new Set(['title', 'meta', 'link', 'script']);

function createSelector(vNode: TagVirtualNode) {
  const attrs = createSelectorByAttributes(vNode);
  const selector = `${vNode.name}${attrs}`;

  return selector;
}

function createSelectorByAttributes(vNode: TagVirtualNode) {
  const { attrs } = vNode;
  const selector = keys(attrs)
    .filter(x => x !== DANGER_HTML_CONTENT)
    .reduce((acc, key) => (acc += `[${key}="${attrs[key]}"]`), '');

  return selector;
}

function createElement(vNode: TagVirtualNode) {
  const element = document.createElement(vNode.name);

  setAttributes(element, vNode.attrs);
  document.head.appendChild(element);

  return element;
}

function setTextContent(element: TagNativeElement, textContent: string) {
  element.textContent !== textContent && (element.textContent = textContent);
}

function setAttributes(element: TagNativeElement, attrs: Record<string, string>) {
  for (const key in attrs) {
    if (key === DANGER_HTML_CONTENT) continue;
    const value = String(attrs[key]);

    element.getAttribute(key) !== value && element.setAttribute(key, value);
  }
}

export class MetatagsBox {
  constructor(public vNodes: Array<TagVirtualNode>) {}
}

const detectIsMetatags = (x: unknown) => detectIsComponent(x) && x.token === $$metatags;

const detectIsMetatagsBox = (x: unknown): x is MetatagsBox => x instanceof MetatagsBox;

export { Metatags, detectIsMetatagsBox };
