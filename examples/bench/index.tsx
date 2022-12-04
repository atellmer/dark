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

// const App = createComponent(() => {
//   const [isOpen, setIsOpen] = useState(false);
//   const animations = useMemo<Array<Animation>>(
//     () => [
//       {
//         name: 'opacity-scale',
//         mass: 10,
//       },
//       {
//         name: 'rotate',
//         mass: 10,
//       },
//     ],
//     [],
//   );
//   const {
//     values: [x1, x2],
//   } = useSpring({ state: isOpen, animations });

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
//       opacity: ${x1};
//       transform: scale(${x1}) rotate(${360 * x2}deg) translate(-50%, -50%);
//     `,
//   }));

//   return (
//     <>
//       <button onClick={() => setIsOpen(true)}>open</button>
//       <button onClick={() => setIsOpen(false)}>close</button>
//       <button onClick={() => setIsOpen(x => !x)}>toggle</button>
//       <div style={style.root}>
//         {x1.toFixed(2)}
//         <br />
//         {x2.toFixed(2)}
//       </div>
//     </>
//   );
// });

// const App = createComponent(() => {
//   const [isOpen, setIsOpen] = useState(false);
//   const animations = useMemo<Array<Animation>>(
//     () => [
//       {
//         name: 'opacity',
//         mass: 10,
//       },
//     ],
//     [],
//   );
//   const {
//     values: [x],
//     api,
//   } = useSpring({ state: isOpen, animations });
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
//       transform: translate(-50%, -50%);
//     `,
//     emoji: styled`
//       position: absolute;
//     `,
//   }));

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
//     Array(100)
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
//   const animations = useMemo<Array<Animation>>(
//     () => [
//       {
//         name: 'item',
//         mass: 10,
//       },
//     ],
//     [],
//   );
//   const { api } = useSpring({
//     animations,
//     outside: ([x]) => {
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
//       opacity: 1;
//       transform-origin: 0 0;
//       padding: 6px;
//       margin-bottom: 1px;
//     `,
//   }));

//   const handleRemove = () => {
//     if (!scope.isRemoved) {
//       scope.isRemoved = true;
//       api.play('item', 'backward');
//     }
//   };

//   return (
//     <div ref={rootRef} style={style.root}>
//       item #{id}
//       <button onClick={handleRemove}>remove</button>
//     </div>
//   );
// });

const App = createComponent(() => {
  const [isOpen, setIsOpen] = useState(null);
  const animations = useMemo<Array<Animation>>(
    () => [
      {
        name: 'to-square',
        mass: 10,
        from: 0,
        to: 50,
        direction: isOpen || isOpen === null ? 'backward' : 'forward',
      },
      {
        name: 'to-right',
        mass: 10,
      },
      {
        name: 'to-bottom',
        mass: 10,
        delay: isOpen ? 0 : 2000,
      },
    ],
    [isOpen],
  );
  const {
    values: [x1, x2, x3],
  } = useSpring({ state: isOpen, skipFirst: true, animations });

  const style = useStyle(styled => ({
    root: styled`
      position: fixed;
      top: 50%;
      left: 50%;
      width: 600px;
      height: 600px;
      background-color: #007ac1;
      color: #fff;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: auto;
      grid-gap: 16px;
      align-items: center;
      transform-origin: -50% -50%;
      transform: scale(${x2 < 0.1 ? 0.1 : x2}, ${x2 < 1 ? 0.1 : x3 < 0.1 ? 0.1 : x3}) translate(-50%, -50%);
      padding: 16px;
      border-radius: ${x1 < 25 ? `${x1 + 10}px` : `${x1}%`};
    `,
  }));

  const handleOpen = () => setIsOpen(true);

  const handleClose = () => setIsOpen(false);

  return (
    <>
      <button onClick={handleOpen}>open</button>
      <button onClick={handleClose}>close</button>
      <div style={style.root}>
        {['😍', '😅', '🥳', '😎', '😈', '🤪', '😳', '🤓', '🍏', '🍌', '🍉', '🍓']
          .filter(_ => x3 === 1)
          .map((item, idx, arr) => {
            const delay = isOpen ? (idx + 1) * 100 : (arr.length - 1 - idx) * 100;

            return (
              <Item key={item} isOpen={isOpen} delay={delay}>
                {item}
              </Item>
            );
          })}
      </div>
    </>
  );
});

type ItemProps = {
  isOpen: boolean;
  delay: number;
  slot: DarkElement;
};

const Item = createComponent<ItemProps>(({ isOpen, delay, slot }) => {
  const animationsOne = useMemo<Array<Animation>>(
    () => [
      {
        name: 'opacity',
        mass: 10,
        delay,
      },
    ],
    [delay],
  );
  const animationsTwo = useMemo<Array<Animation>>(
    () => [
      {
        name: 'hover',
        mass: 100,
      },
    ],
    [],
  );
  const {
    values: [x1],
  } = useSpring({ state: isOpen, animations: animationsOne });
  const {
    values: [x2],
    api,
  } = useSpring({ animations: animationsTwo });
  const scope = useMemo(() => ({ over: false }), []);
  const style = useStyle(styled => ({
    root: styled`
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 4rem;
      line-height: 0;
      opacity: ${x1};
      transform: scale(${1 + 1 * x2});
      z-index: ${scope.over ? 2 : 1};
    `,
  }));

  const handleMouseOver = () => {
    if (!scope.over) {
      scope.over = true;
      api.play('hover', 'forward');
    }
  };

  const handleMouseLeave = () => {
    if (scope.over) {
      scope.over = false;
      api.play('hover', 'backward');
    }
  };

  return (
    <div style={style.root} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
      {slot}
    </div>
  );
});

createRoot(document.getElementById('root')).render(<App />);
