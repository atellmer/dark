import { h, lazy } from '@dark-engine/core';
import { renderToStream } from '@dark-engine/platform-server';
import { type Routes } from '@dark-engine/web-router';

import { App, type AppProps } from '../components/app';
import { Page } from '../components/page';

const Home = lazy(() => import('../components/home'));
const HomeChildA = lazy(() => import('../components/child-a'));
const HomeChildB = lazy(() => import('../components/child-b'));
const HomeChildC = lazy(() => import('../components/child-c'));
const About = lazy(() => import('../components/about'));
const Contacts = lazy(() => import('../components/contacts'));

const routes: Routes = [
  {
    path: 'home/:id',
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
        path: '',
        redirectTo: 'a',
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
    redirectTo: 'home/:id',
  },
];

type BootstrapOptions = {
  title: string;
  props: Omit<AppProps, 'routes'>;
};

function bootstrap(options: BootstrapOptions) {
  const { title, props } = options;

  return renderToStream(
    <Page title={title}>
      <App {...props} routes={routes} />
    </Page>,
    {
      bootstrapScripts: ['./build.js'],
    },
  );
}

export { bootstrap };
