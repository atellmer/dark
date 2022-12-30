import { h, Fragment, createComponent, lazy, Suspense, type DarkElement } from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';
import { type Routes, Router, RouterLink, useLocation } from '@dark-engine/web-router';

const Home = lazy(() => import('./home'));
const About = lazy(() => import('./about'));
const Contacts = lazy(() => import('./contacts'));

type ShellProps = {
  slot: DarkElement;
};

const Shell = createComponent<ShellProps>(({ slot }) => {
  const { key } = useLocation();

  return (
    <>
      <Suspense fallback={<Spinner />}>
        <header>
          <RouterLink to='/home'>Home</RouterLink>
          <RouterLink to='/about'>About</RouterLink>
          <RouterLink to='/contacts'>Contacts</RouterLink>
        </header>
        <main key={key} class='fade'>
          {slot}
        </main>
      </Suspense>
    </>
  );
});

const Spinner = createComponent(() => <div>Loading...</div>);

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

const App = createComponent(() => {
  return <Router routes={routes}>{slot => <Shell>{slot}</Shell>}</Router>;
});

createRoot(document.getElementById('root')).render(<App />);
