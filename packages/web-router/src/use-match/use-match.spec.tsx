/** @jsx h */
import { h, component } from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';

import { createTestHostNode } from '@test-utils';
import { type Routes } from '../create-routes';
import { Router } from '../router';
import { useHistory } from '../use-history';
import { RouterHistory } from '../history';
import { useMatch, type Match } from './use-match';

let host: HTMLElement = null;

beforeEach(() => {
  host = createTestHostNode();
});

afterAll(() => {
  host = null;
});

describe('[router/use-match]', () => {
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

    const root = createRoot(host);

    root.render(<App />);
    expect(match).toBeTruthy();
    expect(match.path).toBe('/');
    expect(match.url).toBe('/');
    expect(host.innerHTML).toBe(`<div>root</div>`);

    history.push('/second/10');
    expect(host.innerHTML).toBe(`<div>second</div>`);
    expect(match).toBeTruthy();
    expect(match.path).toBe('/second/:id/');
    expect(match.url).toBe('/second/10/');

    root.unmount();
  });
});
