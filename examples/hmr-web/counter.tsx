import { h, Fragment, createComponent, useState } from '@dark-engine/core';

const Counter = createComponent(() => {
  const [count, setCount] = useState(0);

  const handleClick = () => setCount(count + 1);

  return (
    <>
      <button onClick={handleClick}>fires {count} times</button>
    </>
  );
});

export { Counter };
