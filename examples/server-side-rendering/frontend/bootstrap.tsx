import { h } from '@dark-engine/core';
import { hydrateRoot, createRoot } from '@dark-engine/platform-browser';

import { App } from './components/app';
import { api } from './api';

function bootstrap() {
  const element = document.getElementById('root');
  const isFallback = Boolean(element.getAttribute('data-offline'));
  const content = <App api={api} />;

  if (isFallback) {
    console.log('offline');
    // The application behaves like a Single-Page App (SPA) if it is offline.
    // Offline work is ensured by a cache, which is processed by a service worker as in a regular PWA.
    createRoot(element).render(content);
  } else {
    console.log('online');
    //If we are online, then the application contacts the server for SSR content, then hydrates itself.
    hydrateRoot(element, content);
  }
}

export { bootstrap };
