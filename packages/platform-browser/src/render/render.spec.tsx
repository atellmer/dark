/** @jsx h */
import { dom, createTestHostNode, createEmptyCommentString } from '@test-utils';
import { h, createComponent, View, Text, Comment, DarkElement } from '@dark-engine/core';
import { render } from './render';

type Item = { id: number; name: string };

let host: HTMLElement = null;
const div = (props = {}) => View({ ...props, as: 'div' });
const span = (props = {}) => View({ ...props, as: 'span' });
const emptyComment = createEmptyCommentString();
let nextId = 0;

const generateItems = (count: number) => {
  return Array(count)
    .fill(0)
    .map(x => ({
      id: ++nextId,
      name: nextId.toString(),
    }));
};

beforeEach(() => {
  nextId = 0;
  host = createTestHostNode();
});

describe('[render]', () => {
  test('doesn not throw error', () => {
    const App = createComponent(() => null);
    const render$ = () => {
      render(App(), host);
    };

    expect(render$).not.toThrowError();
  });

  test('can render text correctly', () => {
    const content = 'hello';
    const App = createComponent(() => Text(content));

    render(App(), host);
    expect(host.innerHTML).toBe(content);
  });

  test('can render tag correctly', () => {
    const content = `<div></div>`;
    const App = createComponent(() => div());

    render(App(), host);
    expect(host.innerHTML).toBe(content);
  });

  test('can render comment correctly', () => {
    const content = 'some comment';
    const App = createComponent(() => Comment(content));

    render(App(), host);
    expect(host.innerHTML).toBe(`<!--${content}-->`);
  });

  test('can render array of items correctly', () => {
    const content = dom`
      <div></div>
      <div></div>
      <div></div>
    `;
    const App = createComponent(() => [div(), div(), div()]);

    render(App(), host);
    expect(host.innerHTML).toBe(content);
  });

  test('conditional rendering works correctly with replacing components', () => {
    type AppProps = {
      items: Array<Item>;
      one: boolean;
    };

    type ListItemProps = {
      slot: DarkElement;
    };

    const content = (items: AppProps['items']) => dom`
      <div>header</div>
      ${items.map(x => `<div>${x.name}</div>`).join('')}
      <div>footer</div>
    `;

    const render$ = (props: AppProps) => {
      render(App(props), host);
    };

    const ListItem = createComponent<ListItemProps>(({ slot }) => {
      return div({
        slot,
      });
    });

    const ListOne = createComponent<{ items: AppProps['items'] }>(({ items }) => {
      return items.map(x => {
        return ListItem({
          key: x.id,
          slot: Text(x.name),
        });
      });
    });

    const ListTwo = createComponent<{ items: AppProps['items'] }>(({ items }) => {
      return items.map(x => {
        return ListItem({
          key: x.id,
          slot: Text(x.name),
        });
      });
    });

    const App = createComponent<AppProps>(({ one, items }) => {
      return [
        div({ slot: Text('header') }),
        one ? ListOne({ items }) : ListTwo({ items }),
        div({ slot: Text('footer') }),
      ];
    });

    let items = generateItems(3);

    render$({ one: true, items });
    expect(host.innerHTML).toBe(content(items));

    items = generateItems(3);
    render$({ one: false, items });
    expect(host.innerHTML).toBe(content(items));

    items = generateItems(4);
    render$({ one: true, items });
    expect(host.innerHTML).toBe(content(items));

    items = generateItems(2);
    render$({ one: false, items });
    expect(host.innerHTML).toBe(content(items));
  });

  test('conditional rendering works correctly with nullable elements', () => {
    type AppProps = {
      flag: boolean;
    };

    const render$ = (props: AppProps) => {
      render(App(props), host);
    };

    const App = createComponent<AppProps>(({ flag }) => {
      return [div({ slot: Text('header') }), flag && div({ slot: Text('hello') }), div({ slot: Text('footer') })];
    });

    const content = (flag: boolean) => dom`
      <div>header</div>
      ${flag ? '<div>hello</div>' : emptyComment}
      <div>footer</div>
    `;

    render$({ flag: false });
    expect(host.innerHTML).toBe(content(false));

    render$({ flag: true });
    expect(host.innerHTML).toBe(content(true));

    render$({ flag: false });
    expect(host.innerHTML).toBe(content(false));

    render$({ flag: true });
    expect(host.innerHTML).toBe(content(true));
  });

  describe('[adding/removing/swaping nodes]', () => {
    type AppProps = {
      items: Array<Item>;
    };
    type ListItemProps = {
      slot: DarkElement;
    };
    const itemAttrName = 'data-item';
    let items = [];

    const ListItem = createComponent<ListItemProps>(({ slot }) => {
      return div({
        [itemAttrName]: true,
        slot,
      });
    });

    const List = createComponent<AppProps>(({ items }) => {
      return items.map(x => {
        return ListItem({
          key: x.id,
          slot: Text(x.name),
        });
      });
    });

    const App = createComponent<AppProps>(({ items }) => {
      return [div({ slot: Text('header') }), List({ items }), div({ slot: Text('footer') })];
    });

    const render$ = () => {
      render(App({ items }), host);
    };

    const content = (items: Array<Item>) => dom`
      <div>header</div>
      ${items.length > 0 ? items.map(x => `<div ${itemAttrName}="true">${x.name}</div>`).join('') : emptyComment}
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

    test('can add nodes', () => {
      items = generateItems(5);
      render$();
      expect(host.innerHTML).toBe(content(items));

      addItemsToEnd(5);
      render$();
      expect(host.innerHTML).toBe(content(items));

      addItemsToStart(6);
      render$();
      expect(host.innerHTML).toBe(content(items));
    });

    test('nodes not recreated after adding', () => {
      items = generateItems(5);
      render$();

      const nodes = Array.from(host.querySelectorAll(`[${itemAttrName}]`));
      const node = nodes[0];
      const expected = node.textContent;
      const count = 4;

      addItemsToStart(count);
      render$();

      const newNodes = Array.from(host.querySelectorAll(`[${itemAttrName}]`));
      const newNode = newNodes[count];

      expect(node).toStrictEqual(newNode);
      expect(node.textContent).toBe(expected);
    });

    test('can insert nodes to different places', () => {
      items = generateItems(10);
      render$();
      expect(host.innerHTML).toBe(content(items));
      insertNodesInDifferentPlaces();
      render$();
      expect(host.innerHTML).toBe(content(items));
    });

    test('can remove nodes', () => {
      items = generateItems(10);
      render$();
      expect(host.innerHTML).toBe(content(items));

      removeItem(6);
      render$();
      expect(host.innerHTML).toBe(content(items));

      removeItem(5);
      removeItem(1);
      render$();
      expect(host.innerHTML).toBe(content(items));

      items = [];
      render$();
      expect(host.innerHTML).toBe(content(items));
    });

    test('nodes not recreated after removing', () => {
      items = generateItems(10);
      render$();

      const nodes = Array.from(host.querySelectorAll(`[${itemAttrName}]`));
      const node = nodes[8];
      const expected = node.textContent;

      removeItem(6);
      render$();
      const newNodes = Array.from(host.querySelectorAll(`[${itemAttrName}]`));

      expect(node).toBe(newNodes[7]);
      expect(node.textContent).toBe(expected);
    });

    test('can remove last nodes', () => {
      items = generateItems(10);
      render$();
      items.pop();
      items.pop();
      render$();
      expect(host.innerHTML).toBe(content(items));
    });

    test('can swap nodes', () => {
      items = generateItems(10);
      render$();

      const nodes = Array.from(host.querySelectorAll(`[${itemAttrName}]`));
      const nodeOne = nodes[1];
      const nodeTwo = nodes[8];

      expect(nodeOne.textContent).toBe('2');
      expect(nodeTwo.textContent).toBe('9');

      swapItems();
      render$();

      const newNodes = Array.from(host.querySelectorAll(`[${itemAttrName}]`));
      const newNodeOne = newNodes[8];
      const newNodeTwo = newNodes[1];

      expect(newNodeOne.textContent).toBe('2');
      expect(newNodeTwo.textContent).toBe('9');
    });
  });

  describe('[list of items]', () => {
    test('can render a simple array', () => {
      const content = dom`
        <div></div>
        <div></div>
        <div></div>
      `;
      const App = createComponent(() => [div(), div(), div()]);

      render(App(), host);
      expect(host.innerHTML).toBe(content);
    });

    test('can render arrays of any nesting', () => {
      const content = dom`
        <div></div>
        <div></div>
        <div></div>
        <div id="one"></div>
        <div id="two"></div>
        <div></div>
      `;

      const Item = createComponent(() => {
        return [[[div({ id: 'one' })]], div({ id: 'two' })];
      });

      const App = createComponent(() => [[[[div()], [[div()]], div()]], [Item()], div()]);

      render(App(), host);
      expect(host.innerHTML).toBe(content);
    });
  });

  test('can render nested array as component', () => {
    type AppProps = {
      count: number;
    };
    const content = (count: number) => dom`
      <div>1</div>
      <div>2</div>
      ${Array(count)
        .fill(0)
        .map((_, idx) => `<p>${idx}</p>`)
        .join('')}
      <div>3</div>
    `;

    const render$ = (props: AppProps) => {
      render(App(props), host);
    };

    const NestedArray = createComponent<AppProps>(({ count }) => {
      return Array(count)
        .fill(0)
        .map((_, idx) => <p key={idx}>{idx}</p>);
    });

    const App = createComponent<AppProps>(({ count }) => [
      <div>1</div>,
      <div>2</div>,
      <NestedArray count={count} />,
      <div>3</div>,
    ]);

    render$({ count: 3 });
    expect(host.innerHTML).toBe(content(3));

    render$({ count: 5 });
    expect(host.innerHTML).toBe(content(5));

    render$({ count: 1 });
    expect(host.innerHTML).toBe(content(1));
  });

  test('can render dynamic tag', () => {
    type AppProps = {
      dynamic: boolean;
    };
    const text = 'I am dynamic tag';
    const App = createComponent<AppProps>(({ dynamic }) => {
      const Tag = dynamic ? span : div;

      return Tag({ slot: Text(text) });
    });

    const render$ = (props: AppProps) => {
      render(App(props), host);
    };

    render$({ dynamic: false });
    expect(host.innerHTML).toBe(dom`<div>${text}</div>`);

    render$({ dynamic: true });
    expect(host.innerHTML).toBe(dom`<span>${text}</span>`);

    render$({ dynamic: false });
    expect(host.innerHTML).toBe(dom`<div>${text}</div>`);
  });

  test('can work with JSX', () => {
    type AppProps = {
      dynamic: boolean;
    };

    const text = 'I am dynamic tag';

    const render$ = (props: AppProps) => {
      render(App(props), host);
    };

    const CustomItem = createComponent(({ slot }) => {
      return <span>{slot}</span>;
    });

    const App = createComponent<AppProps>(({ dynamic }) => {
      const Tag = dynamic ? CustomItem : 'div';

      return <Tag>{text}</Tag>;
    });

    render$({ dynamic: false });
    expect(host.innerHTML).toBe(dom`<div>${text}</div>`);

    render$({ dynamic: true });
    expect(host.innerHTML).toBe(dom`<span>${text}</span>`);

    render$({ dynamic: false });
    expect(host.innerHTML).toBe(dom`<div>${text}</div>`);
  });

  test('can render app to more than one host', () => {
    const hostOne = document.createElement('div');
    const hostTwo = document.createElement('div');

    type AppProps = {
      name: string;
    };

    type NameProps = {
      slot: DarkElement;
    };

    const render$ = (props: AppProps, host: HTMLElement) => {
      render(App(props), host);
    };

    const Hello = createComponent(() => <span>hello</span>);
    const Name = createComponent<NameProps>(({ slot }) => <span>{slot}</span>);
    const App = createComponent<AppProps>(({ name }) => {
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

    render$({ name: 'Alex' }, hostOne);
    render$({ name: 'Rebecka' }, hostTwo);
    expect(hostOne.innerHTML).toBe(content('Alex'));
    expect(hostTwo.innerHTML).toBe(content('Rebecka'));

    render$({ name: 'Mark' }, hostOne);
    render$({ name: 'Rebecka' }, hostTwo);
    expect(hostOne.innerHTML).toBe(content('Mark'));
    expect(hostTwo.innerHTML).toBe(content('Rebecka'));
  });

  test('can swap arrays of nodes', () => {
    const items = generateItems(5);

    const content = (items: Array<Item>) => {
      return dom`
      ${items
        .map(
          x => `
            <div>1: ${x.id}</div>
            <div>2: ${x.id}</div>
          `,
        )
        .join('')}
    `;
    };

    const render$ = (props = {}) => {
      render(List(props), host);
    };

    const swap = () => {
      const temp = items[1];

      items[1] = items[items.length - 2];
      items[items.length - 2] = temp;
    };

    const ListItem = createComponent<Item>(({ id }) => {
      return [<div>1: {id}</div>, <div>2: {id}</div>];
    });

    const List = createComponent(() => {
      return items.map(x => {
        return <ListItem key={x.id} id={x.id} name={x.name} />;
      });
    });

    render$();
    expect(host.innerHTML).toBe(content(items));

    swap();
    render$();
    expect(host.innerHTML).toBe(content(items));

    swap();
    render$();
    expect(host.innerHTML).toBe(content(items));
  });

  test('can remove indexed nodes', () => {
    let items = generateItems(5);

    const content = (items: Array<Item>) => {
      return dom`
      ${items
        .map(
          x => `
            <div>1: ${x.id}</div>
          `,
        )
        .join('')}
    `;
    };

    const render$ = (props = {}) => {
      render(List(props), host);
    };

    const remove = () => {
      items = [];
    };

    const ListItem = createComponent<Item>(({ id }) => {
      return [<div>1: {id}</div>];
    });

    const List = createComponent(() => {
      return items.map((x, idx) => {
        return <ListItem key={idx} id={x.id} name={x.name} />;
      });
    });

    render$();
    expect(host.innerHTML).toBe(content(items));

    remove();
    render$();
    expect(host.innerHTML).toBe(emptyComment);
  });
});
