import {
  h,
  View,
  Text,
  createComponent,
  Fragment,
} from '../src/core';
import { render } from '../src/platform/browser';


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
  const Tag = key === 9 ? 'p' : 'div';

  return (
    <Tag key={key} class='list-item'>
      <div>slot: {slot}</div>
      <div>
        <button onClick={() => onRemove(id)}>remove</button>
      </div>
    </Tag>
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

const App = createComponent<{items: Array<any>}>(({ items }) => {
  const handleAddItems = () => {
    render(App({ items: [...generateItems(3), ...items] }), host);
  };
  const handleSwap = () => {
    const newItems = [...items];
    newItems[1] = items[items.length - 2];
    newItems[newItems.length - 2] = items[1];

    render(App({ items: newItems }), host);
  };

  return [
    <div style='display: flex'>
      <button onClick={handleAddItems}>add items</button>
      <button onClick={handleSwap}>swap</button>
    </div>,
    <List items={items} />,
    // items.length === 5 &&
    // [[
    //   [<div>1</div>],
    //   <div>2</div>,
    //   <div>3</div>,
    // ]],
    <div>footer</div>,
  ]
});

const items = generateItems(10);

render(App({ items }), host);

