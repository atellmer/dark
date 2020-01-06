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

// const Emoji = createComponent(() => {
//   const [toggle, setToggle] = useState(true);
//   const transitions = useTransitions(toggle, null, {
//     enter: { className: 'animation-fade-in' },
//     leave: { className: 'animation-fade-out' },
//   });

//   useEffect(() => {
//     const intervalId = setTimeout(() => {
//       setToggle(toggle => !toggle);
//     }, 3000);
//     return () => clearTimeout(intervalId);
//   }, [toggle]);

//   return (
//     <Fragment>
//       {
//         transitions.map(({ item, key, props }) => {
//           return item
//             ? <div
//                 key={key}
//                 style='font-size: 300px; position: absolute; top: 64px'
//                 class={props.className}
//                 onAnimationEnd={props.onAnimationEnd}>
//                 😄
//               </div>
//             : <div
//                 key={key}
//                 style='font-size: 300px; position: absolute; top: 64px'
//                 class={props.className}
//                 onAnimationEnd={props.onAnimationEnd}>
//                 🤪
//               </div>
//         })
//       }
//   </Fragment>
//   )
// });

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

// render(App(), domElement1);
