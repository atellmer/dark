/** @jsx h */
import { createTestHostNode, createReplacerString } from '@test-utils';
import { h, createComponent } from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';
import { type Routes } from '../create-routes';
import { Router } from '../router';
import { useHistory } from '../use-history';
import { RouterHistory } from '../history';
import { useParams } from './use-params';

let host: HTMLElement = null;
const replacer = createReplacerString();

beforeEach(() => {
  host = createTestHostNode();
});

afterAll(() => {
  host = null;
});

describe('[router/use-params]', () => {
  test('hook works correctly', () => {
    let history: RouterHistory = null;

    const routes: Routes = [
      {
        path: '',
        component: createComponent(() => {
          history = useHistory();

          return <div>root</div>;
        }),
      },
      {
        path: 'first/:id',
        component: createComponent(() => {
          const paramsMap = useParams();

          return <div>first: {paramsMap.get('id')}</div>;
        }),
      },
      {
        path: 'second/:x1',
        component: createComponent(({ slot }) => {
          const paramsMap = useParams();

          return (
            <div>
              second: {paramsMap.get('x1')}
              {slot}
            </div>
          );
        }),
        children: [
          {
            path: 'a/:x2',
            component: createComponent(() => {
              const paramsMap = useParams();

              return (
                <div>
                  a: {paramsMap.get('x1')}|{paramsMap.get('x2')}
                </div>
              );
            }),
          },
        ],
      },
    ];

    const App = createComponent(() => {
      return <Router routes={routes}>{slot => slot}</Router>;
    });

    const root = createRoot(host);

    root.render(<App />);
    expect(host.innerHTML).toBe(`<div>root</div>`);

    history.push('/first/1');
    expect(host.innerHTML).toBe(`<div>first: 1</div>`);

    history.push('/second/2');
    expect(host.innerHTML).toBe(`<div>second: 2${replacer}</div>`);

    history.push('/second/2/a/3');
    expect(host.innerHTML).toBe(`<div>second: 2<div>a: 2|3</div></div>`);

    root.unmount();
  });
});
