import { h, Fragment, component, useState } from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';

const App = component(() => {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Hello Dark: {count}</h1>
      <button onClick={() => setCount(x => x + 1)}>increment!</button>
    </>
  );
});

createRoot(document.getElementById('root')).render(<App />);
