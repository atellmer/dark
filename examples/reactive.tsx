import { h, Fragment, component, useReactiveState, useEffect } from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';

type State = {
  count: number;
  list: Array<{ count: number }>;
};

const App = component(() => {
  const state = useReactiveState<State>({
    count: 0,
    list: [{ count: 0 }],
  });

  const handleClick = () => {
    state.list.push(createItem());
    state.count++;
  };

  console.log('render', state);

  return (
    <>
      <button onClick={handleClick}>fires {state.count} times</button>
      <ul>
        {state.list.map((x, idx) => {
          return <li key={idx}>item #{x.count}</li>;
        })}
      </ul>
    </>
  );
});

let nextID = 0;

const createItem = () => {
  return {
    count: ++nextID,
  };
};

const root = createRoot(document.getElementById('root'));

root.render(<App />);
