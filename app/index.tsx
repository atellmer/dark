import runBench from './benchmark/dark';

runBench();
// import { createComponent, Fragment, h, Text, View, memo } from '../src/core';
// import { renderComponent, createPortal } from '../src/platform/browser';

// const domElement = document.getElementById('app');
// const domElement2 = document.getElementById('app2');
// const domElement3 = document.getElementById('app3');

// const div = (props = {}) => View({ ...props, as: 'div' });
// const button = (props = {}) => View({ ...props, as: 'button' });
// const input = (props = {}) => View({ ...props, as: 'input', isVoid: true });

// const SomeComponent = createComponent(({ value }) => {
//   return [
//     div({ slot: Text('I am memo component: ' + value) }),
//   ]
// });

// const Memoized = memo(SomeComponent);

// const App = createComponent(({ value = '' }) => {
//   return [
//     input({
//       value,
//       onInput: (e) => renderComponent(App({ value: e.target.value }), domElement),
//     }),
//     div({ slot: Text('header') }),
//     [Text('123'), Text('321')],
//     div({
//       slot: [
//         div({ slot: Text('content') }),
//         value !== 'close' && SomeComponent({ value }),
//       ]
//     }),
//     div({ slot: Text('footer') }),
//   ]
// })

// renderComponent(App(), domElement);

// // setTimeout(() => {
// //   renderComponent(App(), domElement);
// // }, 2000)