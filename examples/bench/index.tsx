import {
  h,
  View,
  Text,
  Fragment,
  createComponent,
  memo,
  useCallback,
  SplitUpdate,
  useSplitUpdate,
  useEffect,
  useState,
} from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';

let nextId = 0;

const generateItems = (count: number) => {
  return Array(count)
    .fill(0)
    .map(x => ({
      id: ++nextId,
      name: nextId.toString(),
    }));
};

type Item = { id: number; name: string };

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
      <List items={items} />
      {items.map((x, idx) => {
        return <div key={`${x.id}:${idx}:0`}>{x.name}</div>;
      })}
      <List items={items} />
      <List items={items} />
      {items.map((x, idx) => {
        return <div key={`${x.id}:${idx}:1`}>{x.name}</div>;
      })}
      <div>footer</div>
    </div>
  );
});

const root = createRoot(document.getElementById('root'));

const render$ = () => {
  root.render(<App items={items} />);
};

render$();

setTimeout(() => {
  moveItems(0, 3);
  render$();
  console.log('items', [...items]);
}, 3000);
