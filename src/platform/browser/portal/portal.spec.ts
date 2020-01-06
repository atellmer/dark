import { createComponent } from '@core/component';
import { Text, View, VirtualNode, isEmptyVirtualNode } from '@core/vdom/vnode';
import { mountVirtualDOM } from '@core/vdom/mount';
import { getRegistery, createApp, setAppUid } from '@core/scope';
import createPortal from './portal';

const div = (props = {}) => View({ ...props, as: 'div' });

const uid = 0;

beforeEach(() => {
  const registry = getRegistery();
  const app = createApp(null);

  registry.set(uid, app);
  setAppUid(uid);
});

test('[portal]: portal redirect render correctly', () => {
  const domElement = document.createElement('div');
  const Component = createComponent(() => {
    return [
      div({
        slot:Text('text')
      })
    ];
  });

  const App = createComponent(() => {
    return div({
      slot: [
        Component(),
        createPortal(
          Component(),
          domElement,
        ),
      ],
    });
  });

  const vdom = mountVirtualDOM({ mountedSource: App() }) as VirtualNode;

  getRegistery().get(uid).vdom = vdom;

  const vNode = vdom.children[1];

  expect(isEmptyVirtualNode(vNode)).toBe(true);
  expect(vNode.componentRoute).toEqual([0, -1, 1, -1, -1]);
  expect(vNode.nodeRoute).toEqual([0, 1]);
  expect(domElement.innerHTML).toBe(`<div>text</div>`);
});
