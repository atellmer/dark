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
} from '@dark-engine/core';
import { createRoot, useStyle } from '@dark-engine/platform-browser';

// const App = createComponent(() => {
//   const [isOpen, setIsOpen] = useState(false);
//   const {
//     values: [x1, x2],
//   } = useSpring({
//     state: isOpen,
//     animations: [
//       ({ state }) => ({
//         name: 'appearance',
//         mass: 4.7,
//         stiffness: 408,
//         damping: 3,
//         duration: 10000,
//         direction: state ? 'forward' : 'mirrored',
//       }),
//       ({ state }) => ({
//         name: 'rotation',
//         mass: 4.7,
//         stiffness: 408,
//         damping: 3,
//         duration: 20000,
//         direction: state ? 'forward' : 'mirrored',
//       }),
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
//       opacity: ${x1};
//       transform: scale(${x1}) rotate(${360 * x2}deg) translate(-50%, -50%);
//     `,
//   }));

//   return (
//     <>
//       <button onClick={() => setIsOpen(true)}>open</button>
//       <button onClick={() => setIsOpen(false)}>close</button>
//       <button onClick={() => setIsOpen(x => !x)}>toggle</button>
//       <div style={style.root}>{x1.toFixed(4)}</div>
//     </>
//   );
// });

// type IconProps = {
//   size: number;
// };

// const ChevronIcon = createComponent<IconProps>(({ size }) => {
//   return (
//     <svg
//       stroke='currentColor'
//       fill='currentColor'
//       stroke-width='0'
//       viewBox='0 0 512 512'
//       height={size}
//       width={size}
//       filter='drop-shadow( 0px 1px 1px rgba(0, 0, 0, .7))'
//       xmlns='http://www.w3.org/2000/svg'>
//       <path
//         fill='none'
//         stroke-linecap='round'
//         stroke-linejoin='round'
//         stroke-width='48'
//         d='M184 112l144 144-144 144'></path>
//     </svg>
//   );
// });

// const App = createComponent(() => {
//   const items = [
//     'https://www.humanesociety.org/sites/default/files/styles/2000x850/public/2020-07/kitten-510651.jpg?h=f54c7448&itok=lJefJMMQ',
//     'https://www.humanesociety.org/sites/default/files/styles/2000x850/public/2022-08/hl-yp-cats-579652.jpg?h=a0b0b8d2&itok=Ha4SyumM',
//     'https://mediaproxy.salon.com/width/1200/https://media.salon.com/2022/05/cats-party-0516221.jpg',
//     'https://www.purina.co.uk/sites/default/files/2020-12/Understanding%20Your%20Cat%27s%20Body%20LanguageHERO.jpg',
//     'http://www.abcdcatsvets.org/wp-content/uploads/2015/03/cats-new.jpg',
//     'https://www.comfortzone.com/-/media/project/oneweb/comfortzone/images/blog/cats-get-along.jpg?h=706&iar=0&w=1000&hash=8E17E4D11763D7D7F44B5AAC300C3936',
//     'https://www.aspca.org/sites/default/files/cat-care_urine-marking_main-image.jpg',
//     'https://cdn.vox-cdn.com/thumbor/aYGDfifkLdAUzrc4nYTajimX5WI=/0x0:4758x3569/920x613/filters:focal(0x0:4758x3569):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/42021742/8536633928_62a8d4fb3b_o.0.0.jpg',
//   ];
//   const [activeIdx, setActiveIdx] = useState(0);
//   const [isForward, setIsForward] = useState<boolean>(null);
//   const {
//     values: [x],
//   } = useSpring(
//     {
//       state: isForward,
//       mount: true,
//       animations: [
//         () => ({
//           name: 'slide',
//           mass: 4.7,
//           stiffness: 408,
//           damping: 3,
//           duration: 20000,
//         }),
//       ],
//     },
//     [activeIdx],
//   );

//   const style = useStyle(styled => ({
//     root: styled`
//       position: relative;
//       width: 100%;
//       height: 100vh;
//       display: flex;
//     `,
//     slider: styled`
//       position: relative;
//       width: 1200px;
//       height: 800px;
//       max-width: 100%;
//       max-height: 100%;
//       margin: auto;
//     `,
//     content: styled`
//       height: 100%;
//       overflow: hidden;
//       background-color: #000;
//     `,
//     inner: styled`
//       height: 100%;
//       display: flex;
//       transform: translateX(${-100 * activeIdx}%);
//       transition: transform 0.6s ease-in-out;
//     `,
//     item: styled`
//       position: relative;
//       flex: 0 0 auto;
//       width: 100%;
//       height: 100%;
//     `,
//     image: styled`
//       width: 100%;
//       height: 100%;
//       object-fit: cover;
//     `,
//     control: styled`
//       position: absolute;
//       background-color: transparent;
//       border: 0;
//       color: #fff;
//       cursor: pointer;
//       z-index: 10;
//     `,
//     forward: styled`
//       top: 50%;
//       right: 0;
//       transform: translate(0, -50%);
//     `,
//     backward: styled`
//       top: 50%;
//       left: 0;
//       transform: translate(0, -50%) rotate(180deg);
//     `,
//   }));

//   const handlePrev = () => {
//     const isBoundary = activeIdx - 1 < 0;
//     const idx = isBoundary ? items.length - 1 : activeIdx - 1;

//     batch(() => {
//       setActiveIdx(idx);
//       setIsForward(isBoundary);
//     });
//   };

