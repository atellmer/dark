import { createComponent } from '@core/component';
import { Text, View, VirtualNode, isEmptyVirtualNode } from '@core/vdom/vnode';
import { mountVirtualDOM } from '@core/vdom/mount';
import { getRegistery, createApp, setAppUid } from '@core/scope';
import createPortal from './portal';

const div = (props = {}) => View({ ...props, as: 'div' });

beforeEach(() => {
  const registry = getRegistery();
  const app = createApp(null);

  registry.set(0, app);
  setAppUid(0);
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
  const vNode = vdom.children[1];

  expect(isEmptyVirtualNode(vNode)).toBe(true);
  expect(vNode.componentRoute).toEqual([0, -1, 1, -1, -1]);
  expect(vNode.nodeRoute).toEqual([0, 1]);
  expect(domElement.innerHTML).toBe(`<div>text</div>`);
});
