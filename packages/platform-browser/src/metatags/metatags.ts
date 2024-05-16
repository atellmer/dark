import {
  type TagVirtualNodeFactory,
  type TagVirtualNode,
  type Fiber,
  component,
  useMemo,
  $$scope,
  detectIsArray,
  detectIsEmpty,
  useLayoutEffect,
  detectIsComponent,
  detectIsTextVirtualNode,
  detectIsVirtualNodeFactory,
  __useSSR as useSSR,
} from '@dark-engine/core';

import { HEAD_TAG, TITLE_TAG, META_TAG, NAME_ATTR, DANGER_HTML_ATTR } from '../constants';
import { type TagNativeElement } from '../native-element';
import { illegal } from '../utils';

const $$metatags = Symbol('metatags');

type MetatagsProps = {
  slot: TagVirtualNodeFactory | Array<TagVirtualNodeFactory>;
};

const Metatags = component<MetatagsProps>(
  ({ slot }) => {
    const { isServer, isHydration } = useSSR();
    const scope = useMemo(() => ({ isDirty: false }), []);
    const vNodes = createVNodes(slot);

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
      if (isHydration) return;
      for (const vNode of vNodes) {
        const { children, attrs } = vNode;
        const element = resolveElement(vNode);
        if (!element) continue;
        const text = children.map(x => (detectIsTextVirtualNode(x) ? x.value : x)).join('');

        setAttributes(element, attrs);
        setTextContent(element, text);
      }
    });

    return null;
  },
  { token: $$metatags, displayName: 'Metatags' },
);

function createVNodes(slot: MetatagsProps['slot']) {
  const vNodes = (detectIsArray(slot) ? slot : [slot]).map(x => {
    if (detectIsVirtualNodeFactory(x)) {
      return x();
    } else {
      illegal(`Metatags supports only tags!`);
    }
  });

  return vNodes;
}

function resolveElement(vNode: TagVirtualNode) {
  if (vNode.name === TITLE_TAG || vNode.name === META_TAG) {
    return document.querySelector(`${HEAD_TAG} ${createSelector(vNode)}`);
  }

  return null;
}

function createSelector(vNode: TagVirtualNode) {
  const attrs = vNode.name === META_TAG ? createAttributeSelector(NAME_ATTR, vNode.attrs[NAME_ATTR]) : '';
  const selector = `${vNode.name}${attrs}`;

  return selector;
}

const createAttributeSelector = (name: string, value: string) => (!detectIsEmpty(value) ? `[${name}="${value}"]` : '');

function setAttributes(element: TagNativeElement, attrs: Record<string, string>) {
  for (const key in attrs) {
    if (key === DANGER_HTML_ATTR) continue;
    const value = String(attrs[key]);
    element.getAttribute(key) !== value && element.setAttribute(key, value);
  }
}

const setTextContent = (element: TagNativeElement, text: string) =>
  element.textContent !== text && (element.textContent = text);

class MetatagsBox {
  constructor(public vNodes: Array<TagVirtualNode>) {}
}

const detectIsMetatags = (x: unknown) => detectIsComponent(x) && x.token === $$metatags;

const detectIsMetatagsBox = (x: unknown): x is MetatagsBox => x instanceof MetatagsBox;

export { Metatags, MetatagsBox, detectIsMetatagsBox };
