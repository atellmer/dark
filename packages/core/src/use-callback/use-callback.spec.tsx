/** @jsx h */
import { render } from '@dark-engine/platform-browser';

import { component } from '../component';
import { useCallback } from './use-callback';

let host: HTMLElement = null;

beforeEach(() => {
  host = document.createElement('div');
});

describe('@core/use-callback', () => {
  test('returns function', () => {
    let handler: () => void;
    const App = component(() => {
      handler = useCallback(() => {}, []);

      return null;
    });

    render(App(), host);
    expect(handler).toBeInstanceOf(Function);
  });

  test('works correctly by default', () => {
    const handlers = [];

    const $render = (props = {}) => {
      render(App(props), host);
    };

    const App = component(() => {
      const handler = useCallback(() => {}, []);

      handlers.push(handler);

      return null;
    });

    $render();
    $render();
    $render();
    expect(handlers.every(x => x && x === handlers[0])).toBeTruthy();
  });

  test('works correctly with deps', () => {
    type AppProps = {
      count: number;
    };
    const handlers = [];

    const $render = (props: AppProps) => {
      render(App(props), host);
    };

    const App = component<AppProps>(({ count }) => {
      const handler = useCallback(() => {}, [count]);

      handlers.push(handler);

      return null;
    });

    $render({ count: 1 });
    expect(handlers.every(x => x && x === handlers[0])).toBeTruthy();

    $render({ count: 1 });
    expect(handlers.every(x => x && x === handlers[0])).toBeTruthy();

    $render({ count: 2 });
    expect(handlers.every(x => x && x === handlers[0])).toBeFalsy();
  });
});
