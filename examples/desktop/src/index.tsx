import { h, hot } from '@dark-engine/core';
import { render } from '@dark-engine/platform-desktop';

import App from './app';

// enable HMR
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept('./app', () => {
    hot(() => render(<App />));
  });
}

render(<App />);
