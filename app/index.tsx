import runBench from './benchmark/dark';

runBench();
// import { createComponent, Fragment, h, Text, View, memo, useState, useEffect } from '../src/core';
// import { renderComponent, createPortal } from '../src/platform/browser';

// const domElement1 = document.getElementById('app');
// const domElementPortal = document.getElementById('portal');
// const domElement2 = document.getElementById('app2');

// const div = (props = {}) => View({ ...props, as: 'div' });
// const button = (props = {}) => View({ ...props, as: 'button' });
// const input = (props = {}) => View({ ...props, as: 'input', isVoid: true });


// const TextItem = createComponent<{value: string}>(({ value }) => {
//   return [
//     div({
//       slot: [
//         div({ slot: Text(`xxx: ${value}`) })
//       ]
//     }) 
//   ];
// });

// const MemoTextItem = memo(TextItem);

// const App = createComponent(() => {
//   const [value, setValue] = useState<string>('');
//   const [count, setCount] = useState<number>(0);

//   useEffect(() => {
//     const intervalId = setTimeout(() => {
//       setCount(count + 1);
//     }, 1000);

//     return () => clearInterval(intervalId);
//   }, [value]);

//   useEffect(() => {
//     const handleResize = (e) => console.log('resize', e);
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   return [
//     <input
//       value={value}
//       onInput={(e) => setValue(e.target.value)}
//     />,
//     <MemoTextItem value={value} />,
//     Text('count: ' + count)
//   ]
// })

// renderComponent(App(), domElement1);

