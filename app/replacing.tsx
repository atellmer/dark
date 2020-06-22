import {
  h,
  View,
  Text,
  createComponent,
} from '../src/core';
import { render } from '../src/platform/browser';


const div = (...props) => View({ as: 'div', ...props });
const host = document.getElementById('root');
const portal = document.getElementById('root2');

let nextId = 0;

const generateItems = (count: number) => {
  return Array(count).fill(0).map(x => ({
    id: ++nextId,
    name: nextId,
  }));
}

const ListItem = createComponent(({ key, slot }) => {
  return (
    <div key={key}>
      <div>slot: {slot}</div>
    </div>
  );
}, { displayName: 'ListItem' })

const List1 = createComponent(({ items }) => {
  return items.map((x => {
    return (
      <ListItem key={x.id}>
        {x.name}
      </ListItem>
    )
  }))
}, {  displayName: 'List1'});

const List2 = createComponent(({ items }) => {
  return items.map((x => {
    return (
      <ListItem key={x.id}>
        {x.name}
      </ListItem>
    )
  }))
}, {  displayName: 'List2'});

const App = createComponent(({ one, items }) => {

  return [
    <div>header</div>,
    one ? <List1 items={items} /> : <List2 items={items} />,
    <div>footer</div>,
  ]
});

render(App({ one: true, items: generateItems(3) }), host);

setTimeout(() => {
  render(App({ one: false, items: generateItems(3) }), host);
}, 3000)

// setTimeout(() => {
//   render(App({ one: true, items: generateItems(3) }), host);
// }, 5000)

// setTimeout(() => {
//   render(App({ one: false, items: generateItems(3) }), host);
// }, 7000)
