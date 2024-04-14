import { component } from '@dark-engine/core';

import { createBrowserEnv, click, resetBrowserHistory } from '@test-utils';
import { type Routes } from '../create-routes';
import { Router } from '../router';
import { NavLink } from './nav-link';

let { host, render } = createBrowserEnv();

beforeEach(() => {
  ({ host, render } = createBrowserEnv());
});

afterEach(() => {
  resetBrowserHistory();
});

describe('@web-router/nav-link', () => {
  test('can navigate by routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => <div>first</div>),
      },
      {
        path: 'second',
        component: component(() => <div>second</div>),
      },
      {
        path: 'third',
        component: component(() => <div>third</div>),
      },
      {
        path: '**',
        component: component(() => null),
      },
    ];

    const App = component(() => {
      return (
        <Router routes={routes}>
          {slot => {
            return (
              <>
                <header>
                  <NavLink to='/first'>first</NavLink>
                  <NavLink to='/second'>second</NavLink>
                  <NavLink to='/third'>third</NavLink>
                </header>
                <main>{slot}</main>
              </>
            );
          }}
        </Router>
      );
    });

    render(<App />);
    expect(host.innerHTML).toMatchInlineSnapshot(
      `"<header><a href="/first">first</a><a href="/second">second</a><a href="/third">third</a></header><main><!--dark:matter--></main>"`,
    );

    const link1 = host.querySelector('a[href="/first"]');
    const link2 = host.querySelector('a[href="/second"]');
    const link3 = host.querySelector('a[href="/third"]');

    click(link1);
    expect(host.innerHTML).toMatchInlineSnapshot(
      `"<header><a href="/first" class="active-link">first</a><a href="/second">second</a><a href="/third">third</a></header><main><div>first</div></main>"`,
    );

    click(link1);
    expect(host.innerHTML).toMatchInlineSnapshot(
      `"<header><a href="/first" class="active-link">first</a><a href="/second">second</a><a href="/third">third</a></header><main><div>first</div></main>"`,
    );

    click(link2);
    expect(host.innerHTML).toMatchInlineSnapshot(
      `"<header><a href="/first">first</a><a href="/second" class="active-link">second</a><a href="/third">third</a></header><main><div>second</div></main>"`,
    );

    click(link3);
    expect(host.innerHTML).toMatchInlineSnapshot(
      `"<header><a href="/first">first</a><a href="/second">second</a><a href="/third" class="active-link">third</a></header><main><div>third</div></main>"`,
    );
  });

  test('can work with custom classes correctly', () => {
    const routes: Routes = [
      {
        path: '',
        component: component(() => null),
      },
    ];

    const App = component(() => {
      return (
        <Router routes={routes}>
          {() => {
            return (
              <NavLink to='/' className='my-link'>
                first
              </NavLink>
            );
          }}
        </Router>
      );
    });

    render(<App />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<a href="/" class="my-link active-link">first</a>"`);
  });
});
