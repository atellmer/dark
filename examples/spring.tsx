import {
  h,
  Fragment,
  createComponent,
  useEffect,
  useRef,
  useState,
  useMemo,
  useSpring,
  DarkElement,
  memo,
  batch,
  TaskPriority,
} from '@dark-engine/core';
import { createRoot, useStyle } from '@dark-engine/platform-browser';

// const App = createComponent(() => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [mass, setMass] = useState(1);
//   const [stiffness, setStiffness] = useState(1);
//   const [damping, setDamping] = useState(1);
//   const [duration, setDuration] = useState(1000);
//   const {
//     values: [x1, x2 = 0],
//   } = useSpring(
//     {
//       state: isOpen,
//       getAnimations: ({ state }) => [
//         {
//           name: 'appearance',
//           mass,
//           stiffness,
//           damping,
//           duration,
//           direction: state ? 'forward' : 'mirrored',
//         },
//         {
//           name: 'rotation',
//           mass,
//           stiffness,
//           damping,
//           duration,
//           direction: state ? 'forward' : 'mirrored',
//         },
//       ],
//     },
//     [mass, stiffness, damping, duration],
//   );

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
//       transform: scale(${1 * x1}) rotate(${360 * x2}deg) translate(-50%, -50%);
//     `,
//     input: styled`
//       width: 300px;
//     `,
//   }));

//   return (
//     <>
//       <button onClick={() => setIsOpen(true)}>open</button>
//       <button onClick={() => setIsOpen(false)}>close</button>
//       <button onClick={() => setIsOpen(x => !x)}>toggle</button>
//       <div>
//         <label>
//           mass: {mass}
//           <br />
//           <input
//             type='range'
//             value={mass}
//             style={style.input}
//             min={1}
//             max={10000}
//             onInput={e => setMass(Number(e.target.value))}
//           />
//         </label>
//       </div>
//       <div>
//         <label>
//           stiffness: {stiffness}
//           <br />
//           <input
//             type='range'
//             value={stiffness}
//             style={style.input}
//             min={1}
//             max={10000}
//             onInput={e => setStiffness(Number(e.target.value))}
//           />
//         </label>
//       </div>
//       <div>
//         <label>
//           damping: {damping}
//           <br />
//           <input
//             type='range'
//             value={damping}
//             style={style.input}
//             min={0}
//             max={1000}
//             onInput={e => setDamping(Number(e.target.value))}
//           />
//         </label>
//       </div>
//       <div>
//         <label>
//           duration: {duration}
//           <br />
//           <input
//             type='range'
//             value={duration}
//             style={style.input}
//             min={100}
//             max={100000}
//             onInput={e => setDuration(Number(e.target.value))}
//           />
//         </label>
//       </div>
//       <div style={style.root}>{x1.toFixed(4)}</div>
//     </>
//   );
// });

type IconProps = {
  size: number;
};

const ChevronIcon = createComponent<IconProps>(({ size }) => {
  return (
    <svg
      stroke='currentColor'
      fill='currentColor'
      stroke-width='0'
      viewBox='0 0 512 512'
      height={size}
      width={size}
      filter='drop-shadow( 0px 1px 1px rgba(0, 0, 0, .7))'
      xmlns='http://www.w3.org/2000/svg'>
      <path
        fill='none'
        stroke-linecap='round'
        stroke-linejoin='round'
        stroke-width='48'
        d='M184 112l144 144-144 144'></path>
    </svg>
  );
});

type SpringSliderProps = {
  items: Array<string>;
};

