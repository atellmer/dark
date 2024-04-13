import { component } from '@dark-engine/core';
import { type SyntheticEvent } from '@dark-engine/platform-browser';

import { createBrowserEnv, replacer, click, dom, resetBrowserHistory } from '@test-utils';
import { type Routes } from '../create-routes';
import { Router } from '../router';
import { ACTIVE_LINK_CLASSNAME } from '../constants';
import { RouterLink } from './router-link';

let { host, render } = createBrowserEnv();

beforeEach(() => {
  ({ host, render } = createBrowserEnv());
});

afterEach(() => {
  resetBrowserHistory();
});

describe('@web-router/router-link', () => {
  test('can navigate by routes correctly', () => {
    const content = (active: string, value: string) => dom`
      <header>
        <a href="/first"${active === '/first' ? ` class="${ACTIVE_LINK_CLASSNAME}"` : ''}>first</a>
        <a href="/second"${active === '/second' ? ` class="${ACTIVE_LINK_CLASSNAME}"` : ''}>second</a>
        <a href="/third"${active === '/third' ? ` class="${ACTIVE_LINK_CLASSNAME}"` : ''}>third</a>
      </header>
      <main>${value}</main>
    `;

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
                  <RouterLink to='/first'>first</RouterLink>
                  <RouterLink to='/second'>second</RouterLink>
                  <RouterLink to='/third'>third</RouterLink>
                </header>
                <main>{slot}</main>
              </>
            );
          }}
        </Router>
      );
    });

    render(<App />);
    expect(host.innerHTML).toBe(content('', replacer));

    const link1 = host.querySelector('a[href="/first"]');
    const link2 = host.querySelector('a[href="/second"]');
    const link3 = host.querySelector('a[href="/third"]');

    click(link1);
    expect(host.innerHTML).toBe(content('/first', `<div>first</div>`));

    click(link1);
    expect(host.innerHTML).toBe(content('/first', `<div>first</div>`));

    click(link2);
    expect(host.innerHTML).toBe(content('/second', `<div>second</div>`));

    click(link3);
    expect(host.innerHTML).toBe(content('/third', `<div>third</div>`));
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
              <RouterLink to='/' className='my-link' activeClassName='custom-active-link'>
                first
              </RouterLink>
            );
          }}
        </Router>
      );
    });

    render(<App />);
    expect(host.innerHTML).toBe(`<a href="/" class="my-link custom-active-link">first</a>`);
  });

  test('prevent default click event', () => {
    const routes: Routes = [
      {
        path: '',
        component: component(() => null),
      },
    ];

    let defaultPrevented = false;

    const App = component(() => {
      const handleClick = (e: SyntheticEvent<MouseEvent>) => {
        defaultPrevented = e.sourceEvent.defaultPrevented;
      };

      return (
        <Router routes={routes}>
          {() => {
            return (
              <RouterLink to='/' onClick={handleClick}>
                first
              </RouterLink>
            );
          }}
        </Router>
      );
    });

    render(<App />);
    expect(host.innerHTML).toBe(`<a href="/" class="${ACTIVE_LINK_CLASSNAME}">first</a>`);

    click(host.querySelector('a'));
    expect(defaultPrevented).toBe(true);
  });
});
