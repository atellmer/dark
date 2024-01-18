import { setDefaultHandler, Route, registerRoute } from 'workbox-routing';
import { NetworkOnly, CacheFirst } from 'workbox-strategies';
import { precacheAndRoute } from 'workbox-precaching';
import { offlineFallback } from 'workbox-recipes';

declare const self: typeof globalThis & ServiceWorkerGlobalScope;

setDefaultHandler(new NetworkOnly());
precacheAndRoute(self.__WB_MANIFEST);
offlineFallback({ pageFallback: '/assets/offline.html' });

registerRoute(
  new Route(({ request, sameOrigin }) => {
    return sameOrigin && request.destination === 'image';
  }, new CacheFirst()),
);