const SpringSlider = createComponent<SpringSliderProps>(({ items }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isForward, setIsForward] = useState<boolean>(null);
  const scope = useMemo(() => ({ x: 100 }), []);
  const ref = useRef<HTMLDivElement>(null);
  const {
    values: [x1],
  } = useSpring(
    {
      state: isForward,
      deps: [activeIdx],
      getAnimations: () => {
        const from = isForward ? (activeIdx - 1) * 100 : activeIdx * 100;
        const to = isForward ? activeIdx * 100 : (activeIdx + 1) * 100;

        return [
          {
            name: 'slide',
            from: isForward === null ? from : isForward ? scope.x : from,
            to: isForward === null ? to : isForward ? to : scope.x,
            mass: 1000,
            duration: 200,
            direction: isForward || isForward === null ? 'forward' : 'backward',
          },
        ];
      },
    },
    [activeIdx],
  );
  const {
    values: [x2],
  } = useSpring(
    {
      state: isForward,
      mount: true,
      deps: [activeIdx],
      getAnimations: () => {
        return [
          {
            name: 'scale',
            mass: 4.7 / 4,
            stiffness: 408 * 1,
            damping: 10 / 2,
            duration: 10000,
          },
        ];
      },
    },
    [activeIdx],
  );
  const {
    values: [x3],
  } = useSpring(
    {
      state: isForward,
      mount: true,
      deps: [activeIdx],
      getAnimations: () => {
        return [
          {
            name: 'rotation',
            mass: 4.7 / 2,
            stiffness: 408 * 1,
            damping: 10 / 3,
            duration: 12000,
            from: 0,
            to: 10,
          },
        ];
      },
    },
    [activeIdx],
  );

  scope.x = x1;

  const style = useStyle(styled => ({
    root: styled`
      position: relative;
      width: 100%;
      height: 100vh;
      display: flex;
    `,
    slider: styled`
      position: relative;
      width: 1200px;
      height: 800px;
      max-width: 100%;
      max-height: 100%;
      margin: auto;
    `,
    content: styled`
      height: 100%;
      overflow: hidden;
      background-color: #000;
    `,
    inner: styled`
      height: 100%;
      display: flex;
      transform: translateX(${-1 * x1}%);
    `,
    item: styled`
      position: relative;
      flex: 0 0 auto;
      width: 100%;
      height: 100%;
    `,
    image: styled`
      width: 100%;
      height: 100%;
      object-fit: cover;
    `,
    control: styled`
      position: absolute;
      background-color: transparent;
      border: 0;
      color: #fff;
      cursor: pointer;
      z-index: 10;
    `,
    forward: styled`
      top: 50%;
      right: 0;
      transform: translate(0, -50%);
    `,
    backward: styled`
      top: 50%;
      left: 0;
      transform: translate(0, -50%) rotate(180deg);
    `,
  }));

  const handlePrev = () => {
    const isBoundary = activeIdx - 1 < 0;
    const idx = isBoundary ? items.length - 1 : activeIdx - 1;

    batch(() => {
      setActiveIdx(idx);
      setIsForward(isBoundary);
    });
  };

  const handleNext = () => {
    const isBoundary = activeIdx + 1 > items.length - 1;
    const idx = isBoundary ? 0 : activeIdx + 1;

    batch(() => {
      setActiveIdx(idx);
      setIsForward(!isBoundary);
    });
  };

  return (
    <div style={style.root}>
      <div style={style.slider}>
        <button style={`${style.control}${style.backward}`} onClick={handlePrev}>
          <ChevronIcon size={64} />
        </button>
        <div style={style.content}>
          <div ref={ref} style={style.inner}>
            {items.map((item, idx) => {
              const transform = `transform: scale(${1 + 0.8 * x2}) rotate(${x3}deg);`;
              const zIndex = idx == activeIdx ? 'z-index: 10;' : '';

              return (
                <div key={item + idx} style={`${style.item}${transform}${zIndex}`}>
                  <img src={item} style={style.image} />
                </div>
              );
            })}
          </div>
        </div>
        <button style={`${style.control}${style.forward}`} onClick={handleNext}>
          <ChevronIcon size={64} />
        </button>
      </div>
    </div>
  );
});

const App = createComponent(() => {
  const items = [
    'https://images.unsplash.com/photo-1669628699191-8ea36457df25?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=765&q=80',
    'https://images.unsplash.com/photo-1669439350109-a8c52e02eb6e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1658908529137-294192db5a5e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1669330230237-a828c49281df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1660823098466-f8c494214ad1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1668293498006-cf8ad7ef2470?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
    'https://images.unsplash.com/photo-1668524140550-09b80b3cddb1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80',
    'https://images.unsplash.com/photo-1663006769363-e9cdcc2b05d6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80g',
  ];

  return (
    <>
      <SpringSlider items={items} />
    </>
  );
});

