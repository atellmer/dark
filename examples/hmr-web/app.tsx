import { h, Fragment, createComponent } from '@dark-engine/core';

import { Counter } from './counter';

const App = createComponent(() => {
  return (
    <>
      <h1>You can see all updates immediately without page reload</h1>
      <Counter />
    </>
  );
});

export { App };
