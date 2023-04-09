import { type DarkElement, h, component, Suspense, lazy } from '@dark-engine/core';
import { type Routes, Router, RouterLink } from '@dark-engine/web-router';

import { Spinner } from './spinner';

const Home = lazy(() => import('./home'));
const HomeChildA = lazy(() => import('./child-a'));
const HomeChildB = lazy(() => import('./child-b'));
const HomeChildC = lazy(() => import('./child-c'));
const About = lazy(() => import('./about'));
const Contacts = lazy(() => import('./contacts'));

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

type ShellProps = {
  slot: DarkElement;
};

const Shell = component<ShellProps>(({ slot }) => {
  return (
    <Suspense fallback={<Spinner />}>
      <header>
        <RouterLink to='/home'>home</RouterLink>
        <RouterLink to='/about'>about</RouterLink>
        <RouterLink to='/contacts'>contacts</RouterLink>
      </header>
      <main>{slot}</main>
    </Suspense>
  );
});

export type AppProps = {
  url?: string;
};

const App = component<AppProps>(({ url }) => {
  return (
    <Router routes={routes} url={url}>
      {slot => <Shell>{slot}</Shell>}
    </Router>
  );
});

export { App };
