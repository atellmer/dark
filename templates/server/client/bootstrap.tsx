import { h } from '@dark-engine/core';
import { hydrateRoot } from '@dark-engine/platform-browser';

import { App } from './components/app';

function bootstrap() {
  hydrateRoot(document.getElementById('root'), <App />);
}

export { bootstrap };