// const App = createComponent(() => {
//   const [isOpen, setIsOpen] = useState(false);
//   const {
//     values: [x],
//     api,
//   } = useSpring({
//     state: isOpen,
//     getAnimations: () => [
//       {
//         name: 'opacity',
//         mass: 10,
//         stiffness: 1,
//         damping: 1,
//         duration: 5000,
//       },
//     ],
//   });
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
//     Array(1000)
//       .fill(null)
//       .map((_, idx) => idx + 1),
//   );
//   const style = useStyle(styled => ({
//     root: styled`
//       margin: 0 auto;
//       width: 1200px;
//       max-width: 100%;
//     `,
//   }));
//   const scope = useMemo(() => ({ items }), []);

//   scope.items = items;

//   const handleRemove = (id: number) => {
//     const idx = scope.items.findIndex(x => x === id);

//     scope.items.splice(idx, 1);
//     setItems([...scope.items]);
//   };

//   return (
//     <div style={style.root}>
//       {items.map(x => {
//         return <MemoItem key={x} id={x} onRemove={handleRemove} />;
//       })}
//     </div>
//   );
// });

// type ItemProps = {
//   id: number;
//   onRemove: (id: number) => void;
// };

// const Item = createComponent<ItemProps>(({ id, onRemove }) => {
//   const scope = useMemo(() => ({ isRemoved: false }), []);
//   const ref = useRef<HTMLDivElement>(null);
//   const withMount = id <= 30;
//   useSpring({
//     state: true,
//     mount: withMount,
//     getAnimations: () => [
//       {
//         name: 'appearance',
//         mass: 1,
//         stiffness: 1,
//         damping: 1,
//         duration: 1000,
//         delay: id * 50,
//       },
//     ],
//     outside: ([x1]) => {
//       ref.current.style.setProperty('opacity', `${x1}`);
//       ref.current.style.setProperty('transform', `translateX(${-100 * (1 - x1)}%)`);
//     },
//   });
//   const { api } = useSpring({
//     getAnimations: () => [
//       {
//         name: 'removing',
//         mass: 1,
//         stiffness: 1,
//         damping: 1,
//         duration: 1000,
//       },
//     ],
//     outside: ([x2]) => {
//       ref.current.style.setProperty('opacity', `${x2}`);

//       if (scope.isRemoved) {
//         if (x2 > 0) {
//           ref.current.style.setProperty('height', `${48 * x2}px`);
//           ref.current.style.setProperty('padding', `${6 * x2}px`);
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
//       opacity: ${withMount ? 0 : 1};
//       transform-origin: 0 0;
//       padding: 6px;
//       border-bottom: 1px solid #333;
//     `,
//   }));

//   const handleRemove = () => {
//     if (!scope.isRemoved) {
//       scope.isRemoved = true;
//       api.play('removing', 'backward');
//     }
//   };

//   return (
//     <div ref={ref} style={style.root}>
//       item #{id}
//       <button onClick={handleRemove}>remove</button>
//     </div>
//   );
// });

// const MemoItem = memo(Item);

// type IconProps = {
//   size: number;
// };

// const CloseIcon = createComponent<IconProps>(({ size }) => {
//   return (
//     <svg
//       stroke='currentColor'
//       fill='currentColor'
//       stroke-width='0'
//       viewBox='0 0 1024 1024'
//       height={size}
//       width={size}
//       xmlns='http://www.w3.org/2000/svg'>
//       <path d='M685.4 354.8c0-4.4-3.6-8-8-8l-66 .3L512 465.6l-99.3-118.4-66.1-.3c-4.4 0-8 3.5-8 8 0 1.9.7 3.7 1.9 5.2l130.1 155L340.5 670a8.32 8.32 0 0 0-1.9 5.2c0 4.4 3.6 8 8 8l66.1-.3L512 564.4l99.3 118.4 66 .3c4.4 0 8-3.5 8-8 0-1.9-.7-3.7-1.9-5.2L553.5 515l130.1-155c1.2-1.4 1.8-3.3 1.8-5.2z'></path>
//       <path d='M512 65C264.6 65 64 265.6 64 513s200.6 448 448 448 448-200.6 448-448S759.4 65 512 65zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z'></path>
//     </svg>
//   );
// });

