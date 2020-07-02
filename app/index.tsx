import {
  h,
  View,
  Text,
  createComponent,
  Fragment,
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
  }));
};

const ListItem = createComponent(({ id, slot, onRemove }) => {
  return (
    <div class='list-item'>
      <div>slot: {slot}</div>
      <div>
        <button onClick={() => onRemove(id)}>remove</button>
      </div>
    </div>
  );
})

const List = createComponent(({ items }) => {
  const handleRemove = (id: number) => {
    const newItems = items.filter(x => x.id !== id);

    render(App({ items: newItems, host }), host);
  };

  return items.map((x => {

    // if (x.id === 2) {
    //   return(
    //     <NestedList key={x.id} x={x} onRemove={handleRemove} />
    //   )
    // }

    return (
      <ListItem key={x.id} id={x.id} onRemove={handleRemove}>
        {x.name}
      </ListItem>
    )
  }))
}, { displayName: 'List' });

const NestedList = createComponent(({ x, onRemove }) => {
  return [
    <ListItem key={`${x.id}:0`} id={x.id} onRemove={onRemove}>
      !!!{x.name}:0!!!
    </ListItem>,
    <ListItem key={`${x.id}:1`} id={x.id} onRemove={onRemove}>
      !!!{x.name}:1!!!
    </ListItem>,
  ];
});

const Counter = createComponent(() => {
  return (
    <div style='display: flex; margin: 20px;'>
      counter
    </div>
  );
}, { displayName: 'Counter' })

const App = createComponent<{items: Array<any>; host: Element}>(({ items, host }) => {
  const handleAddItems = () => {
    const [item1, item2, item3, item4, ...rest] = items;
    render(App({ items: [...generateItems(2), item1, item2, item3, ...generateItems(2), ...rest], host }), host);
    //render(App({ items: [...generateItems(2), ...items], host }), host);
  };
  const handleSwap = () => {
    const newItems = [...items];
    newItems[1] = items[items.length - 2];
    newItems[newItems.length - 2] = items[1];

    render(App({ items: newItems, host }), host);
  };

  return [
    <div style='display: flex'>
      <button onClick={handleAddItems}>add items</button>
      <button onClick={handleSwap}>swap</button>
    </div>,
    <List items={items} host={host} />,
    <div>footer</div>,
  ]
});

const items = generateItems(10);

render(App({ items, host }), host);

