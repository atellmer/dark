import { lazy } from '@dark-engine/core';
import { hydrateRoot, createRoot } from '@dark-engine/platform-browser';
import { type Routes } from '@dark-engine/web-router';

import { App, type AppProps } from '../components/app';

const Home = lazy(() => import('../components/home'));
const HomeChildA = lazy(() => import('../components/child-a'));
const HomeChildB = lazy(() => import('../components/child-b'));
const HomeChildC = lazy(() => import('../components/child-c'));
const About = lazy(() => import('../components/about'));
const Contacts = lazy(() => import('../components/contacts'));

const routes: Routes = [
  {
    path: 'home',
    component: Home,
    children: [
      {
        path: 'a',
        component: HomeChildA,
      },
      {
        path: 'b',
        component: HomeChildB,
      },
      {
        path: 'c',
        component: HomeChildC,
      },
      {
        path: '**',
        redirectTo: 'a',
      },
    ],
  },
  {
    path: 'about',
    component: About,
  },
  {
    path: 'contacts',
    component: Contacts,
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];

function bootstrap(hydrate = false, props: Omit<AppProps, 'routes'> = {}) {
  hydrate
    ? hydrateRoot(document.getElementById('root'), App({ ...props, routes }))
    : createRoot(document.getElementById('root')).render(App({ ...props, routes }));
}

export { bootstrap };
