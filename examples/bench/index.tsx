import { h, View, Text, Fragment, createComponent, memo, useCallback, DarkElement } from '@dark-engine/core';
import { createRoot, render } from '@dark-engine/platform-browser';

const host = document.getElementById('root');
const div = (props = {}) => View({ ...props, as: 'div' });
type Item = { id: number; name: string };
type AppProps = {
  items: Array<Item>;
};

type ListProps = {
  items: Array<Item>;
};

type ListItemProps = {
  slot: DarkElement;
};
let nextId = 0;

const generateItems = (count: number) => {
  return Array(count)
    .fill(0)
    .map(x => ({
      id: ++nextId,
      name: nextId.toString(),
    }));
};

const itemAttrName = 'data-item';
let items = [];

items = generateItems(10);

const ListItem = createComponent<ListItemProps>(
  ({ slot }) => {
    return <div data-item='true'>{slot}</div>;
  },
  { displayName: 'ListItem' },
);

const List = createComponent<ListProps>(
  ({ items }) => {
    return items.map(x => {
      return <ListItem key={x.id}>{x.name}</ListItem>;
    });
  },
  { displayName: 'List' },
);

const App = createComponent<AppProps>(({ items }) => {
  return (
    <>
      <div>header</div>
      <List items={items} />
      <div>footer</div>
    </>
  );
});

const render$ = () => {
  render(App({ items }), host);
};

const swapItems = () => {
  const newItems = [...items];

  newItems[1] = items[items.length - 2];
  newItems[newItems.length - 2] = items[1];
  items = newItems;
};

render$();

const nodes = Array.from(host.querySelectorAll(`[${itemAttrName}]`));
const nodeOne = nodes[1];
const nodeTwo = nodes[8];

// console.log('nodeOne', nodeOne);
// console.log('nodeTwo', nodeTwo);
// console.log('---');

// expect(nodeOne.textContent).toBe('2');
// expect(nodeTwo.textContent).toBe('9');

setTimeout(() => {
  swapItems();
  render$();

  const newNodes = Array.from(host.querySelectorAll(`[${itemAttrName}]`));
  const newNodeOne = newNodes[8];
  const newNodeTwo = newNodes[1];

  // console.log('newNodeOne', newNodeOne);
  // console.log('newNodeTwo', newNodeTwo);
  // console.log('---');

  // expect(newNodeOne.textContent).toBe('2');
  // expect(newNodeTwo.textContent).toBe('9');
}, 3000);
