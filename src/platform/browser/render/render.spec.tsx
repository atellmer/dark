/** @jsx createElement */
import { requestIdleCallback } from '@shopify/jest-dom-mocks';

import { render } from './render';
import { createComponent } from '@core/component/component';
import { View, Text, Comment, createElement } from '@core/view/view';
import { EMPTY_NODE } from '@core/constants';
import { dom } from '../../../../test/utils';


type Item = { id: number; name: string };

let host: HTMLElement = null;
const div = (props = {}) => View({ ...props, as: 'div' });
const span = (props = {}) => View({ ...props, as: 'span' });
const fireRenders = () => requestIdleCallback.runIdleCallbacks();
const TEST_MARKER = '[RENDER]';
let nextId = 0;

const generateItems = (count: number) => {
  return Array(count).fill(0).map(x => ({
    id: ++nextId,
    name: nextId.toString(),
  }));
}

beforeAll(() => {
  jest.useFakeTimers();
});

beforeEach(() => {
  nextId = 0;
  host = document.createElement('div');
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: Function) => cb());
});

test(`${TEST_MARKER}: render do not throws error`, () => {
  const Component = createComponent(() => null);
  const compile = () => {
    render(Component(), host);
  };

  expect(compile).not.toThrowError();
});

test(`${TEST_MARKER}: render text correctly`, () => {
  const content = 'hello';
  const Component = createComponent(() => Text(content));

  render(Component(), host);
  fireRenders();
  expect(host.innerHTML).toBe(content);
});

test(`${TEST_MARKER}: render tag correctly`, () => {
  const content = '<div></div>';
  const Component = createComponent(() => div());

  render(Component(), host);
  fireRenders();
  expect(host.innerHTML).toBe(content);
});

test(`${TEST_MARKER}: render comment correctly`, () => {
  const content = 'some comment';
  const Component = createComponent(() => Comment(content));

  render(Component(), host);
  fireRenders();
  expect(host.innerHTML).toBe(`<!--${content}-->`);
});

test('[Render]: render array of items correctly', () => {
  const content = dom`
    <div></div>
    <div></div>
    <div></div>
  `;
  const Component = createComponent(
    () => [div(), div(), div()],
  );

  render(Component(), host);
  fireRenders();
  expect(host.innerHTML).toBe(content);
});

test(`${TEST_MARKER}: conditional rendering works correctly`, () => {
  type AppProps = {
    items: Array<Item>;
    one: boolean;
  };

  const ListItem = createComponent(({ slot }) => {
    return div({
      slot,
    });
  })

  const ListOne = createComponent<{ items: AppProps['items'] }>(({ items }) => {
    return items.map((x => {
      return ListItem({
        key: x.id,
        slot: Text(x.name),
      })
    }))
  });

  const ListTwo = createComponent<{ items: AppProps['items'] }>(({ items }) => {
    return items.map((x => {
      return ListItem({
        key: x.id,
        slot: Text(x.name),
      })
    }))
  });

  const App = createComponent<AppProps>(({ one, items }) => {
    return [
      div({ slot: Text('header') }),
      one
        ? ListOne({ items })
        : ListTwo({ items }),
      div({ slot: Text('footer') }),
    ]
  });

  const content = (items: AppProps['items']) => dom`
    <div>header</div>
    ${items.map(x => `<div>${x.name}</div>`).join('')}
    <div>footer</div>
  `;

  let items = generateItems(3);

  render(App({ one: true, items }), host);
  fireRenders();
  expect(host.innerHTML).toBe(content(items));

  jest.advanceTimersByTime(10);

  items = generateItems(3);
  render(App({ one: false, items }), host);
  fireRenders();
  expect(host.innerHTML).toBe(content(items));

  jest.advanceTimersByTime(10);

  items = generateItems(4);
  render(App({ one: true, items }), host);
  fireRenders();
  expect(host.innerHTML).toBe(content(items));

  jest.advanceTimersByTime(10);

  items = generateItems(2);
  render(App({ one: false, items }), host);
  fireRenders();
  expect(host.innerHTML).toBe(content(items));
});

