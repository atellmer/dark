import { createComponent } from '@core/component';
import { EMPTY_NODE, Text, View, VirtualNode } from '../vnode';
import { mountVirtualDOM } from './mount';
import { Fragment } from '../../fragment';

const div = (props = {}) => View({ ...props, as: 'div' });

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

  const vdom = mountVirtualDOM(App(), [0]) as VirtualNode;

  expect(vdom.children.length).toBe(5);
});

describe('[mount vdom]: mount children correctly with arrays', () => {
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

  const vdom = mountVirtualDOM(App(), [0]) as VirtualNode;

  test('right numbers of children', () => {
    expect(vdom.children.length).toBe(12);
  });
  test('mounting components recursively', () => {
    expect(vdom.children.every(vNode => vNode.isVirtualNode === true)).toBe(true);
  });
});

test('[mount vdom]: mount empty result', () => {
  const App = createComponent(() => {
    return null;
  });

  const vdom = mountVirtualDOM(App(), [0]) as VirtualNode;

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

  const vdom = mountVirtualDOM(App(), [0]) as VirtualNode;

  expect(vdom.children.length).toBe(1);
});

test('[mount vdom]: calculate node routes correctly 1', () => {
  const App = createComponent(() => {
    return div({
      slot: [
        div({ slot: Text('1') }),
        div({ slot: Text('2') }),
        div({ slot: Text('3') }),
      ],
    })
  });

  const vdom = mountVirtualDOM(App(), [0]) as VirtualNode;
  const routes = vdom.children.map(n => n.route);

  expect(routes).toEqual([[0, 0], [0, 1], [0, 2]]);
});

test('[mount vdom]: calculate node routes correctly 2', () => {
  const vdom = mountVirtualDOM(
    [
      div({ slot: Text('1') }),
      div({ slot: Text('2') }),
      div({ slot: Text('3') }),
    ], [0]) as Array<VirtualNode>;
  const routes = vdom.map(n => n.route);

  expect(routes).toEqual([[0], [1], [2]]);
});

test('[mount vdom]: calculate node routes correctly 3', () => {
  const vdom = mountVirtualDOM(
    Fragment({
      slot: [
        div({ slot: Text('1') }),
        div({ slot: Text('2') }),
        div({ slot: Text('3') }),
    ],
  }),
  [0]) as Array<VirtualNode>;
  const routes = vdom.map(n => n.route);

  expect(routes).toEqual([[0], [1], [2]]);
});

test('[mount vdom]: calculate node routes correctly 4', () => {
  const App = createComponent(() => {
    return div({
      slot: [
        Text('text'),
        [
          div({ slot: Text('1') }),
          div({ slot: Text('2') }),
          div({ slot: Text('3') }),
        ],
        Text('text'),
        Text('text'),
      ],
    })
  });

  const vdom = mountVirtualDOM(App(), [0]) as VirtualNode;
  const routes = vdom.children.map(n => n.route);

  expect(routes).toEqual([[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5]]);
});

test('[mount vdom]: calculate node routes correctly 4', () => {
  const App = createComponent(() => {
    return div({
      slot: [
        Text('text'),
        [
          div({ slot: Text('1') }),
          div({ slot: Text('2') }),
          div({ slot: Text('3') }),
        ],
        Fragment({
          slot: [
            div({ slot: Text('1') }),
            div({ slot: Text('2') }),
            div({ slot: Text('3') }),
          ],
        }),
        Text('text'),
        div({ slot: Text('1') }),
        Text('text'),
      ],
    })
  });

  const vdom = mountVirtualDOM(App(), [0]) as VirtualNode;
  const routes = vdom.children.map(n => n.route);

  expect(routes).toEqual([[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9]]);
});

test('[mount vdom]: calculate node routes correctly 5', () => {
  const Component = createComponent(() => {
    return [
      div({ slot: Text('1') }),
      div({ slot: Text('2') }),
      div({ slot: Text('3') }),
    ]
  })
  const App = createComponent(() => {
    return div({
      slot: [
        Text('text'),
        [
          Component(),
          Component(),
          Component(),
        ],
        Text('text'),
      ],
    })
  });

  const vdom = mountVirtualDOM(App(), [0]) as VirtualNode;
  const routes = vdom.children.map(n => n.route);

  expect(routes).toEqual([[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9], [0, 10]]);
});
