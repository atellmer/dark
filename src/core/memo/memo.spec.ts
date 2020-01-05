import { createComponent } from '@core/component';
import { Text, View, VirtualNode } from '../vdom/vnode';
import { mountVirtualDOM } from '../vdom/mount';
import { getRegistery, createApp, setAppUid } from '../scope';
import memo from './memo';

const div = (props = {}) => View({ ...props, as: 'div' });

const uid = 0;

beforeEach(() => {
  const registry = getRegistery();
  const app = createApp(null);

  registry.set(uid, app);
  setAppUid(uid);
});

test('[memo]: memoization work correctly without custom comparer', () => {
  const Component = createComponent(() => {
    return [Text('text')];
  });

  const MemoComponent = memo(Component);

  const App = createComponent(() => {
    return div({
      slot: [
        MemoComponent(),
      ],
    });
  });

  const vdomOne = mountVirtualDOM({ mountedSource: App() }) as VirtualNode;
  const vNodeOne = vdomOne.children[0];
  getRegistery().get(uid).vdom = vdomOne;
  const vdomTwo = mountVirtualDOM({ mountedSource: App() }) as VirtualNode;
  const vNodeTwo = vdomTwo.children[0];

  expect(vNodeOne).toBe(vNodeTwo);
});

test('[memo]: memoization work correctly with custom comparer', () => {
  const Component = createComponent(({ value }) => {
    return [Text('value: ' + value)];
  });

  const MemoComponent = memo<{value: string}>(Component, (props, nextProps) => props.value !== nextProps.value);

  const App = createComponent(({ value }) => {
    return div({
      slot: [
        MemoComponent({ value }),
      ],
    });
  });

  const vdomOne = mountVirtualDOM({ mountedSource: App({ value: 1 }) }) as VirtualNode;
  const vNodeOne = vdomOne.children[0];
  getRegistery().get(uid).vdom = vdomOne;

  const vdomTwo = mountVirtualDOM({ mountedSource: App({ value: 1 }) }) as VirtualNode;
  const vNodeTwo = vdomTwo.children[0];
  getRegistery().get(uid).vdom = vdomTwo;

  const vdomThree = mountVirtualDOM({ mountedSource: App({ value: 2 }) }) as VirtualNode;
  const vNodeThree = vdomThree.children[0];
  getRegistery().get(uid).vdom = vdomThree;

  expect(vNodeOne).toBe(vNodeTwo);
  expect(vNodeTwo).not.toBe(vNodeThree);
});