// const AddIcon = createComponent<IconProps>(({ size }) => {
//   return (
//     <svg
//       stroke='currentColor'
//       fill='currentColor'
//       stroke-width='0'
//       viewBox='0 0 24 24'
//       height={size}
//       width={size}
//       xmlns='http://www.w3.org/2000/svg'>
//       <path fill='none' stroke-width='2' d='M12,22 L12,2 M2,12 L22,12'></path>
//     </svg>
//   );
// });

// const App = createComponent(() => {
//   const CARD_WIDTH = 500;
//   const CARD_HEIGHT = 500;
//   const BUTTON_SIZE = 50;
//   const [isOpen, setIsOpen] = useState(false, { priority: TaskPriority.HIGH });
//   const [width, setWidth] = useState(CARD_WIDTH);
//   const rootRef = useRef<HTMLDivElement>(null);

//   const {
//     values: [x1, x2, x3, x4],
//   } = useSpring(
//     {
//       state: isOpen,
//       getAnimations: ({ state, playingIdx }) => {
//         return [
//           {
//             name: 'move-button-to-center',
//             mass: 4.7 * 1,
//             stiffness: 408 * 2,
//             damping: 2,
//             duration: 200,
//           },
//           {
//             name: 'morph-circle-button-to-square',

//             mass: 4.7 * 1,
//             stiffness: 408 * 2,
//             damping: 2,
//             duration: 200,
//             from: 0,
//             to: 50,
//             direction: state || state === null ? 'backward' : 'forward',
//           },
//           {
//             name: 'morph-square-button-to-horizaontal-panel',
//             mass: 4.7 * 10,
//             stiffness: 408 * 2,
//             damping: 2,
//             duration: 200,
//           },
//           {
//             name: 'morph-horizontal-panel-to-card',
//             mass: 4.7 * 10,
//             stiffness: 408 * 2,
//             damping: 2,
//             duration: 200,
//             delay: state || playingIdx > 0 ? 0 : 1200,
//           },
//         ];
//       },
//     },
//     [],
//   );

//   const style = useStyle(styled => ({
//     root: styled`
//       position: fixed;
//       bottom: ${x1 < 0.05 ? '20px' : `calc(${50 * x1}% - ${(CARD_HEIGHT / 2) * x4}px)`};
//       right: ${x1 < 0.05 ? '20px' : `calc(${50 * x1}% - ${(width / 2) * x3}px)`};
//       width: ${BUTTON_SIZE + (CARD_WIDTH / 10 - BUTTON_SIZE / 10) * 10 * x3}px;
//       height: ${BUTTON_SIZE + (CARD_HEIGHT / 10 - BUTTON_SIZE / 10) * 10 * x4}px;
//       max-width: 100%;
//       background-color: ${x2 !== 0 || (!isOpen && x4 < 0.5) ? '#ec407a' : '#007ac1'};
//       color: #fff;
//       display: grid;
//       grid-template-columns: 1fr 1fr 1fr;
//       grid-template-rows: auto;
//       grid-gap: 16px;
//       align-items: center;
//       padding: ${x1 !== 1 ? `0px` : `32px`};
//       border-radius: ${x2 !== 0 ? `${x2}%` : `${x2 + 10}px`};
//       transition: background-color 1s ease-in-out;
//       cursor: ${x1 !== 0 ? 'default' : 'pointer'};
//       box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
//     `,
//     controls: styled`
//       position: absolute;
//       top: 0;
//       right: 0;
//       bottom: 0;
//       left: 0;
//     `,
//     close: styled`
//       position: absolute;
//       top: 0;
//       right: 0;
//       width: 40px;
//       height: 40px;
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       color: #fff;
//       background-color: transparent;
//       border: 0;
//       padding: 4px;
//       opacity: ${x3};
//       cursor: pointer;
//       pointer-events: ${x3 !== 1 ? 'none' : 'auto'};
//     `,
//     add: styled`
//       position: absolute;
//       color: #fff;
//       top: 50%;
//       left: 50%;
//       transform: translate(-50%, -50%);
//       font-size: 0;
//       opacity: ${1 - x4};
//     `,
//   }));

