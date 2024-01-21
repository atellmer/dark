import { h } from '@dark-engine/core';
import { hydrateRoot } from '@dark-engine/platform-browser';

import { App } from './components/app';
import { api } from './api';

function bootstrap() {
  const element = document.getElementById('root');

  hydrateRoot(element, <App api={api} />);
}

export { bootstrap };
