import { h, Fragment, component, useEffect, useState } from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';
import { styled } from '@dark-engine/styled';
import { type SpringValue, Animated, useTrail, preset } from '@dark-engine/animations';

type SpringProps = 'x' | 'y';

const App = component(() => {
  const [size, setSize] = useState(10);
  const [springs, api] = useTrail<SpringProps>(size, () => ({
    from: { x: -100, y: -100 },
    config: () => preset('gentle'),
  }));

  useEffect(() => {
    const handler = (e: PointerEvent) => {
      e.preventDefault();
      api.start(() => ({ to: { x: e.pageX, y: e.pageY } }));
    };

    document.addEventListener('pointerdown', handler);
    document.addEventListener('pointermove', handler);

    return () => {
      document.removeEventListener('pointerdown', handler);
      document.removeEventListener('pointermove', handler);
    };
  }, []);

  return (
    <>
      <Panel>
        <button onClick={() => setSize(x => x + 1)}>add ball</button>
        <button onClick={() => setSize(x => (x > 0 ? x - 1 : x))}>remove ball</button>
        <div>{size}</div>
      </Panel>
      {springs.map((spring, idx) => {
        return (
          <Animated key={idx} spring={spring} fn={styleFn(size - idx)}>
            <Item />
          </Animated>
        );
      })}
    </>
  );
});

const styleFn = (zIndex: number) => (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
  element.style.setProperty('transform', `translate3d(${value.x - 25}px, ${value.y - 25}px, 0)`);
  element.style.setProperty('z-index', `${zIndex}`);
};

const Panel = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
  display: inline-block;
  padding: 9px;
  background-color: blue;
  color: #fff;
  z-index: 10000;
`;

const Item = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: purple;
  border: 2px solid #fff;
  touch-action: none;
`;

createRoot(document.getElementById('root')).render(<App />);
