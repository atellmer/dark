import {
  h,
  View,
  Text,
  createComponent,
} from '../src/core';
import { render } from '../src/platform/browser';

const div = (...props) => View({ as: 'div', ...props });
const host = document.getElementById('root');


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

const App = createComponent(() => {
  return [
    Text('it works!'),
    <List />,
  ]
});

render(App(), host);
