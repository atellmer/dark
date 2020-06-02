import {
  h,
  View,
  Text,
  createComponent,
} from '../src/core';
import { render } from '../src/platform/browser';

const div = (...props) => View({ as: 'div', ...props });
const host = document.getElementById('root');
const host2 = document.getElementById('root2');


const Item = createComponent(({ text }) => {
  return (
    <div>
      Item: {text}
    </div>
  )
});

const List1 = createComponent(() => {
  return [
    Item({ text: 'Alex' }),
    Item({ text: 'Jane' }),
  ]
},{ displayName: 'List1' });

const List2 = createComponent(() => {
  return [
    Item({ text: 'Alex' }),
    Item({ text: 'Denis' }),
    Item({ text: 'John' }),
    Item({ text: 'Jess' }),
  ]
},{ displayName: 'List2' });

const App = createComponent(({ isOpen }) => {
  return [
    isOpen
      ? <List2 />
      : <List1 />,
    <button onClick={() => console.log('click')}>Click me</button>,
  ]
});

render(App({ isOpen: false }), host);

setTimeout(() => {
  render(App({ isOpen: true }), host);
}, 1000)

// setTimeout(() => {
//   render(App({ isOpen: false }), host);
// }, 2000)
