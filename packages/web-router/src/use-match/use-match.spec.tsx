/** @jsx h */
import { h, component } from '@dark-engine/core';

import { createBrowserEnv, resetBrowserHistory } from '@test-utils';
import { type Routes } from '../create-routes';
import { Router } from '../router';
import { useHistory } from '../use-history';
import { RouterHistory } from '../history';
import { useMatch, type Match } from './use-match';

let { host, render } = createBrowserEnv();

beforeEach(() => {
  jest.useFakeTimers();
  ({ host, render } = createBrowserEnv());
});

afterEach(() => {
  resetBrowserHistory();
});

describe('@web-router/use-match', () => {
  test('hook works correctly', () => {
    let history: RouterHistory = null;
    let match: Match = null;

    const routes: Routes = [
      {
        path: '',
        component: component(() => {
          history = useHistory();
          match = useMatch();

          return <div>root</div>;
        }),
      },
      {
        path: 'second/:id',
        component: component(() => {
          match = useMatch();

          return <div>second</div>;
        }),
      },
    ];

    const App = component(() => {
      return <Router routes={routes}>{slot => slot}</Router>;
    });

    render(<App />);
    jest.runAllTimers();
    expect(match).toBeTruthy();
    expect(match.path).toBe('');
    expect(match.url).toBe('');
    expect(host.innerHTML).toBe(`<div>root</div>`);

    history.push('/second/10');
    jest.runAllTimers();
    expect(host.innerHTML).toBe(`<div>second</div>`);
    expect(match).toBeTruthy();
    expect(match.path).toBe('second/:id');
    expect(match.url).toBe('/second/10');
  });
});
