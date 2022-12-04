import {
  h,
  Fragment,
  createComponent,
  useEffect,
  useRef,
  useState,
  useUpdate,
  useMemo,
  useSpring,
  Animation,
  useLayoutEffect,
  DarkElement,
  batch,
} from '@dark-engine/core';
import { createRoot, useStyle } from '@dark-engine/platform-browser';

const App = createComponent(() => {
  const [isOpen, setIsOpen] = useState(false);
  const animations = useMemo<Array<Animation>>(
    () => [
      {
        name: 'scale',
        mass: 10,
      },
      {
        name: 'rotate',
        mass: 10,
      },
    ],
    [],
  );
  const {
    items: [x1, x2],
  } = useSpring({ state: isOpen, animations });

  const style = useStyle(styled => ({
    root: styled`
      position: fixed;
      top: 50%;
      left: 50%;
      width: 800px;
      height: 800px;
      background-color: #007ac1;
      color: #fff;
      font-size: 10rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transform-origin: 0 0;
      pointer-events: none;
      opacity: ${x1};
      transform: scale(${x1}) rotate(${360 * x2}deg) translate(-50%, -50%);
    `,
  }));

  return (
    <>
      <button onClick={() => setIsOpen(true)}>open</button>
      <button onClick={() => setIsOpen(false)}>close</button>
      <button onClick={() => setIsOpen(x => !x)}>toggle</button>
      <div style={style.root}>
        {x1.toFixed(2)}
        <br />
        {x2.toFixed(2)}
      </div>
    </>
  );
});

// const App = createComponent(() => {
//   const [isOpen, setIsOpen] = useState(false);
//   const { x, api } = useSpring({ state: isOpen, mass: 10 });
//   const style = useStyle(styled => ({
//     root: styled`
//       position: fixed;
//       top: 50%;
//       left: 50%;
//       width: 800px;
//       height: 800px;
//       background-color: #007ac1;
//       color: #fff;
//       font-size: 10rem;
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       transform-origin: 0 0;
//       pointer-events: none;
//       opacity: 1;
//       transform: scale(1) translate(-50%, -50%);
//     `,
//     emoji: styled`
//       position: absolute;
//     `,
//   }));

//   useEffect(() => {
//     setIsOpen(true);
//   }, []);

//   const toggle = () => setIsOpen(!isOpen);

//   return (
//     <>
//       <button onClick={toggle}>toggle</button>
//       <div style={style.root}>
//         {['😊', '😆']
//           .filter((_, idx) => api.toggle.filter(x, idx))
//           .map((item, idx, arr) => {
//             const opacity = api.toggle.map(x, arr.length, idx);

//             return (
//               <span key={idx} style={style.emoji + `opacity: ${opacity}`}>
//                 {item}
//               </span>
//             );
//           })}
//       </div>
//     </>
//   );
// });

// const App = createComponent(() => {
//   const [items, setItems] = useState(() =>
//     Array(1000)
//       .fill(null)
//       .map((_, idx) => idx + 1),
//   );

//   const handleRemove = (id: number) => {
//     const idx = items.findIndex(x => x === id);

//     items.splice(idx, 1);
//     setItems([...items]);
//   };

//   return (
//     <>
//       {items.map(x => {
//         return <Item key={x} id={x} onRemove={handleRemove} />;
//       })}
//     </>
//   );
// });

// type ItemProps = {
//   id: number;
//   onRemove: (id: number) => void;
// };

// const Item = createComponent<ItemProps>(({ id, onRemove }) => {
//   const scope = useMemo(() => ({ isRemoved: false }), []);
//   const rootRef = useRef<HTMLDivElement>(null);
//   const { ref, api } = useSpring({
//     mass: 100,
//     runOutside: x => {
//       rootRef.current.style.setProperty('opacity', `${x}`);
//       rootRef.current.style.setProperty('transform', `scale(${x}, 1)`);

//       if (scope.isRemoved) {
//         if (x > 0) {
//           rootRef.current.style.setProperty('height', `${48 * x}px`);
//           rootRef.current.style.setProperty('padding', `${6 * x}px`);
//         } else {
//           onRemove(id);
//         }
//       }
//     },
//   });
//   const style = useStyle(styled => ({
//     root: styled`
//       width: 100%;
//       height: 48px;
//       background-color: #007ac1;
//       color: #fff;
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       opacity: 0;
//       transform-origin: 0 0;
//       padding: 6px;
//       margin-bottom: 1px;
//     `,
//   }));

//   useLayoutEffect(() => {
//     ref.current = rootRef.current;
//   }, []);

//   useEffect(() => {
//     api.run(true);
//   }, []);

//   const handleRemove = () => {
//     scope.isRemoved = true;
//     api.run(false);
//   };

//   return (
//     <div ref={rootRef} style={style.root}>
//       item #{id}
//       <button onClick={handleRemove}>remove</button>
//     </div>
//   );
// });

// const App = createComponent(() => {
//   const [isOpen, setIsOpen] = useState(null);
//   const [isClosing, setIsClosing] = useState(false);

//   const delay1 = isClosing ? 1700 : isOpen ? 0 : 400;
//   const delay2 = isClosing ? 1200 : isOpen ? 400 : 0;

//   const { x: x1 } = useSpring({ state: isOpen, delay: delay1, mass: 100 });
//   const { x: x2 } = useSpring({ state: isOpen, delay: delay2, mass: 100 });

//   const style = useStyle(styled => ({
//     root: styled`
//       position: fixed;
//       top: 50%;
//       left: 50%;
//       width: 400px;
//       height: 400px;
//       background-color: #007ac1;
//       color: #fff;
//       display: grid;
//       grid-template-columns: 1fr 1fr;
//       grid-template-rows: auto;
//       grid-gap: 16px;
//       align-items: center;
//       transform-origin: -50% -50%;
//       transform: scale(${x1}, ${x1 < 1 ? 0.1 : x2 < 0.1 ? 0.1 : x2}) translate(-50%, -50%);
//       padding: 16px;
//       border-radius: ${10 * x1}px;
//     `,
//   }));

//   const handleOpen = () => {
//     batch(() => {
//       setIsClosing(false);
//       setIsOpen(true);
//     });
//   };

//   const handleClose = () => {
//     batch(() => {
//       setIsClosing(true);
//       setIsOpen(false);
//     });
//   };

//   return (
//     <>
//       <button onClick={handleOpen}>open</button>
//       <button onClick={handleClose}>close</button>
//       <div style={style.root}>
//         {['😍', '😅', '🥳', '😎', '😈', '🤪', '😳', '🤓'].map((item, idx, arr) => {
//           const delay = isOpen ? 700 + (idx + 1) * 100 : (arr.length - 1 - idx) * 100;

//           return (
//             <Item key={item} isOpen={isOpen} delay={delay}>
//               {item}
//             </Item>
//           );
//         })}
//       </div>
//     </>
//   );
// });

// type ItemProps = {
//   isOpen: boolean;
//   delay: number;
//   slot: DarkElement;
// };

// const Item = createComponent<ItemProps>(({ isOpen, delay, slot }) => {
//   const { x: x1 } = useSpring({ state: isOpen, delay, mass: 100 });
//   const style = useStyle(styled => ({
//     root: styled`
//       font-size: 3.5rem;
//       text-align: center;
//       opacity: ${x1};
//     `,
//   }));

//   return <div style={style.root}>{slot}</div>;
// });

createRoot(document.getElementById('root')).render(<App />);
