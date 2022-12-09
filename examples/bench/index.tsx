import { h, View, Text, Fragment, createComponent, memo, useCallback, DarkElement } from '@dark-engine/core';
import { createRoot, render } from '@dark-engine/platform-browser';

const host = document.getElementById('root');

type Item = { id: number; name: string };

let nextId = 0;

const generateItems = (count: number) => {
  return Array(count)
    .fill(0)
    .map(x => ({
      id: ++nextId,
      name: nextId.toString(),
    }));
};

const items = generateItems(5);

const render$ = (props = {}) => {
  render(App(props), host);
};

const swap = () => {
  const temp = items[1];

  items[1] = items[items.length - 2];
  items[items.length - 2] = temp;
};

const ListItem = createComponent<Item>(({ id }) => {
  return (
    <>
      <div>{id}: 1</div>
      <div>{id}: 2</div>
    </>
  );
});

const App = createComponent(() => {
  return items.map(x => {
    return <ListItem key={x.id} id={x.id} name={x.name} />;
  });
});

render$();
// expect(host.innerHTML).toBe(content(items));

setTimeout(() => {
  swap();
  render$();
  console.log('items', items);
}, 3000);

// swap();
// render$();
// expect(host.innerHTML).toBe(content(items));
