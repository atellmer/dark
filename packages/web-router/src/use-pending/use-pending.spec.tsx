import { component } from '@dark-engine/core';
import { createBrowserEnv, resetBrowserHistory, sleep, click } from '@test-utils';

import { type Routes } from '../create-routes';
import { Router } from '../router';
import { NavLink } from '../nav-link';
import { usePending } from './use-pending';

let { host, render } = createBrowserEnv();

beforeEach(() => {
  ({ host, render } = createBrowserEnv());
});

afterEach(() => {
  resetBrowserHistory();
  host.parentElement === document.body && document.body.removeChild(host);
});

describe('@web-router/use-pending', () => {
  test('can render in concurrent mode correctly', async () => {
    jest.useRealTimers();
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
        redirectTo: 'first',
      },
    ];

    const spy = jest.fn();

    const Pending = component(() => {
      const isPending = usePending();

      spy(isPending);

      return <div>{isPending ? 'PENDING...' : ''}</div>;
    });

    const SlowItem = component(() => {
      const t = performance.now() + 1;

      while (performance.now() < t) {
        //
      }

      return null;
    });

    const SlowContent = component(() => {
      return (
        <>
          {Array(10)
            .fill(null)
            .map(() => (
              <SlowItem />
            ))}
        </>
      );
    });

    const App = component(() => {
      return (
        <Router routes={routes} mode='concurrent'>
          {slot => (
            <>
              <NavLink to='/first'>first</NavLink>
              <NavLink to='/second'>second</NavLink>
              <NavLink to='/third'>third</NavLink>
              <div id='content'>
                <Pending />
                {slot}
              </div>
              <SlowContent />
            </>
          )}
        </Router>
      );
    });

    document.body.appendChild(host);
    render(<App />);
    const content = document.querySelector('#content');
    const link = document.querySelector('a[href="/second"]');

    await sleep(1);
    expect(content.innerHTML).toMatchInlineSnapshot(`"<div>PENDING...</div><div>first</div>"`);
    await sleep(100);
    expect(content.innerHTML).toMatchInlineSnapshot(`"<div></div><div>first</div>"`);
    expect(spy.mock.calls).toEqual([[false], [true], [true], [false]]);
    spy.mockClear();

    click(link);
    await sleep(1);
    expect(content.innerHTML).toMatchInlineSnapshot(`"<div>PENDING...</div><div>first</div>"`);
    await sleep(100);
    expect(content.innerHTML).toMatchInlineSnapshot(`"<div></div><div>second</div>"`);
    expect(spy.mock.calls).toEqual([[true], [true], [false]]);
    spy.mockClear();
  });
});
