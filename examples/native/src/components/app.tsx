import { h, createComponent, useState } from '@dark-engine/core';

const App = createComponent(() => {
  const [count, setCount] = useState(0);

  console.log('render', count);

  return (
    <frame>
      <page xmlns='http://schemas.nativescript.org/tns.xsd' actionBarHidden>
        <stack-layout>
          <label>Hello world: {count}</label>
          <button class='button' onTap={() => setCount(count + 1)}>
            fired {count} times
          </button>
        </stack-layout>
      </page>
    </frame>
  );
});

export default App;
