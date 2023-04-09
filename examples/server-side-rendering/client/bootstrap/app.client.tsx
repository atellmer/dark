import { hydrateRoot, createRoot } from '@dark-engine/platform-browser';

import { App, type AppProps } from '../components/app';

function bootstrap(hydrate = false, props: AppProps = {}) {
  hydrate
    ? hydrateRoot(document.getElementById('root'), App(props))
    : createRoot(document.getElementById('root')).render(App(props));
}

export { bootstrap };