//   useEffect(() => {
//     const callback = () => {
//       const width = window.innerWidth < CARD_WIDTH ? window.innerWidth : CARD_WIDTH;

//       setWidth(width);
//     };

//     window.addEventListener('resize', callback);

//     return () => window.removeEventListener('resize', callback);
//   }, []);

//   const handleOpen = () => setIsOpen(true);

//   const handleClose = () => setIsOpen(false);

//   const handleToggle = () => setIsOpen(x => !x);

//   return (
//     <>
//       <button onClick={handleToggle}>toggle</button>
//       <div ref={rootRef} role='button' style={style.root} onClick={x1 === 0 ? handleOpen : () => {}}>
//         <div key='controls' style={style.controls}>
//           {x3 < 0.2 && (
//             <div style={style.add}>
//               <AddIcon size={24} />
//             </div>
//           )}
//           {x3 > 0 && (
//             <button style={style.close} onClick={handleClose}>
//               <CloseIcon size={32} />
//             </button>
//           )}
//         </div>
//         {['😍', '😅', '🥳', '😎', '😈', '🤪', '😳', '🤓', '🍏', '🍌', '🍉', '🍓']
//           .filter(_ => x4 === 1)
//           .map((item, idx, arr) => {
//             const delay = isOpen ? (idx + 1) * 100 : (arr.length - 1 - idx) * 100;

//             return (
//               <Item key={item} isOpen={isOpen} delay={delay}>
//                 {item}
//               </Item>
//             );
//           })}
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
//   const scope = useMemo(() => ({ over: false, delay }), []);
//   const [clicks, setClicks] = useState(0);
//   scope.delay = delay;
//   const {
//     values: [x1],
//   } = useSpring(
//     {
//       state: isOpen,
//       mount: true,
//       getAnimations: () => [
//         {
//           name: 'appearance',
//           mass: 1,
//           duration: 250,
//           delay: scope.delay,
//         },
//       ],
//     },
//     [],
//   );
//   const {
//     values: [x2],
//     api,
//   } = useSpring(
//     {
//       getAnimations: () => [
//         {
//           name: 'hover',
//           mass: 4.7 * 1,
//           stiffness: 408 * 3,
//           damping: 2,
//           duration: 200,
//         },
//       ],
//     },
//     [],
//   );
//   const {
//     values: [x3],
//     api: clickApi,
//   } = useSpring(
//     {
//       getAnimations: () => [
//         {
//           name: 'click',
//           mass: 4.7 * 1,
//           stiffness: 408 * 3,
//           damping: 2,
//           duration: 20000,
//         },
//       ],
//     },
//     [],
//   );
//   const style = useStyle(styled => ({
//     root: styled`
//       position: relative;
//       display: flex;
//       width: 100%;
//       justify-content: center;
//       align-items: center;
//       font-size: 4rem;
//       line-height: 0;
//       opacity: ${x1};
//       transform: scale(${1 + 0.5 * x2}) rotate(${(clicks % 2 ? 360 : 720) * x3}deg);
//       z-index: ${scope.over ? 2 : 1};
//       cursor: pointer;
//       user-select: none;
//     `,
//   }));

//   const handleMouseOver = () => {
//     if (!scope.over) {
//       scope.over = true;
//       api.play('hover', 'forward');
//     }
//   };

//   const handleMouseLeave = () => {
//     if (scope.over) {
//       scope.over = false;
//       api.play('hover', 'backward');
//     }
//   };

//   const handleClick = async () => {
//     setClicks(x => x + 1);
//     console.time('1');
//     await clickApi.play('click', 'forward');
//     console.timeEnd('1');
//   };

//   return (
//     <div style={style.root} onClick={handleClick} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
//       {slot}
//     </div>
//   );
// });

createRoot(document.getElementById('root')).render(<App />);
