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

const List = createComponent(() => {
  return [
    Item({ text: 'xxx' }),
    Item({ text: 'zzz' }),
  ]
});

const App = createComponent(({ title }) => {
  return [
    Text(title),
    <List />,
    <button onClick={() => console.log('click')}>Click me</button>,
  ]
});

render(App({ title: 'first' }), host);

// setTimeout(() => {
//   console.log('---');
//   render(App({ title: 'second' }), host);
// }, 1000)
