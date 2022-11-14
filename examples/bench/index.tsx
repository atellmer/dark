import { h, Fragment, createComponent, useState, useEffect } from '@dark-engine/core';
import { render } from '@dark-engine/platform-browser';

const Item = createComponent(() => {
  useEffect(() => {
    console.log('mount');
    return () => console.log('unmount');
  }, []);

  return <input />;
});

const App = createComponent(() => {
  const [key, setKey] = useState(0);

  return (
    <>
      <div key={key}>
        <Item />
      </div>
      <div>{key}</div>
      <button onClick={() => setKey(key + 1)}>next key</button>
    </>
  );
});

render(App(), document.getElementById('root'));
