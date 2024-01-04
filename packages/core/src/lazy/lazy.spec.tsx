/** @jsx h */
import { dom, createBrowserEnv, createServerEnv, nextTick, replacer } from '@test-utils';
import { h } from '../element';
import { component } from '../component';
import { type Module, lazy } from './lazy';
import { platform } from '../platform';

beforeEach(() => {
  jest.useRealTimers();
});

describe('@core/lazy', () => {
  test('renders a component in the browser correctly', async () => {
    const { host, render } = createBrowserEnv();
    const content = () => dom`
      <div>lazy</div>
    `;
    const make = () => {
      return new Promise(resolve => {
        const Lazy = lazy(
          () =>
            new Promise<Module>(resolve => {
              setTimeout(() => {
                resolve({ default: component(() => <div>lazy</div>) });
              });
            }),
          async () => {
            await nextTick();
            expect(host.innerHTML).toBe(content());
            render(<App />);
            expect(host.innerHTML).toBe(content());
            resolve(null);
          },
        );
        const App = component(() => <Lazy />);

        render(<App />);
        expect(host.innerHTML).toBe(replacer);
      });
    };

    await make();
  });

  test('renders a component on the server correctly', async () => {
    const { renderToString } = createServerEnv();
    const content = () => dom`
      <div>lazy</div>
    `;
    const Lazy = lazy(
      () =>
        new Promise<Module>(resolve => {
          setTimeout(() => {
            resolve({ default: component(() => <div>lazy</div>) });
          });
        }),
    );
    jest.spyOn(platform, 'spawn').mockImplementation((cb: () => void) => setTimeout(cb));
    const App = component(() => <Lazy />);
    const app = await renderToString(<App />);

    expect(app).toBe(content());
  });
});