describe(`${TEST_MARKER}: adding/removing/swap nodes`, () => {
  type AppProps = {
    items: Array<Item>;
  };
  const itemAttrName = 'data-item';
  let items = [];

  const ListItem = createComponent(({ slot }) => {
    return div({
      [itemAttrName]: true,
      slot,
    });
  })

  const List = createComponent<AppProps>(({ items }) => {
    return items.map((x => {
      return ListItem({
        key: x.id,
        slot: Text(x.name),
      })
    }))
  });

  const App = createComponent<AppProps>(({ items }) => {
    return [
      div({ slot: Text('header') }),
      List({ items }),
      div({ slot: Text('footer') }),
    ]
  });

  const renderApp = () => (render(App({ items }), host), fireRenders());

  const content = (items: Array<Item>) => dom`
    <div>header</div>
    ${items.length > 0
      ? items.map(x => `<div ${itemAttrName}="true">${x.name}</div>`).join('')
      : `<!--${EMPTY_NODE}-->`
    }
    <div>footer</div>
  `;

  const addItemsToEnd = (count: number) => {
    items = [...items, ...generateItems(count)];
  };
  const addItemsToStart = (count: number) => {
    items = [...generateItems(count), ...items];
  };
  const insertNodesInDifferentPlaces = () => {
    const [item1, item2, item3, ...rest] = items;

    items = [...generateItems(5), item1, item2, ...generateItems(2), ...rest];
  };
  const removeItem = (id: number) => {
    items = items.filter(x => x.id !== id);
  };
  const swapItems = () => {
    const newItems = [...items];

    newItems[1] = items[items.length - 2];
    newItems[newItems.length - 2] = items[1];
    items = newItems;
  };

  test('nodes added correctly', () => {
    items = generateItems(5);
    renderApp();
    expect(host.innerHTML).toBe(content(items));

    jest.advanceTimersByTime(100);
    addItemsToEnd(5);
    renderApp();
    expect(host.innerHTML).toBe(content(items));

    jest.advanceTimersByTime(100);
    addItemsToStart(6);
    renderApp();
    expect(host.innerHTML).toBe(content(items));
  });

  test('nodes not recreated after adding', () => {
    items = generateItems(5);
    renderApp();

    const nodes = Array.from(host.querySelectorAll(`[${itemAttrName}]`));
    const node = nodes[0];
    const expected = node.textContent;
    const count = 4;

    jest.advanceTimersByTime(100);
    addItemsToStart(count);
    renderApp();

    const newNodes = Array.from(host.querySelectorAll(`[${itemAttrName}]`));
    const newNode = newNodes[count];

    expect(node).toBe(newNode);
    expect(node.textContent).toBe(expected);
  });

  test('nodes inserted in different places correctly', () => {
    items = generateItems(10);
    renderApp();
    expect(host.innerHTML).toBe(content(items));
    jest.advanceTimersByTime(100);
    insertNodesInDifferentPlaces();
    renderApp();
    expect(host.innerHTML).toBe(content(items));
  });

  test('nodes removed correctly', () => {
    items = generateItems(10);
    renderApp();
    expect(host.innerHTML).toBe(content(items));

    jest.advanceTimersByTime(100);
    removeItem(6);
    renderApp();
    expect(host.innerHTML).toBe(content(items));

    jest.advanceTimersByTime(100);
    removeItem(5);
    removeItem(1);
    renderApp();
    expect(host.innerHTML).toBe(content(items));

    jest.advanceTimersByTime(100);
    items = [];
    renderApp();
    expect(host.innerHTML).toBe(content(items));
  });

  test('nodes not recreated after removing', () => {
    items = generateItems(10);
    renderApp();

    const nodes = Array.from(host.querySelectorAll(`[${itemAttrName}]`));
    const node = nodes[8];
    const expected = node.textContent;

    jest.advanceTimersByTime(100);
    removeItem(6);
    renderApp();
    const newNodes = Array.from(host.querySelectorAll(`[${itemAttrName}]`));

    expect(node).toBe(newNodes[7]);
    expect(node.textContent).toBe(expected);
  });

  test('nodes swapped correctly', () => {
    items = generateItems(10);
    renderApp();

    const nodes = Array.from(host.querySelectorAll(`[${itemAttrName}]`));
    const nodeOne = nodes[1];
    const nodeTwo = nodes[8];

    expect(nodeOne.textContent).toBe('2');
    expect(nodeTwo.textContent).toBe('9');

    swapItems();
    renderApp();

    const newNodes = Array.from(host.querySelectorAll(`[${itemAttrName}]`));
    const newNodeOne = newNodes[8];
    const newNodeTwo = newNodes[1];

    expect(newNodeOne.textContent).toBe('2');
    expect(newNodeTwo.textContent).toBe('9');
  });
});

