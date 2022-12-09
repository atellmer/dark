import { h, View, Text, Fragment, createComponent, memo, useCallback, useState } from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';

const App = createComponent(() => {
  const [show, toggle] = useState(false);

  return [
    <button onClick={() => toggle(x => !x)}>toggle</button>,
    show && [<div>Tadam 1</div>, <div>Tadam 2</div>, <div>Tadam 3</div>],
    <div>footer</div>,
  ];
});

const root = createRoot(document.getElementById('root'));

root.render(<App />);
