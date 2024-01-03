import { h, Fragment, component, useState } from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';
import { styled } from '@dark-engine/styled';
import { SpringValue, Animated, useTransition } from '@dark-engine/animations';

const next = (current: string) => {
  const map = {
    A: 'B',
    B: 'C',
    C: 'D',
    D: 'A',
  };

  return map[current];
};

const prev = (current: string) => {
  const map = {
    A: 'D',
    B: 'A',
    C: 'B',
    D: 'C',
  };

  return map[current];
};

const colors = {
  A: 'lightpink',
  B: 'lightblue',
  C: 'lightgreen',
  D: 'orchid',
};

type SpringProps = 'opacity' | 'x';

let isNext = true;

const App = component(() => {
  const [items, setItems] = useState(['A']);
  const [transition] = useTransition<SpringProps, string>(
    items,
    x => x,
    () => ({
      from: { opacity: 0, x: isNext ? 100 : -100 },
      enter: { opacity: 1, x: 0 },
      leave: { opacity: 0, x: isNext ? -50 : 50 },
    }),
  );

  return (
    <>
      <button
        onClick={() => {
          isNext = false;
          setItems([prev(items[0])]);
        }}>
        prev
      </button>
      <button
        onClick={() => {
          isNext = true;
          setItems([next(items[0])]);
        }}>
        next
      </button>
      {items[0]}
      <Container>
        {transition(({ spring, item }) => {
          return (
            <Animated spring={spring} fn={styleFn}>
              <Item $color={colors[item]}>{item}</Item>
            </Animated>
          );
        })}
      </Container>
    </>
  );
});

const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
  element.style.setProperty('opacity', `${value.opacity}`);
  element.style.setProperty('transform', `translate3d(${value.x}%, 0, 0)`);
};

const Container = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 500px;
  height: 400px;
  transform: translate(-50%, -50%);
  overflow: hidden;
`;

const Item = styled.div<{ $color: string }>`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  font-size: 10rem;
  justify-content: center;
  align-items: center;
  transform-origin: 0 0;
  background-color: ${p => p.$color};
  color: #fff;
`;

createRoot(document.getElementById('root')).render(<App />);
