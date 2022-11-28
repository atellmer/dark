import { render } from '@dark-engine/platform-browser';
import { createComponent } from '../component';
import { useCallback } from './use-callback';

let host: HTMLElement = null;

beforeEach(() => {
  host = document.createElement('div');
});

describe('[use-callback]', () => {
  test('works correctly by default', () => {
    const handlers = [];
    const App = createComponent(() => {
      const handler = useCallback(() => {}, []);

      handlers.push(handler);

      return null;
    });

    render(App(), host);
    render(App(), host);
    render(App(), host);
    expect(handlers.every(x => x && x === handlers[0])).toBeTruthy();
  });

  test('works correctly with deps', () => {
    type Props = {
      count: number;
    };
    const handlers = [];
    const App = createComponent<Props>(({ count }) => {
      const handler = useCallback(() => {}, [count]);

      handlers.push(handler);

      return null;
    });

    render(App({ count: 1 }), host);
    expect(handlers.every(x => x && x === handlers[0])).toBeTruthy();
    render(App({ count: 1 }), host);
    expect(handlers.every(x => x && x === handlers[0])).toBeTruthy();
    render(App({ count: 2 }), host);
    expect(handlers.every(x => x && x === handlers[0])).toBeFalsy();
  });

  test('returns function', () => {
    let handler: () => void;
    const App = createComponent(() => {
      handler = useCallback(() => {}, []);

      return null;
    });

    render(App(), host);
    expect(typeof handler).toBe('function');
  });
});
