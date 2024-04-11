import { hydrateRoot } from '@dark-engine/platform-browser';

import { App } from './components/app';
import { api } from './api';

function bootstrap() {
  hydrateRoot(document.getElementById('root'), <App api={api} />);
}

export { bootstrap };
