import { setDefaultHandler, Route, registerRoute } from 'workbox-routing';
import { NetworkOnly, CacheFirst } from 'workbox-strategies';
import { precacheAndRoute } from 'workbox-precaching';
import { offlineFallback } from 'workbox-recipes';

declare const self: typeof globalThis & ServiceWorkerGlobalScope & { __WB_DISABLE_DEV_LOGS: boolean };

self.__WB_DISABLE_DEV_LOGS = true;

setDefaultHandler(new NetworkOnly());
precacheAndRoute(self.__WB_MANIFEST);
offlineFallback({
  pageFallback: '/static/assets/offline.html',
  fontFallback: '/static/assets/fonts/Roboto-Regular.ttf',
});

registerRoute(
  new Route(({ request, sameOrigin }) => {
    return sameOrigin && request.destination === 'image';
  }, new CacheFirst()),
);
