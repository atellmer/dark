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
//   } = useSpring({ state: isOpen, skipFirst: true, animations });

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
//   } = useSpring({ state: isOpen, skipFirst: true, animations });
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
//         mass: 100,
//       },
//     ],
//     [],
//   );
//   const { api } = useSpring({
//     animations,
//     skipFirst: true,
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

type IconProps = {
  size: number;
};

const CloseIcon = createComponent<IconProps>(({ size }) => {
  return (
    <svg
      stroke='currentColor'
      fill='currentColor'
      stroke-width='0'
      viewBox='0 0 1024 1024'
      height={size}
      width={size}
      xmlns='http://www.w3.org/2000/svg'>
      <path d='M685.4 354.8c0-4.4-3.6-8-8-8l-66 .3L512 465.6l-99.3-118.4-66.1-.3c-4.4 0-8 3.5-8 8 0 1.9.7 3.7 1.9 5.2l130.1 155L340.5 670a8.32 8.32 0 0 0-1.9 5.2c0 4.4 3.6 8 8 8l66.1-.3L512 564.4l99.3 118.4 66 .3c4.4 0 8-3.5 8-8 0-1.9-.7-3.7-1.9-5.2L553.5 515l130.1-155c1.2-1.4 1.8-3.3 1.8-5.2z'></path>
      <path d='M512 65C264.6 65 64 265.6 64 513s200.6 448 448 448 448-200.6 448-448S759.4 65 512 65zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z'></path>
    </svg>
  );
});

const AddIcon = createComponent<IconProps>(({ size }) => {
  return (
    <svg
      stroke='currentColor'
      fill='currentColor'
      stroke-width='0'
      viewBox='0 0 24 24'
      height={size}
      width={size}
      xmlns='http://www.w3.org/2000/svg'>
      <path fill='none' stroke-width='2' d='M12,22 L12,2 M2,12 L22,12'></path>
    </svg>
  );
});

const App = createComponent(() => {
  const CARD_WIDTH = 500;
  const CARD_HEIGHT = 500;
  const BUTTON_SIZE = 50;
  const [isOpen, setIsOpen] = useState(null);
  const [width, setWidth] = useState(CARD_WIDTH);
  const rootRef = useRef<HTMLDivElement>(null);
  const animations = useMemo<Array<Animation>>(
    () => [
      {
        name: 'to-center',
        mass: 200,
      },
      {
        name: 'to-square',
        mass: 100,
        from: 0,
        to: 50,
        direction: isOpen || isOpen === null ? 'backward' : 'forward',
      },
      {
        name: 'to-right',
        mass: 100,
      },
      {
        name: 'to-bottom',
        mass: 100,
        delay: isOpen ? 0 : 1600,
      },
    ],
    [isOpen],
  );
  const {
    values: [x1, x2, x3, x4],
  } = useSpring({ state: isOpen, skipFirst: true, animations });

  const style = useStyle(styled => ({
    root: styled`
      position: fixed;
      bottom: ${x1 < 0.05 ? '20px' : `calc(${50 * x1}% - ${(CARD_HEIGHT / 2) * x4}px)`};
      right: ${x1 < 0.05 ? '20px' : `calc(${50 * x1}% - ${(width / 2) * x3}px)`};
      width: ${BUTTON_SIZE + (CARD_WIDTH / 10 - BUTTON_SIZE / 10) * 10 * x3}px;
      height: ${BUTTON_SIZE + (CARD_HEIGHT / 10 - BUTTON_SIZE / 10) * 10 * x4}px;
      max-width: 100%;
      background-color: ${x2 !== 0 || (!isOpen && x4 < 0.5) ? '#ec407a' : '#007ac1'};
      color: #fff;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: auto;
      grid-gap: 16px;
      align-items: center;
      padding: ${x1 !== 1 ? `0px` : `32px`};
      border-radius: ${x2 !== 0 ? `${x2}%` : `${x2 + 10}px`};
      transition: background-color 1s ease-in-out;
      cursor: ${x1 !== 0 ? 'default' : 'pointer'};
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    `,
    close: styled`
      position: absolute;
      top: 0;
      right: 0;
      width: 40px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      background-color: transparent;
      border: 0;
      padding: 4px;
      opacity: ${x3};
      cursor: pointer;
      pointer-events: ${x3 !== 1 ? 'none' : 'auto'};
    `,
    add: styled`
      color: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 0;
      opacity: ${1 - x4};
    `,
  }));

  useEffect(() => {
    const callback = () => {
      const width = window.innerWidth < CARD_WIDTH ? window.innerWidth : CARD_WIDTH;

      setWidth(width);
    };

    window.addEventListener('resize', callback);

    return () => window.removeEventListener('resize', callback);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div ref={rootRef} role='button' style={style.root} onClick={x1 === 0 ? handleOpen : () => {}}>
        {x3 < 0.2 && (
          <div style={style.add}>
            <AddIcon size={24} />
          </div>
        )}
        {x3 > 0 && (
          <button style={style.close} onClick={handleClose}>
            <CloseIcon size={32} />
          </button>
        )}
        {['😍', '😅', '🥳', '😎', '😈', '🤪', '😳', '🤓', '🍏', '🍌', '🍉', '🍓']
          .filter(_ => x4 === 1)
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
        mass: 100,
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
      width: 100%;
      justify-content: center;
      align-items: center;
      font-size: 4rem;
      line-height: 0;
      opacity: ${x1};
      transform: scale(${1 + 0.5 * x2});
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
