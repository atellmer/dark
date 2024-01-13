/** @jsx h */
import { type DarkElement, h, component } from '@dark-engine/core';

import { createBrowserEnv, replacer, resetBrowserHistory } from '@test-utils';
import { type Routes } from '../create-routes';
import { Router } from '../router';
import { useHistory } from '../use-history';
import { RouterHistory } from '../history';
import { useParams } from './use-params';

let { host, render } = createBrowserEnv();

beforeEach(() => {
  jest.useFakeTimers();
  ({ host, render } = createBrowserEnv());
});

afterEach(() => {
  resetBrowserHistory();
});

describe('@web-router/use-params', () => {
  test('hook works correctly', () => {
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
        path: 'first/:id',
        component: component(() => {
          const params = useParams();

          return <div>first: {params.get('id')}</div>;
        }),
      },
      {
        path: 'second/:x1',
        component: component<{ slot: DarkElement }>(({ slot }) => {
          const params = useParams();

          return (
            <div>
              second: {params.get('x1')}
              {slot}
            </div>
          );
        }),
        children: [
          {
            path: 'a/:x2',
            component: component(() => {
              const params = useParams();

              return (
                <div>
                  a: {params.get('x1')}|{params.get('x2')}
                </div>
              );
            }),
          },
        ],
      },
    ];

    const App = component(() => {
      return <Router routes={routes}>{slot => slot}</Router>;
    });

    render(<App />);
    jest.runAllTimers();
    expect(host.innerHTML).toBe(`<div>root</div>`);

    history.push('/first/1');
    jest.runAllTimers();
    expect(host.innerHTML).toBe(`<div>first: 1</div>`);

    history.push('/second/2');
    jest.runAllTimers();
    expect(host.innerHTML).toBe(`<div>second: 2${replacer}</div>`);

    history.push('/second/2/a/3');
    jest.runAllTimers();
    expect(host.innerHTML).toBe(`<div>second: 2<div>a: 2|3</div></div>`);
  });
});
