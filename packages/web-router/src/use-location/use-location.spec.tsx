/** @jsx h */
import { h, createComponent } from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';

import { createTestHostNode } from '@test-utils';
import { type Routes } from '../create-routes';
import { Router } from '../router';
import { useHistory } from '../use-history';
import { RouterHistory } from '../history';
import { RouterLocation } from '../location';
import { useLocation } from './use-location';

let host: HTMLElement = null;

beforeEach(() => {
  host = createTestHostNode();
});

afterAll(() => {
  host = null;
});

describe('[router/use-location]', () => {
  test('hook works correctly', () => {
    let history: RouterHistory = null;
    let location: RouterLocation = null;

    const routes: Routes = [
      {
        path: '',
        component: createComponent(() => {
          history = useHistory();
          location = useLocation();

          return <div>root</div>;
        }),
      },
      {
        path: 'second',
        component: createComponent(() => {
          location = useLocation();

          return <div>second</div>;
        }),
      },
    ];

    const App = createComponent(() => {
      return <Router routes={routes}>{slot => slot}</Router>;
    });

    const root = createRoot(host);

    root.render(<App />);
    expect(location).toBeInstanceOf(RouterLocation);
    expect(location.pathname).toBe('/');
    expect(location.key).toBeTruthy;
    expect(host.innerHTML).toBe(`<div>root</div>`);

    history.push('/second');
    expect(host.innerHTML).toBe(`<div>second</div>`);
    expect(location).toBeInstanceOf(RouterLocation);
    expect(location.pathname).toBe('/second/');
    expect(location.key).toBeTruthy;

    root.unmount();
  });
});
