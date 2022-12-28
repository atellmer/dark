/** @jsx h */
import { createTestHostNode, createReplacerString, click, dom } from '@test-utils';
import { h, Fragment, createComponent } from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';
import { type Routes } from '../create-routes';
import { Router } from '../router';
import { RouterLink } from './router-link';

let host: HTMLElement = null;
const replacer = createReplacerString();

beforeEach(() => {
  host?.parentElement === document.body && document.body.removeChild(host);
  host = createTestHostNode();
  document.body.appendChild(host);
});

afterAll(() => {
  host = null;
});

describe('[router/router-link]', () => {
  test('can navigate by routes correctly', () => {
    const content = (active: string, value: string) => dom`
      <header>
        <a href="/first"${active === '/first' ? ` class="router-active-link"` : ''}>first</a>
        <a href="/second"${active === '/second' ? ` class="router-active-link"` : ''}>second</a>
        <a href="/third"${active === '/third' ? ` class="router-active-link"` : ''}>third</a>
      </header>
      <main>${value}</main>
    `;

    const routes: Routes = [
      {
        path: 'first',
        component: createComponent(() => <div>first</div>),
      },
      {
        path: 'second',
        component: createComponent(() => <div>second</div>),
      },
      {
        path: 'third',
        component: createComponent(() => <div>third</div>),
      },
    ];

    const App = createComponent(() => {
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

    const root = createRoot(host);

    root.render(<App />);
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

    root.unmount();
  });

  test('can work with custom classes correctly', () => {
    const routes: Routes = [
      {
        path: '',
        component: createComponent(() => null),
      },
    ];

    const App = createComponent(() => {
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

    const root = createRoot(host);

    root.render(<App />);
    expect(host.innerHTML).toBe(`<a href="/" class="my-link custom-active-link">first</a>`);

    root.unmount();
  });
});
