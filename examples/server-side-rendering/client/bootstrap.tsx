import { h } from '@dark-engine/core';
import { hydrateRoot } from '@dark-engine/platform-browser';

import { type AppProps, App } from './components/app';

function bootstrap(props: AppProps = {}) {
  hydrateRoot(document.getElementById('root'), <App {...props} />);
}

export { bootstrap };