//   const handleNext = () => {
//     const isBoundary = activeIdx + 1 > items.length - 1;
//     const idx = isBoundary ? 0 : activeIdx + 1;

//     batch(() => {
//       setActiveIdx(idx);
//       setIsForward(!isBoundary);
//     });
//   };

//   return (
//     <>
//       <div style={style.root}>
//         <div style={style.slider}>
//           <button style={`${style.control}${style.backward}`} onClick={handlePrev}>
//             <ChevronIcon size={64} />
//           </button>
//           <div style={style.content}>
//             <div style={style.inner}>
//               {items.map((item, idx) => {
//                 const transform = activeIdx === idx ? `transform: scale(${1 + 1 * x}) rotate(${10 * x}deg);` : 'none';

//                 return (
//                   <div key={item + idx} style={`${style.item}${transform}`}>
//                     <img src={item} style={style.image} />
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//           <button style={`${style.control}${style.forward}`} onClick={handleNext}>
//             <ChevronIcon size={64} />
//           </button>
//         </div>
//       </div>
//     </>
//   );
// });

// const App = createComponent(() => {
//   const [isOpen, setIsOpen] = useState(false);
//   const {
//     values: [x],
//     api,
//   } = useSpring({
//     state: isOpen,
//     animations: [
//       () => ({
//         name: 'opacity',
//         mass: 10,
//         stiffness: 1,
//         damping: 1,
//         duration: 5000,
//       }),
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
//   const scope = useMemo(() => ({ items }), []);

//   scope.items = items;

//   const handleRemove = (id: number) => {
//     const idx = scope.items.findIndex(x => x === id);

//     scope.items.splice(idx, 1);
//     setItems([...scope.items]);
//   };

//   return (
//     <>
//       {items.map(x => {
//         return <MemoItem key={x} id={x} onRemove={handleRemove} />;
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
//   const ref = useRef<HTMLDivElement>(null);
//   useSpring({
//     state: true,
//     mount: true,
//     animations: [
//       () => ({
//         name: 'appearance',
//         mass: 1,
//         stiffness: 1,
//         damping: 1,
//         duration: 1000,
//         delay: id * 50,
//       }),
//     ],
//     outside: ([x1]) => {
//       ref.current.style.setProperty('opacity', `${x1}`);
//       ref.current.style.setProperty('transform', `scale(${x1}, 1)`);
//     },
//   });
//   const { api } = useSpring({
//     animations: [
//       () => ({
//         name: 'removing',
//         mass: 1,
//         stiffness: 1,
//         damping: 1,
//         duration: 1000,
//       }),
//     ],
//     outside: ([x2]) => {
//       ref.current.style.setProperty('opacity', `${x2}`);
//       ref.current.style.setProperty('transform', `scale(${x2}, 1)`);

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
//       opacity: 0;
//       transform-origin: 0 0;
//       padding: 6px;
//       margin-bottom: 1px;
//       will-change: transform;
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
  const [isOpen, setIsOpen] = useState(false);
  const [width, setWidth] = useState(CARD_WIDTH);
  const rootRef = useRef<HTMLDivElement>(null);

  const {
    values: [x1, x2, x3, x4],
  } = useSpring(
    {
      state: isOpen,
      animations: [
        () => ({
          name: 'move-button-to-center',
          mass: 1,
          stiffness: 1,
          damping: 1,
          duration: 500,
        }),
        ({ state }) => ({
          name: 'morph-circle-button-to-square',
          mass: 1,
          from: 0,
          to: 50,
          duration: 500,
          direction: state || state === null ? 'backward' : 'forward',
        }),
        () => ({
          name: 'morph-square-button-to-horizaontal-panel',
          mass: 1,
          duration: 500,
        }),
        ({ state, playingIdx }) => ({
          name: 'morph-horizontal-panel-to-card',
          mass: 1,
          duration: 500,
          delay: state || playingIdx > 0 ? 0 : 1200,
        }),
      ],
    },
    [],
  );

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

  const handleOpen = () => setIsOpen(true);

  const handleClose = () => setIsOpen(false);

  const handleToggle = () => setIsOpen(x => !x);

  return (
    <>
      <button onClick={handleToggle}>toggle</button>
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
  const scope = useMemo(() => ({ over: false, delay }), []);
  const [clicks, setClicks] = useState(0);
  scope.delay = delay;
  const {
    values: [x1],
  } = useSpring(
    {
      state: isOpen,
      mount: true,
      animations: [
        () => ({
          name: 'appearance',
          mass: 1,
          duration: 500,
          delay: scope.delay,
        }),
      ],
    },
    [],
  );
  const {
    values: [x2],
    api,
  } = useSpring(
    {
      animations: [
        () => ({
          name: 'hover',
          mass: 4.7,
          stiffness: 408,
          damping: 10,
          duration: 10000,
        }),
      ],
    },
    [],
  );
  const {
    values: [x3],
    api: clickApi,
  } = useSpring(
    {
      animations: [
        () => ({
          name: 'click',
          mass: 4.7,
          stiffness: 408,
          damping: 2,
          duration: 20000,
        }),
      ],
    },
    [],
  );
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
      transform: scale(${1 + 0.5 * x2}) rotate(${(clicks % 2 ? 360 : 720) * x3}deg);
      z-index: ${scope.over ? 2 : 1};
      cursor: pointer;
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

  const handleClick = () => {
    setClicks(x => x + 1);
    clickApi.play('click', 'forward');
  };

  return (
    <div style={style.root} onClick={handleClick} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
      {slot}
    </div>
  );
});

createRoot(document.getElementById('root')).render(<App />);
