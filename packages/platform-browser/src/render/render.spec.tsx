/** @jsx h */
import { dom, createTestHostNode, createReplacerString } from '@test-utils';
import {
  h,
  Fragment,
  createComponent,
  View,
  Text,
  Comment,
  useState,
  memo,
  useUpdate,
  useRef,
  type MutableRef,
  type DarkElement,
} from '@dark-engine/core';
import { render } from './render';

type Item = { id: number; name: string };

let host: HTMLElement = null;
const div = (props = {}) => View({ ...props, as: 'div' });
const span = (props = {}) => View({ ...props, as: 'span' });
const replacer = createReplacerString();
let nextId = 0;

const generateItems = (count: number) => {
  return Array(count)
    .fill(0)
    .map(_ => ({
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

  test('can render tag correctly', () => {
    const content = `<div></div>`;

    render(div(), host);
    expect(host.innerHTML).toBe(content);
  });

  test('can render text correctly', () => {
    const content = 'hello';

    render(Text(content), host);
    expect(host.innerHTML).toBe(content);
  });

  test('can render comment correctly', () => {
    const content = 'some comment';

    render(Comment(content), host);
    expect(host.innerHTML).toBe(`<!--${content}-->`);
  });

  test('can render nullable correctly', () => {
    render(null, host);
    expect(host.innerHTML).toBe(replacer);

    render('', host);
    expect(host.innerHTML).toBe(replacer);

    render(0, host);
    expect(host.innerHTML).toBe(replacer);

    render(false, host);
    expect(host.innerHTML).toBe(replacer);

    render(undefined, host);
    expect(host.innerHTML).toBe(replacer);
  });

  test('can render nested tags correctly', () => {
    const content = () => dom`
      <div>
        <div>
          <div>ola</div>
        </div>
      </div>
    `;

    render(div({ slot: div({ slot: div({ slot: Text('ola') }) }) }), host);
    expect(host.innerHTML).toBe(content());
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

  test('can prevent xss attacks', () => {
    render(Text(`<script>alert('xss')</script>`), host);
    expect(host.innerHTML).toBe(`&lt;script&gt;alert('xss')&lt;/script&gt;`);
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
      show: boolean;
    };

    const render$ = (props: AppProps) => {
      render(App(props), host);
    };

    const App = createComponent<AppProps>(({ show }) => {
      return [div({ slot: Text('header') }), show && div({ slot: Text('hello') }), div({ slot: Text('footer') })];
    });

    const content = (show: boolean) => dom`
      <div>header</div>
      ${show ? '<div>hello</div>' : replacer}
      <div>footer</div>
    `;

    render$({ show: false });
    expect(host.innerHTML).toBe(content(false));

    render$({ show: true });
    expect(host.innerHTML).toBe(content(true));

    render$({ show: false });
    expect(host.innerHTML).toBe(content(false));

    render$({ show: true });
    expect(host.innerHTML).toBe(content(true));
  });

  describe('[adding/removing/swaping nodes #1]', () => {
    type AppProps = {
      items: Array<Item>;
    };

    type ListItemProps = {
      slot: DarkElement;
    };

    const itemAttr = 'data-item';
    let items = [];

    const ListItem = createComponent<ListItemProps>(({ slot }) => {
      return div({
        [itemAttr]: true,
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
      ${items.length > 0 ? items.map(x => `<div ${itemAttr}="true">${x.name}</div>`).join('') : replacer}
      <div>footer</div>
    `;

    const addItemsToEnd = (count: number) => {
      items = [...items, ...generateItems(count)];
    };
    const addItemsToStart = (count: number) => {
      items = [...generateItems(count), ...items];
    };
    const insertNodesInDifferentPlaces = () => {
      const [item1, item2, _, ...rest] = items;

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

      const nodes = Array.from(host.querySelectorAll(`[${itemAttr}]`));
      const node = nodes[0];
      const expected = node.textContent;
      const count = 4;

      addItemsToStart(count);
      render$();

      const newNodes = Array.from(host.querySelectorAll(`[${itemAttr}]`));
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

      const nodes = Array.from(host.querySelectorAll(`[${itemAttr}]`));
      const node = nodes[8];
      const expected = node.textContent;

      removeItem(6);
      render$();
      const newNodes = Array.from(host.querySelectorAll(`[${itemAttr}]`));

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

      const nodes = Array.from(host.querySelectorAll(`[${itemAttr}]`));
      const nodeOne = nodes[1];
      const nodeTwo = nodes[8];

      expect(nodeOne.textContent).toBe('2');
      expect(nodeTwo.textContent).toBe('9');

      swapItems();
      render$();

      const newNodes = Array.from(host.querySelectorAll(`[${itemAttr}]`));
      const newNodeOne = newNodes[8];
      const newNodeTwo = newNodes[1];

      expect(newNodeOne.textContent).toBe('2');
      expect(newNodeTwo.textContent).toBe('9');
    });
  });

  describe('[adding/removing/swaping nodes #2]', () => {
    type AppProps = {
      items: Array<Item>;
    };

    const itemAttrName = 'data-item';
    let items = [];

    const List = createComponent<AppProps>(({ items }) => {
      return items.map(x => {
        return div({
          key: x.id,
          [itemAttrName]: true,
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
      ${items.length > 0 ? items.map(x => `<div ${itemAttrName}="true">${x.name}</div>`).join('') : replacer}
      <div>footer</div>
    `;

    const addItemsToEnd = (count: number) => {
      items = [...items, ...generateItems(count)];
    };
    const addItemsToStart = (count: number) => {
      items = [...generateItems(count), ...items];
    };
    const insertNodesInDifferentPlaces = () => {
      const [item1, item2, _, ...rest] = items;

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

    test('node recreates when key changed', () => {
      type AppProps = {
        x: number;
      };

      const render$ = (props: AppProps) => {
        render(App(props), host);
      };

      let ref: MutableRef<HTMLDivElement> = null;
      let node: HTMLDivElement = null;

      const App = createComponent<AppProps>(({ x }) => {
        ref = useRef<HTMLDivElement>(null);

        return div({ ref, key: x });
      });

      render$({ x: 1 });
      node = ref.current;
      expect(node).toBeInstanceOf(HTMLDivElement);

      render$({ x: 1 });
      expect(ref.current).toBe(node);

      render$({ x: 2 });
      expect(ref.current).not.toBe(node);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
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

  test('can render app into more than one host', () => {
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
    expect(host.innerHTML).toBe(replacer);
  });

  test(`conditional rendering works correctly with hook's update`, () => {
    const content$ = (show: boolean) => dom`
      ${
        show
          ? `
        <div>1*</div>
        <div>2*</div>
        <div>3*</div>
      `
          : `${replacer}`
      }
      <button>toggle</button>
    `;
    const content = (show1: boolean, show2: boolean) => dom`
      ${content$(show1)}
      ${content$(show2)}
    `;

    let setShow1: (value: boolean) => void;
    let setShow2: (value: boolean) => void;

    type BoxProps = {
      n: number;
    };

    const Box = createComponent<BoxProps>(({ n }) => {
      const [show, setShow] = useState(true);

      const handleClick = () => setShow(x => !x);

      if (n === 1) {
        setShow1 = setShow;
      } else if (n === 2) {
        setShow2 = setShow;
      }

      return (
        <>
          {show && (
            <>
              <div>1*</div>
              <div>2*</div>
              <div>3*</div>
            </>
          )}
          <button onClick={handleClick}>toggle</button>
        </>
      );
    });

    const App = createComponent(() => {
      return (
        <>
          <Box n={1} />
          <Box n={2} />
        </>
      );
    });

    render(<App />, host);
    expect(host.innerHTML).toBe(content(true, true));

    setShow1(false);
    expect(host.innerHTML).toBe(content(false, true));

    setShow2(false);
    expect(host.innerHTML).toBe(content(false, false));

    setShow1(true);
    expect(host.innerHTML).toBe(content(true, false));

    setShow2(true);
    expect(host.innerHTML).toBe(content(true, true));

    setShow1(false);
    setShow2(false);
    expect(host.innerHTML).toBe(content(false, false));

    setShow1(true);
    setShow2(true);
    expect(host.innerHTML).toBe(content(true, true));

    setShow1(false);
    setShow2(false);
    expect(host.innerHTML).toBe(content(false, false));

    setShow1(true);
    setShow2(true);
    expect(host.innerHTML).toBe(content(true, true));
  });

  test('can move elements', () => {
    type AppProps = {
      items: Array<Item>;
    };

    let items = generateItems(10);

    const content = (items: Array<Item>) => dom`
      ${items.map(x => `<div>${x.name}</div>`).join('')}
    `;

    const prepend = (n: number) => {
      items = [...generateItems(n), ...items];
    };

    const append = (n: number) => {
      items = [...items, ...generateItems(n)];
    };

    const remove = (n: number) => {
      items.splice(n, 1);
      items = [...items];
    };

    const shuffle = () => {
      items = [8, 2, 101, 1, 3, 6, 7, 103, 5, 10, 102].map(x => ({
        id: x,
        name: x + '',
      }));
    };

    const App = createComponent<AppProps>(({ items }) => {
      return items.map(x => <div key={x.id}>{x.name}</div>);
    });

    render(<App items={items} />, host);
    expect(host.innerHTML).toBe(content(items));

    prepend(2);
    render(<App items={items} />, host);
    expect(host.innerHTML).toBe(content(items));

    append(2);
    render(<App items={items} />, host);
    expect(host.innerHTML).toBe(content(items));

    shuffle();
    render(<App items={items} />, host);
    expect(host.innerHTML).toBe(content(items));

    prepend(4);
    append(3);
    remove(9);
    remove(2);
    render(<App items={items} />, host);
    expect(host.innerHTML).toBe(content(items));

    shuffle();
    render(<App items={items} />, host);
    expect(host.innerHTML).toBe(content(items));
  });

  test('can move components', () => {
    type AppProps = {
      items: Array<Item>;
    };

    type ItemProps = {
      item: Item;
    };

    let items = generateItems(10);

    const content = (items: Array<Item>) => dom`
      ${items.map(x => `<div>${x.name}</div>`).join('')}
    `;

    const prepend = (n: number) => {
      items = [...generateItems(n), ...items];
    };

    const append = (n: number) => {
      items = [...items, ...generateItems(n)];
    };

    const remove = (n: number) => {
      items.splice(n, 1);
      items = [...items];
    };

    const shuffle = () => {
      items = [8, 2, 101, 1, 3, 6, 7, 103, 5, 10, 102].map(x => ({
        id: x,
        name: x + '',
      }));
    };

    const Item = createComponent<ItemProps>(({ item }) => {
      return <div>{item.name}</div>;
    });

    const App = createComponent<AppProps>(({ items }) => {
      return items.map(x => <Item key={x.id} item={x} />);
    });

    render(<App items={items} />, host);
    expect(host.innerHTML).toBe(content(items));

    prepend(2);
    render(<App items={items} />, host);
    expect(host.innerHTML).toBe(content(items));

    append(2);
    render(<App items={items} />, host);
    expect(host.innerHTML).toBe(content(items));

    shuffle();
    render(<App items={items} />, host);
    expect(host.innerHTML).toBe(content(items));

    prepend(4);
    append(3);
    remove(9);
    remove(2);
    render(<App items={items} />, host);
    expect(host.innerHTML).toBe(content(items));

    shuffle();
    render(<App items={items} />, host);
    expect(host.innerHTML).toBe(content(items));
  });

  test('can move memo components', () => {
    type AppProps = {
      items: Array<Item>;
    };

    type ItemProps = {
      item: Item;
    };

    let items = generateItems(10);

    const content = (items: Array<Item>) => dom`
      ${items.map(x => `<div>${x.name}</div>`).join('')}
    `;

    const prepend = (n: number) => {
      items = [...generateItems(n), ...items];
    };

    const append = (n: number) => {
      items = [...items, ...generateItems(n)];
    };

    const remove = (n: number) => {
      items.splice(n, 1);
      items = [...items];
    };

    const shuffle = () => {
      items = [8, 2, 101, 1, 3, 6, 7, 103, 5, 10, 102].map(x => ({
        id: x,
        name: x + '',
      }));
    };

    const Item = memo(
      createComponent<ItemProps>(({ item }) => {
        return <div>{item.name}</div>;
      }),
    );

    const App = createComponent<AppProps>(({ items }) => {
      return items.map(x => <Item key={x.id} item={x} />);
    });

    render(<App items={items} />, host);
    expect(host.innerHTML).toBe(content(items));

    prepend(2);
    render(<App items={items} />, host);
    expect(host.innerHTML).toBe(content(items));

    append(2);
    render(<App items={items} />, host);
    expect(host.innerHTML).toBe(content(items));

    shuffle();
    render(<App items={items} />, host);
    expect(host.innerHTML).toBe(content(items));

    prepend(4);
    append(3);
    remove(9);
    remove(2);
    render(<App items={items} />, host);
    expect(host.innerHTML).toBe(content(items));

    shuffle();
    render(<App items={items} />, host);
    expect(host.innerHTML).toBe(content(items));
  });

  test('can move components with child arrays', () => {
    type AppProps = {
      items: Array<Item>;
    };

    type ItemProps = {
      item: Item;
    };

    let items = generateItems(10);

    const content = (items: Array<Item>) => dom`
      ${items
        .map(
          x => dom`
        <div>${x.name}</div>
        <div>1 *</div>
        <div>2 *</div>
      `,
        )
        .join('')}
    `;

    const prepend = (n: number) => {
      items = [...generateItems(n), ...items];
    };

    const append = (n: number) => {
      items = [...items, ...generateItems(n)];
    };

    const remove = (n: number) => {
      items.splice(n, 1);
      items = [...items];
    };

    const shuffle = () => {
      items = [8, 2, 101, 1, 3, 6, 7, 103, 5, 10, 102].map(x => ({
        id: x,
        name: x + '',
      }));
    };

    const Item = createComponent<ItemProps>(({ item }) => {
      return (
        <>
          <div>{item.name}</div>
          <div>1 *</div>
          <div>2 *</div>
        </>
      );
    });

    const App = createComponent<AppProps>(({ items }) => {
      return items.map(x => <Item key={x.id} item={x} />);
    });

    render(<App items={items} />, host);
    expect(host.innerHTML).toBe(content(items));

    prepend(2);
    render(<App items={items} />, host);
    expect(host.innerHTML).toBe(content(items));

    append(2);
    render(<App items={items} />, host);
    expect(host.innerHTML).toBe(content(items));

    shuffle();
    render(<App items={items} />, host);
    expect(host.innerHTML).toBe(content(items));

    prepend(4);
    append(3);
    remove(9);
    remove(2);
    render(<App items={items} />, host);
    expect(host.innerHTML).toBe(content(items));

    shuffle();
    render(<App items={items} />, host);
    expect(host.innerHTML).toBe(content(items));
  });

  test(`can move components with child arrays hook's update`, () => {
    type AppProps = {
      show?: boolean;
    };

    type ItemProps = {
      item: Item;
    };

    let items = generateItems(10);

    const content = (items: Array<Item>, show: boolean) => dom`
      ${
        show
          ? dom`
          <div>header 1</div>
          <div>header 2</div>
      `
          : replacer
      }
      ${items
        .map(
          x => dom`
        <div>${x.name}</div>
        <div>1 *</div>
        <div>2 *</div>
      `,
        )
        .join('')}
      ${
        show
          ? dom`
          <div>footer 1</div>
          <div>footer 2</div>
      `
          : replacer
      }
    `;

    const prepend = (n: number) => {
      items = [...generateItems(n), ...items];
    };

    const append = (n: number) => {
      items = [...items, ...generateItems(n)];
    };

    const remove = (n: number) => {
      items.splice(n, 1);
      items = [...items];
    };

    const shuffle = () => {
      items = [8, 2, 101, 1, 3, 6, 7, 103, 5, 10, 102].map(x => ({
        id: x,
        name: x + '',
      }));
    };

    let updateList: () => void;

    const Item = createComponent<ItemProps>(({ item }) => {
      return (
        <>
          <div>{item.name}</div>
          <div>1 *</div>
          <div>2 *</div>
        </>
      );
    });

    const List = memo(
      createComponent(() => {
        const update = useUpdate();

        updateList = update;

        return items.map(x => <Item key={x.id} item={x} />);
      }),
    );

    const App = createComponent<AppProps>(({ show }) => {
      return (
        <>
          {show && (
            <>
              <div>header 1</div>
              <div>header 2</div>
            </>
          )}
          <List />
          {show && (
            <>
              <div>footer 1</div>
              <div>footer 2</div>
            </>
          )}
        </>
      );
    });

    const render$ = (props: AppProps) => {
      render(<App {...props} />, host);
    };

    render$({ show: false });
    expect(host.innerHTML).toBe(content(items, false));

    render$({ show: true });
    expect(host.innerHTML).toBe(content(items, true));

    prepend(2);
    updateList();
    expect(host.innerHTML).toBe(content(items, true));

    render$({ show: true });
    expect(host.innerHTML).toBe(content(items, true));

    append(2);
    updateList();
    expect(host.innerHTML).toBe(content(items, true));

    render$({ show: true });
    expect(host.innerHTML).toBe(content(items, true));

    render$({ show: false });
    shuffle();
    updateList();
    expect(host.innerHTML).toBe(content(items, false));

    render$({ show: true });
    remove(9);
    remove(2);
    updateList();
    expect(host.innerHTML).toBe(content(items, true));

    shuffle();
    updateList();
    expect(host.innerHTML).toBe(content(items, true));

    render$({ show: true });
    expect(host.innerHTML).toBe(content(items, true));

    render$({ show: false });
    expect(host.innerHTML).toBe(content(items, false));
  });

  test('can move items in arrays', () => {
    const content$ = (items: Array<Item>) => dom`
      ${items.map(x => ` <div>${x.name}</div>`).join('')}
    `;
    const content = (items: Array<Item>) => dom`
      <div>
        <div>header 1</div>
        <div>header 2</div>
        ${content$(items)}
        ${content$(items)}
        ${content$(items)}
        ${content$(items)}
        ${content$(items)}
        ${content$(items)}
        <div>footer</div>
      </div>
    `;

    type AppProps = {
      items: Array<Item>;
    };

    let items = generateItems(10);

    const moveItems = (idx: number, count: number) => {
      const newItems = [...items];
      const temps = Array(count)
        .fill(null)
        .map((_, x) => newItems[idx + x]);
      newItems.splice(idx, temps.length);
      newItems.splice(idx > newItems.length - temps.length ? 0 : idx + 1, 0, ...temps);

      items = newItems;
    };

    const List = createComponent<AppProps>(({ items }) => {
      return items.map(x => {
        return <div key={x.id}>{x.name}</div>;
      });
    });

    const App = createComponent<AppProps>(({ items }) => {
      return (
        <div>
          <div>header 1</div>
          <div>header 2</div>
          <List items={items} />
          {items.map(x => {
            return <div key={x.id + ':0'}>{x.name}</div>;
          })}
          {items.map(x => {
            return <div key={x.id + ':1'}>{x.name}</div>;
          })}
          <List items={items} />
          <List items={items} />
          <>
            {items.map(x => {
              return <div key={x.id}>{x.name}</div>;
            })}
          </>
          <div>footer</div>
        </div>
      );
    });

    const render$ = () => {
      render(<App items={items} />, host);
    };

    render$();
    expect(host.innerHTML).toBe(content(items));

    moveItems(0, 3);
    render$();
    expect(host.innerHTML).toBe(content(items));
  });

  test('can render falsy items with container correctly #1', () => {
    const content = () => dom`
      <main>
        <div>header</div>
        ${replacer}
        <div>footer</div>
      </main>
    `;

    type ContainerProps = {
      slot: DarkElement;
    };

    const Container = createComponent<ContainerProps>(({ slot }) => {
      return <main>{slot}</main>;
    });

    const App = createComponent(() => {
      return (
        <Container>
          <div>header</div>
          {false}
          <div>footer</div>
        </Container>
      );
    });

    const render$ = () => render(<App />, host);

    render$();
    expect(host.innerHTML).toBe(content());
  });

  test('can render falsy items with container correctly #2', () => {
    const content = () => dom`
      <main>
        ${replacer}
        <div>header</div>
        <div>footer</div>
      </main>
    `;

    type ContainerProps = {
      slot: DarkElement;
    };

    const Container = createComponent<ContainerProps>(({ slot }) => {
      return <main>{slot}</main>;
    });

    const App = createComponent(() => {
      return (
        <Container>
          {false}
          <div>header</div>
          <div>footer</div>
        </Container>
      );
    });

    const render$ = () => render(<App />, host);

    render$();
    expect(host.innerHTML).toBe(content());
  });
});
