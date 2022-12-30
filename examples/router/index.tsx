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
    path: 'users',
    component: createComponent(({ slot }) => <div>slot: {slot}</div>),
    children: [
      {
        path: 'settings',
        component: createComponent(() => <div>settings</div>),
      },
      {
        path: '',
        component: createComponent(() => <div>list</div>),
      },
      {
        path: ':id',
        component: createComponent(() => <div>user by id</div>),
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
  {
    path: 'about',
    component: createComponent(() => <div>about</div>),
  },
  {
    path: 'contacts',
    component: createComponent(() => <div>contacts</div>),
  },
  {
    path: '',
    redirectTo: 'users',
  },
  {
    path: '**',
    redirectTo: 'users',
  },
];

const App = createComponent(() => {
  return <Router routes={routes}>{slot => <Shell>{slot}</Shell>}</Router>;
});

createRoot(document.getElementById('root')).render(<App />);
