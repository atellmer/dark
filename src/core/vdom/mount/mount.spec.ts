import { createComponent } from '@core/component';
import { Fragment } from '../../fragment';
import { EMPTY_NODE, Text, View, VirtualNode } from '../vnode';
import { mountVirtualDOM } from './mount';
import { getRegistery, createApp, setAppUid } from '../../scope';

const div = (props = {}) => View({ ...props, as: 'div' });

beforeEach(() => {
  const registry = getRegistery();
  const app = createApp(null);

  registry.set(0, app);
  setAppUid(0);
});

test('[mount vdom]: mount children correctly', () => {
  const Component = createComponent(() => {
    return div();
  });

  const App = createComponent(() => {
    return div({
      slot: [
        Text('hello'),
        ...Array(4)
          .fill(0)
          .map((_, idx) => Component()),
      ],
    });
  });

  const vdom = mountVirtualDOM({ mountedSource: App() }) as VirtualNode;

  expect(vdom.children.length).toBe(5);
});

test('[mount vdom]: mount children correctly with arrays', () => {
  const Item = createComponent(() => {
    return div();
  });

  const ListTwo = createComponent(() => {
    return [Text('one'), Text('two'), Item()];
  });

  const ListOne = createComponent(() => {
    return [ListTwo(), ListTwo()];
  });

  const App = createComponent(() => {
    return div({
      slot: [ListOne(), ListOne()],
    });
  });

  const vdom = mountVirtualDOM({ mountedSource: App() }) as VirtualNode;

  expect(vdom.children.length).toBe(12);
  expect(vdom.children.every(vNode => vNode.isVirtualNode === true)).toBe(true);
});

test('[mount vdom]: mount empty result', () => {
  const App = createComponent(() => {
    return null;
  });

  const vdom = mountVirtualDOM({ mountedSource: App() }) as VirtualNode;

  expect(vdom.text).toBe(EMPTY_NODE);
});

test('[mount vdom]: mount component from component', () => {
  const Component = createComponent(({ slot }) => {
    return div({
      slot,
    });
  });

  const App = createComponent(() => {
    return Component({
      slot: Component(),
    });
  });

  const vdom = mountVirtualDOM({ mountedSource: App() }) as VirtualNode;

  expect(vdom.children.length).toBe(1);
});

test('[mount vdom]: calculate node routes correctly 1', () => {
  const App = createComponent(() => {
    return div({
      slot: [div({ slot: Text('1') }), div({ slot: Text('2') }), div({ slot: Text('3') })],
    });
  });

  const vdom = mountVirtualDOM({ mountedSource: App() }) as VirtualNode;
  const nodeRoutes = vdom.children.map(n => n.nodeRoute);
  const cmpRoutes = vdom.children.map(n => n.componentRoute);

  expect(nodeRoutes).toEqual([[0, 0], [0, 1], [0, 2]]);
  expect(cmpRoutes).toEqual([[0, -1, 0], [0, -1, 1], [0, -1, 2]]);
});

test('[mount vdom]: calculate node routes correctly 2', () => {
  const vdom = mountVirtualDOM({
    mountedSource: [div({ slot: Text('1') }), div({ slot: Text('2') }), div({ slot: Text('3') })],
  }) as Array<VirtualNode>;
  const routes = vdom.map(n => n.nodeRoute);
  const cmpRoutes = vdom.map(n => n.componentRoute);

  expect(routes).toEqual([[0], [1], [2]]);
  expect(cmpRoutes).toEqual([[0, 0], [0, 1], [0, 2]]);
});

test('[mount vdom]: calculate node routes correctly 3', () => {
  const vdom = mountVirtualDOM({
    mountedSource: Fragment({
      slot: [div({ slot: Text('1') }), div({ slot: Text('2') }), div({ slot: Text('3') })],
    }),
  }) as Array<VirtualNode>;
  const routes = vdom.map(n => n.nodeRoute);
  const cmpRoutes = vdom.map(n => n.componentRoute);

  expect(routes).toEqual([[0], [1], [2]]);
  expect(cmpRoutes).toEqual([[0, -1, 0], [0, -1, 1], [0, -1, 2]]);
});

test('[mount vdom]: calculate node routes correctly 4', () => {
  const App = createComponent(() => {
    return div({
      slot: [
        Text('text'),
        [div({ slot: Text('1') }), div({ slot: Text('2') }), div({ slot: Text('3') })],
        Text('text'),
        Text('text'),
      ],
    });
  });

  const vdom = mountVirtualDOM({mountedSource: App() }) as VirtualNode;
  const routes = vdom.children.map(n => n.nodeRoute);
  const cmpRoutes = vdom.children.map(n => n.componentRoute);

  expect(routes).toEqual([[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5]]);
  expect(cmpRoutes).toEqual([[0, -1, 0], [0, -1, 1, 0], [0, -1, 1, 1], [0, -1, 1, 2], [0, -1, 2], [0, -1, 3]]);
});

