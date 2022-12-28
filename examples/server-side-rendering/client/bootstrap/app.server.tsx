import { renderToString } from '@dark-engine/platform-server';
import { type Routes } from '@dark-engine/web-router';

import { App, type AppProps } from '../components/app';
import Home from '../components/home';
import HomeChildA from '../components/child-a';
import HomeChildB from '../components/child-b';
import HomeChildC from '../components/child-c';
import About from '../components/about';
import Contacts from '../components/contacts';

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

function bootstrap(props: Omit<AppProps, 'routes'> = {}) {
  return renderToString(App({ ...props, routes }));
}

export { bootstrap };
