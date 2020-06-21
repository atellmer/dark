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

// const Item = createComponent(({ text }) => {
//   return (
//     <div>
//       <span>
//         Item: {text}
//       </span>
//     </div>
//   )
// });

// const List1 = createComponent(() => {
//   return [
//     Item({ text: 'Alex' }),
//     Item({ text: 'Jane' }),
//   ]
// },{ displayName: 'List1' });

// const List2 = createComponent(() => {
//   return [
//     Item({ text: 'Denis' }),
//     Item({ text: 'John' }),
//     Item({ text: 'Jess' }),
//   ]
// },{ displayName: 'List2' });

const App = createComponent(({ text }) => {

  const handleInput = (e) => {
    render(App({ text: e.target.value }), host);
    render(App({ text: e.target.value }), portal);
  };

  return [
    <div>text: {text}</div>,
    <input value={text} onInput={handleInput} />,
    <div>-----------</div>,
  ]
});

render(App({ text: '' }), host);

//render(App({ text: '' }), portal);

// setTimeout(() => {
//   render(App({ color: 'blue' }), host);
// }, 1000)

