import { h, createComponent, useState, useEffect } from '../src/core';
import { render } from '../src/platform/browser';

type TimerProps = {
  slot?: (value: number) => any;
};

const Timer = createComponent<TimerProps>(({ slot }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timerId = setInterval(() => {
      setSeconds(x => x + 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  return slot(seconds);
});

const App = createComponent(() => {
  return [
    <div>Timer component is just logic without view...</div>,
    <Timer>{seconds => <div>timer: {seconds}</div>}</Timer>,
  ];
});

render(App(), document.getElementById('root'));
