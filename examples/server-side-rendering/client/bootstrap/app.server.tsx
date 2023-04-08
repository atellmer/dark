import { h } from '@dark-engine/core';
import { renderToStream } from '@dark-engine/platform-server';
import { type Routes } from '@dark-engine/web-router';

import { App, type AppProps } from '../components/app';
import Home from '../components/home';
import HomeChildA from '../components/child-a';
import HomeChildB from '../components/child-b';
import HomeChildC from '../components/child-c';
import About from '../components/about';
import Contacts from '../components/contacts';
import { Page } from '../components/page';

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
