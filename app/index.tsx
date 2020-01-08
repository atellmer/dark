import runBench from './benchmark/dark';

runBench();
// import { createComponent, Fragment, h, Text, View, memo, useState, useEffect } from '../src/core';
// import { render, createPortal, useTransitions } from '../src/platform/browser';

// const domElement1 = document.getElementById('app');
// const domElementPortal = document.getElementById('portal');
// const domElement2 = document.getElementById('app2');

// const div = (props = {}) => View({ ...props, as: 'div' });
// const button = (props = {}) => View({ ...props, as: 'button' });
// const input = (props = {}) => View({ ...props, as: 'input', isVoid: true });


// const Component = createComponent(() => {
//   return [
//     div({
//       slot: Text('portal text')
//     })
//   ];
// });

// const App = createComponent(() => {
//   return div({
//     slot: [
//       Component(),
//       createPortal(
//         Component(),
//         domElementPortal,
//       ),
//     ],
//   });
// });


// const StateList = createComponent<{prefix: string}>(({ prefix }) => {
//   const [toggle, setToggle] = useState(false);

//   useEffect(() => {
//     const timerId = setTimeout(() => {
//       setToggle(!toggle);
//     }, 5000);

//     return () => clearTimeout(timerId);
//   }, [toggle]);

//   return (toggle ? [0, 1] : [0]).map(x => {
//     return (<div key={prefix + ':' + x}>{x}</div>);
//   });
// });

// const MemoStateList = memo(StateList);

// const Emoji = createComponent(() => {
//   const [toggle, setToggle] = useState(true);
//   const transitions = useTransitions(toggle, null, {
//     enter: { className: 'animation-fade-in' },
//     leave: { className: 'animation-fade-out' },
//   });

//   useEffect(() => {
//     const intervalId = setTimeout(() => {
//       setToggle(toggle => !toggle);
//     }, 5000);
//     return () => clearTimeout(intervalId);
//   }, [toggle]);

//   return transitions.map(({ item, key, props }) => {
//     return item
//       ? <div
//           key={key}
//           style='font-size: 100px; position: absolute; top: 128px'
//           class={props.className}
//           onAnimationEnd={props.onAnimationEnd}>
//           😄
//         </div>
//       : <div
//           key={key}
//           style='font-size: 100px; position: absolute; top: 128px'
//           class={props.className}
//           onAnimationEnd={props.onAnimationEnd}>
//           🤪
//         </div>
//   })
// });

// const MemoEmoji = memo(Emoji);

// render(App(), domElement1);
