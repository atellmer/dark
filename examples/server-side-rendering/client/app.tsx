import { h, Fragment, createComponent, useState, useEffect } from '@dark-engine/core';

const App = createComponent(() => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('effect...');
  }, []);

  return (
    <>
      <div class='app'>
        <div>Hello World</div>
        <div>count: {count}</div>
        <button class='button' onClick={() => setCount(count + 1)}>
          increment
        </button>
      </div>
    </>
  );
});

export { App };
