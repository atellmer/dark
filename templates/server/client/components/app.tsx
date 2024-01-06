import { type DarkElement, h, Fragment, component, Suspense, lazy } from '@dark-engine/core';
import { type Routes, Router, RouterLink } from '@dark-engine/web-router';
import { createGlobalStyle } from '@dark-engine/styled';

import { Spinner } from './spinner';

const Home = lazy(() => import('./home'));
const About = lazy(() => import('./about'));
const Contacts = lazy(() => import('./contacts'));

const routes: Routes = [
  {
    path: 'home',
    component: Home,
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
    <>
      <GlobalStyle />
      <Router routes={routes} url={url}>
        {slot => <Shell>{slot}</Shell>}
      </Router>
    </>
  );
});

const GlobalStyle = createGlobalStyle`
  *, *::after, *::before {
    box-sizing: border-box;
  }

  html {
    font-size: 14px;
  }

  html, body {
    margin: 0;
    padding: 0;
  }

  body {
    font-family: sans-serif;
    background-color: #fafafa;
  }

  header {
    width: 100%;
    height: 64px;
    background-color: #2196F3;
    display: flex;
    align-items: center;
    padding: 8px 16px;
  }

  header a {
    color: #fff;
    text-transform: uppercase;
    margin-right: 8px;
    text-decoration: none;
  }

  header .router-link-active {
    color: #FFEB3B;
  }

  main {
    width: 800px;
    max-width: 100%;
    margin: 0 auto;
  }

  img {
    max-width: 100%;
    min-height: 500px;
    background-color: #eee;
  }

  p {
    line-height: 2.4;
  }
`;

export { App };
