import { h, Fragment, createComponent, useEffect, useRef, useState, useMemo, useSpring } from '@dark-engine/core';
import { createRoot, useStyle } from '@dark-engine/platform-browser';

const App = createComponent(() => {
  const [isOpen, setIsOpen] = useState<boolean>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const x = useSpring({ state: isOpen });
  const style = useStyle(styled => ({
    root: styled`
      position: fixed;
      top: ${50}%;
      left: ${50}%;
      width: ${800}px;
      height: ${800}px;
      background-color: #007ac1;
      color: #fff;
      font-size: 10rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transform-origin: 0 0;
      pointer-events: none;
      opacity: ${x};
      transform: scale(${x}) translate(-50%, -50%);
    `,
  }));

  return (
    <>
      <button onClick={() => setIsOpen(true)}>open</button>
      <button onClick={() => setIsOpen(false)}>close</button>
      <button onClick={() => setIsOpen(x => !x)}>toggle</button>
      <div ref={rootRef} style={style.root}>
        {x.toFixed(2)}
      </div>
    </>
  );
});

createRoot(document.getElementById('root')).render(<App />);
