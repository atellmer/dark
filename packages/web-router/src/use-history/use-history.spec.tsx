/** @jsx h */
import { h, component } from '@dark-engine/core';

import { createBrowserEnv, resetBrowserHistory } from '@test-utils';
import { type Routes } from '../create-routes';
import { Router } from '../router';
import { useHistory } from './use-history';
import { RouterHistory } from '../history';

let { host, render } = createBrowserEnv();

beforeEach(() => {
  jest.useFakeTimers();
  ({ host, render } = createBrowserEnv());
});

afterEach(() => {
  resetBrowserHistory();
});

describe('@web-router/use-history', () => {
  test('works correctly', () => {
    let history: RouterHistory = null;
    const routes: Routes = [
      {
        path: '',
        component: component(() => {
          history = useHistory();

          return <div>root</div>;
        }),
      },
      {
        path: 'second',
        component: component(() => <div>second</div>),
      },
      {
        path: 'third',
        component: component(() => <div>third</div>),
      },
    ];

    const App = component(() => {
      return <Router routes={routes}>{slot => slot}</Router>;
    });

    render(<App />);
    jest.runAllTimers();
    expect(history).toBeInstanceOf(RouterHistory);
    expect(host.innerHTML).toBe(`<div>root</div>`);
    expect(location.href).toBe('http://localhost/');

    history.push('/second/');
    jest.runAllTimers();
    expect(host.innerHTML).toBe(`<div>second</div>`);
    expect(location.href).toBe('http://localhost/second/');

    history.push('/third/');
    jest.runAllTimers();
    expect(host.innerHTML).toBe(`<div>third</div>`);
    expect(location.href).toBe('http://localhost/third/');
  });
});
