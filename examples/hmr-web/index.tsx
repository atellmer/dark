import { h, hot } from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';

import { App } from './app';

const root = createRoot(document.getElementById('root'));

// enable HMR
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept('./app', () => {
    hot(() => root.render(<App />));
  });
}

root.render(<App />);
