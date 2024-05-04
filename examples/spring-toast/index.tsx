import { component, useState } from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';
import { styled } from '@dark-engine/styled';
import { type SpringValue, Animated, useSpring } from '@dark-engine/animations';

type SpringProps = 'opacity' | 'scale';

const App = component(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [spring] = useSpring<SpringProps>(
    {
      from: { opacity: val(isOpen), scale: val(isOpen) },
      to: { opacity: val(isOpen), scale: val(isOpen) },
      config: key => ({ tension: key === 'scale' ? 200 : isOpen ? 100 : 400 }),
    },
    [isOpen],
  );

  return (
    <>
      <button onClick={() => setIsOpen(x => !x)}>toggle</button>
      <Animated spring={spring} fn={styleFn}>
        <Box>Hello world</Box>
      </Animated>
    </>
  );
});

const val = (isOpen: boolean) => (isOpen ? 1 : 0);
const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
  const { opacity, scale } = value;

  element.style.setProperty('opacity', `${opacity}`);
  element.style.setProperty('transform', `scale(${scale}) translate(-50%, -50%)`);
};

const Box = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 200px;
  background-color: #c8e6c9;
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transform-origin: 0 0;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  will-change: opacity, transform; // very useful!
`;

createRoot(document.getElementById('root')).render(<App />);
