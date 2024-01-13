/** @jsx h */
import { h, component } from '@dark-engine/core';

import { createBrowserEnv, resetBrowserHistory } from '@test-utils';
import { type Routes } from '../create-routes';
import { Router } from '../router';
import { useHistory } from '../use-history';
import { RouterHistory } from '../history';
import { RouterLocation } from '../location';
import { useLocation } from './use-location';

let { host, render } = createBrowserEnv();

beforeEach(() => {
  jest.useFakeTimers();
  ({ host, render } = createBrowserEnv());
});

afterEach(() => {
  resetBrowserHistory();
});

describe('@web-router/use-location', () => {
  test('hook works correctly', () => {
    let history: RouterHistory = null;
    let location: RouterLocation = null;

    const routes: Routes = [
      {
        path: '',
        component: component(() => {
          history = useHistory();
          location = useLocation();

          return <div>root</div>;
        }),
      },
      {
        path: 'second',
        component: component(() => {
          location = useLocation();

          return <div>second</div>;
        }),
      },
    ];

    const App = component(() => {
      return <Router routes={routes}>{slot => slot}</Router>;
    });

    render(<App />);
    jest.runAllTimers();
    expect(location).toBeInstanceOf(RouterLocation);
    expect(location.pathname).toBe('/');
    expect(location.key).toBeTruthy;
    expect(host.innerHTML).toBe(`<div>root</div>`);

    history.push('/second');
    jest.runAllTimers();
    expect(host.innerHTML).toBe(`<div>second</div>`);
    expect(location).toBeInstanceOf(RouterLocation);
    expect(location.pathname).toBe('/second/');
    expect(location.key).toBeTruthy();
  });
});
