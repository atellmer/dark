import { h, Fragment, createComponent, useState, useEffect, type DarkElement } from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';

type TimerProps = {
  slot: (value: number) => DarkElement;
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
  return (
    <>
      <div>Timer component is just a logic component without view...</div>,
      <Timer>{seconds => <div>timer: {seconds}</div>}</Timer>,
    </>
  );
});

createRoot(document.getElementById('root')).render(App());
