import { h, Fragment, component, lazy, Suspense, type DarkElement } from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';
import { type Routes, Router, RouterLink, useLocation } from '@dark-engine/web-router';

const Home = lazy(() => import('./home'));
const About = lazy(() => import('./about'));
const Contacts = lazy(() => import('./contacts'));

type ShellProps = {
  slot: DarkElement;
};

const Shell = component<ShellProps>(({ slot }) => {
  const { key } = useLocation();

  return (
    <>
      <header>
        <RouterLink to='/home'>Home</RouterLink>
        <RouterLink to='/about'>About</RouterLink>
        <RouterLink to='/contacts'>Contacts</RouterLink>
      </header>
      <Suspense fallback={<Spinner />}>
        <main key={key} class='fade'>
          {slot}
        </main>
      </Suspense>
    </>
  );
});

const Spinner = component(() => <div>Loading...</div>);

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

const App = component(() => {
  return <Router routes={routes}>{slot => <Shell>{slot}</Shell>}</Router>;
});

createRoot(document.getElementById('root')).render(<App />);
