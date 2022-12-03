import { h, Fragment, createComponent, useEffect, useRef, useState, useMemo, useSpring } from '@dark-engine/core';
import { createRoot, useStyle } from '@dark-engine/platform-browser';

// const App = createComponent(() => {
//   const [isOpen, setIsOpen] = useState<boolean>(null);
//   const { value: x1, trail } = useSpring({ state: isOpen, mass: 1 });
//   const { value: x2, filterToggle, mapToggle } = useSpring({ state: trail, mass: 1 });
//   const style = useStyle(styled => ({
//     root: styled`
//       position: fixed;
//       top: ${50}%;
//       left: ${50}%;
//       width: ${800}px;
//       height: ${800}px;
//       background-color: #007ac1;
//       color: #fff;
//       font-size: 10rem;
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       transform-origin: 0 0;
//       pointer-events: none;
//       opacity: ${1};
//       transform: scale(${1}) translate(-50%, -50%);
//     `,
//     emoji: styled`
//       position: absolute;
//     `,
//   }));

//   return (
//     <>
//       <button onClick={() => setIsOpen(true)}>open</button>
//       <button onClick={() => setIsOpen(false)}>close</button>
//       <button onClick={() => setIsOpen(x => !x)}>toggle</button>
//       <div style={style.root}>
//         {['😊', '😆']
//           .filter((_, idx) => filterToggle(x2, idx))
//           .map((x, idx, arr) => {
//             const opacity = mapToggle(x2, arr.length, idx);

//             return (
//               <span key={idx} style={style.emoji + `opacity: ${opacity}`}>
//                 {x}
//               </span>
//             );
//           })}
//       </div>
//     </>
//   );
// });

const App = createComponent(() => {
  const [items, setItems] = useState(() => [1, 2, 3, 4, 5]);

  const handleRemove = (id: number) => {
    const idx = items.findIndex(x => x === id);

    items.splice(idx, 1);
    setItems([...items]);
  };

  // return (
  //   <>
  //     {items.map(x => {
  //       return <Item key={x} id={x} onRemove={handleRemove} />;
  //     })}
  //   </>
  // );

  return (
    <>
      {items.map(x => {
        return (
          <div key={x}>
            {x}
            <button onClick={() => handleRemove(x)}>remove</button>
          </div>
        );
      })}
    </>
  );
});

type ItemProps = {
  id: number;
  onRemove: (id: number) => void;
};

const Item = createComponent<ItemProps>(({ id, onRemove }) => {
  return (
    <div>
      {id}
      <button onClick={() => onRemove(id)}>remove</button>
    </div>
  );
});

createRoot(document.getElementById('root')).render(<App />);
