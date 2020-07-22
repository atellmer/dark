import {
  h,
  View,
  Text,
  createComponent,
  Fragment,
  useUpdate,
} from '../src/core';
import { render } from '../src/platform/browser';


const div = (props = {}) => View({ as: 'div', ...props });
const host = document.getElementById('root');
const host2 = document.getElementById('root2');

let nextId = 0;

const generateItems = (count: number) => {
  return Array(count).fill(0).map(x => ({
    id: ++nextId,
    name: nextId,
    selected: false,
  }));
};

const ListItem = createComponent(({ id, slot, selected, onSelect, onRemove }) => {
  return (
    <tr class={selected ? 'selected' : ''}>
      <td class='cell'>{slot}</td>
      <td class='cell'>xxx</td>
      <td class='cell'>yyy</td>
      <td class='cell'>
        <button onClick={() => onSelect(id)}>highlight</button>
        <button onClick={() => onRemove(id)}>remove</button>
      </td>
    </tr>
  );
})

const List = createComponent(({ items }) => {
  const handleRemove = (id: number) => {
    const newItems = items.filter(x => x.id !== id);

    render(App({ items: newItems }), host);
  };
  const handleSelect = (id: number) => {
    const newItems = items.map(x => x.id === id ? (x.selected = !x.selected, x) : x);

    render(App({ items: newItems }), host);
  };

  console.log('render sibling');

  return (
    <table class='table'>
      <tbody>
      {items.map((x => {
        return (
          <ListItem key={x.id} selected={x.selected} id={x.id} onSelect={handleSelect} onRemove={handleRemove}>
            {x.name}
          </ListItem>
        )
        }))
      }</tbody>
    </table>
  );
}, { displayName: 'List' });

let count = 0;

const Counter = createComponent(() => {
  const [update] = useUpdate();

  const handleClick = () => {
    count++;
    update();
  };

  console.log('render', count);

  return [
    Text(`count: ${count}`),
    <button onClick={handleClick}>Click me</button>,
    (count === 2 || count === 4) && Text('kuku!'),
  ]
}, { displayName: 'Counter' });

const App = createComponent<{items: Array<any>;}>(({ items = [] }) => {
  const handleCreate = () => {
    render(App({ items: [...generateItems(10)] }), host);
  };
  const handleAddItemsToEnd = () => {
    render(App({ items: [...items, ...generateItems(5)] }), host);
  };
  const handleAddItemsToStart = () => {
    render(App({ items: [...generateItems(1000), ...items] }), host);
  };
  const handleSwap = () => {
    const newItems = [...items];
    newItems[1] = items[items.length - 2];
    newItems[newItems.length - 2] = items[1];

    render(App({ items: newItems }), host);
  };

  return [
    <div style='display: flex'>
      <button onClick={handleCreate}>create</button>
      <button onClick={handleAddItemsToStart}>add items to start</button>
      <button onClick={handleAddItemsToEnd}>add items to end</button>
      <button onClick={handleSwap}>swap</button>
    </div>,
    <Counter />,
    <List items={items} />,
  ]
}, { displayName: 'App' });

let items = generateItems(10);

render(App({ items }), host);
