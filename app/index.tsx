import {
  h,
  View,
  Text,
  createComponent,
  Fragment,
} from '../src/core';
import { render } from '../src/platform/browser';
import { useForceUpdate } from '../src/core/fiber';


const div = (...props) => View({ as: 'div', ...props });
const host = document.getElementById('root');
const host2 = document.getElementById('root2');

let nextId = 0;

const generateItems = (count: number) => {
  return Array(count).fill(0).map(x => ({
    id: ++nextId,
    name: nextId,
  }));
};

const ListItem = createComponent(({ key, id, slot, onRemove }) => {
  return (
    <div key={key} class='list-item'>
      <div>slot: {slot}</div>
      <div>
        <button onClick={() => onRemove(id)}>remove</button>
      </div>
    </div>
  );
}, { displayName: 'ListItem' })

const List = createComponent(({ items }) => {
  const handleRemove = (id: number) => {
    const newItems = items.filter(x => x.id !== id);

    render(App({ items: newItems }), host);
  };

  return items.map((x => {
    return (
      <ListItem key={x.id} id={x.id} onRemove={handleRemove}>
        {x.name}
      </ListItem>
    )
  }))
}, { displayName: 'List' });

const App = createComponent<{items: Array<any>;}>(({ items }) => {
  const [update] = useForceUpdate();
  const handleAddItems = () => {
    render(App({ items: [...generateItems(10), ...items] }), host);
  };
  const handleSwap = () => {
    const newItems = [...items];
    newItems[1] = items[items.length - 2];
    newItems[newItems.length - 2] = items[1];

    render(App({ items: newItems }), host);
  };

  const handleIncrement = () => {
    counter++;
    update();
  };

  return [
    <div style='display: flex'>
      <button onClick={handleAddItems}>add items</button>
      <button onClick={handleSwap}>swap</button>
      <button onClick={handleIncrement}>increment</button>
    </div>,
    <div>{counter}</div>,
    <List items={items} host={host} />,
    <div>footer</div>,
  ]
});

let counter = 0;
const items = generateItems(10000);

render(App({ items }), host);

