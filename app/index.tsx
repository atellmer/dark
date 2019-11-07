import runBench from './benchmark/dark';

runBench();
// import { createComponent, Fragment, h, Text, View, memo, useState } from '../src/core';
// import { renderComponent, createPortal } from '../src/platform/browser';

// const domElement = document.getElementById('app');

// const div = (props = {}) => View({ ...props, as: 'div' });
// const button = (props = {}) => View({ ...props, as: 'button' });
// const input = (props = {}) => View({ ...props, as: 'input', isVoid: true });

// const SomeComponent = createComponent(({ value = '' }) => {
//   return [
//     div({ slot: Text('I am component: ' + value) }),
//   ]
// });

// const Input = createComponent(() => {
//   const [value1, setValue1] = useState<string>('');
//   const [value2, setValue2] = useState<string>('');

//   return [
//     div({
//       slot: [
//         input({
//           value: value1,
//           onInput: (e) => setValue1(e.target.value),
//         }),
//         input({
//           value: value2,
//           onInput: (e) => setValue2(e.target.value),
//         }),
//         SomeComponent({ value: value1 }),
//         SomeComponent({ value: value2 }),
//       ]
//     }) 
//   ];
// });

// const App = createComponent(() => {
//   //const [value, setValue] = useState<string>('');

//   return [
//     Text('header'),
//     div({ slot: Input() }),
//     Text('footer')
//   ]
// })

// renderComponent(App(), domElement);
