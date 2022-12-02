import { h, Fragment, createComponent, lazy, Suspense, type DarkElement } from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';

import { createRouter, Router, NavLink } from './router';

const Home = lazy(() => import('./home'));
const About = lazy(() => import('./about'));
const Contacts = lazy(() => import('./contacts'));

type ShellProps = {
  route: string;
  slot?: DarkElement;
};

const Shell = createComponent<ShellProps>(({ route, slot }) => {
  const handleAnimationStart = () => {
    document.body.classList.add('overflow-hidden');
  };

  const handleAnimationEnd = () => {
    document.body.classList.remove('overflow-hidden');
  };

  return (
    <>
      <header>
        <NavLink to='/'>Home</NavLink>
        <NavLink to='/about'>About</NavLink>
        <NavLink to='/contacts'>Contacts</NavLink>
      </header>
      <main key={route} onAnimationStart={handleAnimationStart} onAnimationEnd={handleAnimationEnd}>
        {slot}
      </main>
    </>
  );
});

const Spinner = createComponent(() => <div>loading...</div>);

const router = createRouter({
  '/': (props = {}) => <Home {...props} />,
  '/about': (props = {}) => <About {...props} />,
  '/contacts': (props = {}) => <Contacts {...props} />,
});

const App = createComponent(() => {
  return (
    <Router router={router}>
      {({ slot, ...rest }) => (
        <Suspense fallback={<Spinner />}>
          <Shell {...rest}>{slot}</Shell>
        </Suspense>
      )}
    </Router>
  );
});

createRoot(document.getElementById('root')).render(<App />);