test('[mount vdom]: calculate node routes correctly 4', () => {
  const App = createComponent(() => {
    return div({
      slot: [
        Text('text'),
        [div({ slot: Text('1') }), div({ slot: Text('2') }), div({ slot: Text('3') })],
        Fragment({
          slot: [div({ slot: Text('1') }), div({ slot: Text('2') }), div({ slot: Text('3') })],
        }),
        Text('text'),
        div({ slot: Text('1') }),
        Text('text'),
      ],
    });
  });

  const vdom = mountVirtualDOM({mountedSource: App() }) as VirtualNode;
  const routes = vdom.children.map(n => n.nodeRoute);
  const cmpRoutes = vdom.children.map(n => n.componentRoute);

  expect(routes).toEqual([[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9]]);
  expect(cmpRoutes).toEqual([
    [0, -1, 0],
    [0, -1, 1, 0],
    [0, -1, 1, 1],
    [0, -1, 1, 2],
    [0, -1, 2, -1, 0],
    [0, -1, 2, -1, 1],
    [0, -1, 2, -1, 2],
    [0, -1, 3],
    [0, -1, 4],
    [0, -1, 5],
  ]);
});

test('[mount vdom]: calculate node routes correctly 5', () => {
  const Component = createComponent(() => {
    return [div({ slot: Text('1') }), div({ slot: Text('2') }), div({ slot: Text('3') })];
  });
  const App = createComponent(() => {
    return div({
      slot: [Text('text'), [Component(), Component(), Component()], Text('text')],
    });
  });

  const vdom = mountVirtualDOM({mountedSource: App() }) as VirtualNode;
  const routes = vdom.children.map(n => n.nodeRoute);
  const cmpRoutes = vdom.children.map(n => n.componentRoute);

  expect(routes).toEqual([[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9], [0, 10]]);
  expect(cmpRoutes).toEqual([
    [0, -1, 0],
    [0, -1, 1, 0, -1, 0],
    [0, -1, 1, 0, -1, 1],
    [0, -1, 1, 0, -1, 2],
    [0, -1, 1, 1, -1, 0],
    [0, -1, 1, 1, -1, 1],
    [0, -1, 1, 1, -1, 2],
    [0, -1, 1, 2, -1, 0],
    [0, -1, 1, 2, -1, 1],
    [0, -1, 1, 2, -1, 2],
    [0, -1, 2],
  ]);
});

test('[mount vdom]: calculate node routes correctly 6', () => {
  const Item = createComponent(() => {
    return Text('Item');
  });
  const Component = createComponent(() => {
    return [Item(), Item(), Text('Component')];
  });
  const App = createComponent(() => {
    return div({
      slot: [Text('text'), [Component(), Component()], Text('text')],
    });
  });

  const vdom = mountVirtualDOM({mountedSource: App() }) as VirtualNode;
  const routes = vdom.children.map(n => n.nodeRoute);
  const cmpRoutes = vdom.children.map(n => n.componentRoute);

  expect(routes).toEqual([[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7]]);
  expect(cmpRoutes).toEqual([
    [0, -1, 0],
    [0, -1, 1, 0, -1, 0, -1],
    [0, -1, 1, 0, -1, 1, -1],
    [0, -1, 1, 0, -1, 2],
    [0, -1, 1, 1, -1, 0, -1],
    [0, -1, 1, 1, -1, 1, -1],
    [0, -1, 1, 1, -1, 2],
    [0, -1, 2],
  ]);
});

test('[mount vdom]: calculate node routes correctly 7', () => {
  const Item = createComponent(() => {
    return [Text('text'), Text('text')];
  });

  const Component = createComponent(() => {
    return [div({ slot: Text('text') }), Item()];
  });
  const App = createComponent(() => {
    return [
      div({
        slot: [Text('text'), Text('text'), [Component(), Component()], Text('text'), Text('text')],
      }),
      Text('text'),
    ];
  });

  const vdom = mountVirtualDOM({mountedSource: App() }) as Array<VirtualNode>;
  const routes = vdom[0].children.map(n => n.nodeRoute);
  const cmpRoutes = vdom[0].children.map(n => n.componentRoute);

  expect(routes).toEqual([[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9]]);
  expect(cmpRoutes).toEqual([
    [0, -1, 0, 0],
    [0, -1, 0, 1],
    [0, -1, 0, 2, 0, -1, 0],
    [0, -1, 0, 2, 0, -1, 1, -1, 0],
    [0, -1, 0, 2, 0, -1, 1, -1, 1],
    [0, -1, 0, 2, 1, -1, 0],
    [0, -1, 0, 2, 1, -1, 1, -1, 0],
    [0, -1, 0, 2, 1, -1, 1, -1, 1],
    [0, -1, 0, 3],
    [0, -1, 0, 4],
  ]);
});
