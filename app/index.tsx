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

// let nextId = 0;

// const generateItems = (count: number) => {
//   return Array(count).fill(0).map(x => ({
//     id: ++nextId,
//     name: nextId,
//   }));
// };

// const ListItem = createComponent(({ key, id, slot, onRemove }) => {
//   return (
//     <div key={key} class='list-item'>
//       <div>slot: {slot}</div>
//       <div>
//         <button onClick={() => onRemove(id)}>remove</button>
//       </div>
//     </div>
//   );
// })

// const List = createComponent(({ items }) => {
//   const handleRemove = (id: number) => {
//     const newItems = items.filter(x => x.id !== id);

//     render(App({ items: newItems, host }), host);
//   };

//   return items.map((x => {
//     return (
//       <ListItem key={x.id} id={x.id} onRemove={handleRemove}>
//         {x.name}
//       </ListItem>
//     )
//   }))
// });

// const Counter = createComponent(() => {
//   const[update] = useForceUpdate();

//   const handleIncrement = () => {
//     counter++;
//     update();
//   };

//   return (
//     <div style='display: flex; margin: 20px;'>
//       <button onClick={handleIncrement}>increment</button>
//       {counter > 1 && <div>!!!hello!!!</div>}
//       <div style='margin-left: 20px;'>{counter}</div>
//     </div>
//   );
// }, { displayName: 'Counter' })

// const App = createComponent<{items: Array<any>; host: Element}>(({ items, host }) => {
//   const handleAddItems = () => {
//     render(App({ items: [...generateItems(10), ...items], host }), host);
//   };
//   const handleSwap = () => {
//     const newItems = [...items];
//     newItems[1] = items[items.length - 2];
//     newItems[newItems.length - 2] = items[1];

//     render(App({ items: newItems, host }), host);
//   };

//   return [
//     <div style='display: flex'>
//       <button onClick={handleAddItems}>add items</button>
//       <button onClick={handleSwap}>swap</button>
//     </div>,
//     <Counter />,
//     <List items={items} host={host} />,
//     <div>footer</div>,
//   ]
// });

// const items = generateItems(10);

const Item = createComponent(() => {
  return [
    [<input />],
    <span>zzzz</span>,
  ]
})

const App = createComponent(({ x }) => {

  console.log('render', x);

  return [
    <div>123</div>,
    <Item />,
    <div>xxx</div>,
  ]
});

render(App({ x: 1 }), host);

render(App({ x: 2 }), host);

