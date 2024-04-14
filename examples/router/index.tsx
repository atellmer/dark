import { component, lazy, Suspense, type DarkElement } from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';
import { type Routes, Router, NavLink, useLocation } from '@dark-engine/web-router';
import { createGlobalStyle, keyframes } from '@dark-engine/styled';

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
  const { key } = useLocation();

  return (
    <>
      <header>
        <NavLink to='/home'>Home</NavLink>
        <NavLink to='/about'>About</NavLink>
        <NavLink to='/contacts'>Contacts</NavLink>
      </header>
      <Suspense fallback={<Spinner />}>
        <main key={key} class='fade'>
          {slot}
        </main>
      </Suspense>
    </>
  );
});

const App = component(() => {
  return (
    <>
      <GlobalStyle />
      <Router routes={routes}>{slot => <Shell>{slot}</Shell>}</Router>
    </>
  );
});

const Spinner = component(() => <div>Loading...</div>);

const fade = keyframes`
  0% {
    opacity: 0;
    transform: scale(1.05) translate(-20px);
  }

  100% {
    opacity: 1;
    transform: scale(1) translate(0);
  }
`;

const GlobalStyle = createGlobalStyle`
  * {
      box-sizing: border-box;
    }

  html {
    font-size: 14px;
  }

  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Roboto';
    background-color: #fafafa;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  header {
    width: 100%;
    background-color: #03a9f4;
    padding: 6px;
    color: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    display: flex;
    align-items: center;
  }

  header a {
    color: #fff;
    text-transform: uppercase;
    font-size: 0.9rem;
  }

  header a:hover {
    color: #fff59d;
  }
  
  main {
    width: 100%;
    padding: 16px;
    display: flex;
  }

  .fade {
    animation-name: ${fade};
    animation-iteration-count: 1;
    animation-duration: 600ms;
    animation-fill-mode: both;
    animation-timing-function: ease-in-out;
  }

  a {
    margin: 4px;
    text-decoration: none;
    transition: color 0.2s ease-in-out;
  }

  h1 {
    margin: 0;
    margin-bottom: 16px;
  }

  img {
    width: 600px;
    min-height: 300px;
    max-width: 100%;
    margin: 20px auto;
    background-color: #eeeeee;
    object-fit: cover;
  }

  article {
    margin: 0 auto;
    max-width: 1024px;
    display: flex;
    flex-flow: column nowrap;
  }

  #root {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 48px 1fr;
  }

  .active-link {
    color: #ffeb3b;
    text-decoration: underline;
  }

  .active-link:hover {
    color: #ffeb3b;
  }

  p {
    line-height: 2;
  }
`;

createRoot(document.getElementById('root')).render(<App />);
