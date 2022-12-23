import { h } from '@dark-engine/core';
import { hydrateRoot } from '@dark-engine/platform-browser';

import { App } from './app';

hydrateRoot(document.getElementById('root'), <App />);