describe(`${TEST_MARKER} list of items`, () => {
  test('render simple array correctly', () => {
    const content = dom`
      <div></div>
      <div></div>
      <div></div>
    `;
    const Component = createComponent(
      () => [div(), div(), div()],
    );

    render(Component(), host);
    fireRenders();
    expect(host.innerHTML).toBe(content);
  });


  test('render arrays of any nesting correctly', () => {
    const content = dom`
    <div></div>
    <div></div>
    <div></div>
    <div id="one"></div>
    <div id="two"></div>
    <div></div>
    `;

    const Item = createComponent(() => {
      return [
        [[div({ id: 'one' })]],
        div({ id: 'two' }),
      ]
    })

    const App = createComponent(
      () => [
        [[[div()], [[div()]], div()]],
        [Item()],
        div(),
      ],
    );

    render(App(), host);
    fireRenders();
    expect(host.innerHTML).toBe(content);
  });
});

test('render nested array as components correctly', () => {
  const content = (count: number) => dom`
    <div>1</div>
    <div>2</div>
    ${Array(count).fill(0).map((x, idx) => `<p>${idx}</p>`).join('')}
    <div>3</div>
  `;

  const NestedArray = createComponent(({ count }) => {
    return Array(count).fill(0).map((x, idx) => (<p>{idx}</p>))
  });

  const Component = createComponent(
    ({ count }) => [
      <div>1</div>,
      <div>2</div>,
      <NestedArray count={count} />,
      <div>3</div>,
    ],
  );

  render(Component({ count: 3 }), host);
  fireRenders();
  expect(host.innerHTML).toBe(content(3));
  render(Component({ count: 5 }), host);
  fireRenders();
  expect(host.innerHTML).toBe(content(5));
  render(Component({ count: 1 }), host);
  fireRenders();
  expect(host.innerHTML).toBe(content(1));
});

test(`${TEST_MARKER} dynamic tag render correcrly`, () => {
  const text = 'I am dynamic tag';
  const App = createComponent(({ dynamic }) => {
    const Tag = dynamic ? span : div;

    return Tag({ slot: Text(text) });
  });

  render(App({ dynamic: false }), host);
  fireRenders();
  expect(host.innerHTML).toBe(dom`<div>${text}</div>`);

  render(App({ dynamic: true }), host);
  fireRenders();
  expect(host.innerHTML).toBe(dom`<span>${text}</span>`);
});

test(`${TEST_MARKER} JSX works`, () => {
  const text = 'I am dynamic tag';

  const CustomItem = createComponent(({ slot }) => {
    return <span>{slot}</span>;
  });

  const App = createComponent(({ dynamic }) => {
    const Tag = dynamic ? CustomItem : 'div';

    return <Tag>{text}</Tag>;
  });

  render(App({ dynamic: false }), host);
  fireRenders();
  expect(host.innerHTML).toBe(dom`<div>${text}</div>`);

  render(App({ dynamic: true }), host);
  fireRenders();
  expect(host.innerHTML).toBe(dom`<span>${text}</span>`);
});

test(`${TEST_MARKER} render app in more than one host correctly`, () => {
  const hostOne = document.createElement('div');
  const hostTwo = document.createElement('div');

  const Hello = createComponent(() => <span>hello</span>);
  const Name = createComponent(({ slot }) => <span>{slot}</span>);
  const App = createComponent(({ name }) => {
    return (
      <div>
        <Hello />
        <Name>{name}</Name>
      </div>
    );
  });

  const content = (name: string) => dom`
    <div>
      <span>hello</span>
      <span>${name}</span>
    </div>
  `;

  render(App({ name: 'Alex' }), hostOne);
  render(App({ name: 'Rebecka' }), hostTwo);
  fireRenders();
  expect(hostOne.innerHTML).toBe(content('Alex'));
  expect(hostTwo.innerHTML).toBe(content('Rebecka'));
  jest.advanceTimersByTime(100);
  render(App({ name: 'Mark' }), hostOne);
  render(App({ name: 'Rebecka' }), hostTwo);
  fireRenders();
  expect(hostOne.innerHTML).toBe(content('Mark'));
  expect(hostTwo.innerHTML).toBe(content('Rebecka'));
});
