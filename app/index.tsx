import {
  h,
  View,
  Text,
  createComponent,
  Fragment,
  memo,
  useState,
  useCallback,
  useMemo,
} from '../src/core';
import { render, createPortal } from '../src/platform/browser';


const div = (props = {}) => View({ as: 'div', ...props });
const host = document.getElementById('root');
const portal = document.getElementById('root2');

let nextId = 0;

const generateItems = (count: number) => {
  return Array(count).fill(0).map(x => ({
    id: ++nextId,
    name: nextId,
    selected: false,
  }));
};

const ListItem = createComponent(({ id, slot, selected, onSelect, onRemove }) => {

  //console.log('render', id);

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
});

const MemoListItem = memo(ListItem, (props, nextProps) => 
  props.selected !== nextProps.selected
  || props.onSelect !== nextProps.onSelect
  || props.onRemove !== nextProps.onRemove);

const List = createComponent(({ items }) => {
  const handleRemove = useCallback((id: number) => {
    const idx = items.findIndex(x => x.id === id);

    items.splice(idx, 1);
    render(App({ items }), host);
  }, [items]);
  const handleSelect = useCallback((id: number) => {
    const item = items.find(x => x.id === id);

    item.selected = !item.selected;
    render(App({ items }), host);
  }, [items]);

  return (
    <table class='table'>
      <tbody>
      {items.map((x => {
        return (
          <MemoListItem key={x.id} selected={x.selected} id={x.id} onSelect={handleSelect} onRemove={handleRemove}>
            {x.name}
          </MemoListItem>
        )
        }))
      }</tbody>
    </table>
  );
}, { displayName: 'List' });

const Some = createComponent(() => {

  console.log('render');

  return (
    <div>
      <div>{Math.random()}</div>
    </div>
  );
}, { displayName: 'Some' })

const Counter = createComponent(() => {
  const [counter, setCounter] = useState(0);
  const memoized = useMemo(() => {
    return [
      <Some />,
    ];
  }, [counter]);

  const handleClick = useCallback(() => {
    setCounter(counter + 1);
  }, [counter]);

  return [
    Text(`counter: ${counter}`),
    <br />,
    memoized,
    <button onClick={handleClick}>Click me</button>,
  ]
}, { displayName: 'Counter' });


const Wrapper = createComponent(() => {
  return [
    <div>
      {
        createPortal([
          <Counter />,
        ], portal)
      }
    </div>,
  ]
})

const App = createComponent<{items: Array<any>}>(({ items = [] }) => {
  const handleCreate = () => {
    render(App({ items: [...generateItems(10000)] }), host);
  };
  const handleAddItemsToEnd = () => {
    render(App({ items: [...items, ...generateItems(1000)] }), host);
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
    // items.length >= 9 && <Wrapper />,
    <List items={items} />,
  ]
}, { displayName: 'App' });

const items = generateItems(0);

render(App({ items }), host);
