import { h, component, Suspense, type DarkElement } from '@dark-engine/core';
import { type Routes, Router, RouterLink } from '@dark-engine/web-router';

import { Spinner } from './spinner';

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
  routes: Routes;
};

const App = component<AppProps>(({ url, routes }) => {
  return (
    <Router routes={routes} url={url}>
      {slot => <Shell>{slot}</Shell>}
    </Router>
  );
});

export { App };
