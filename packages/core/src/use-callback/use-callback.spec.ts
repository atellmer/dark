import { waitNextIdle } from '@test-utils';
import { render } from '@dark-engine/platform-browser/render';
import { createComponent } from '../component';
import { useCallback } from './use-callback';

let host: HTMLElement = null;

beforeEach(() => {
  host = document.createElement('div');
});

test('use-callback works correctly by default', () => {
  const handlers = [];
  const App = createComponent(() => {
    const handler = useCallback(() => {}, []);

    handlers.push(handler);

    return null;
  });

  render(App(), host);
  waitNextIdle();
  expect(handlers.every(x => x && x === handlers[0])).toBeTruthy();
  render(App(), host);
  waitNextIdle();
  expect(handlers.every(x => x && x === handlers[0])).toBeTruthy();
});

test('use-callback works correctly with deps', () => {
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
  waitNextIdle();
  expect(handlers.every(x => x && x === handlers[0])).toBeTruthy();
  render(App({ count: 1 }), host);
  waitNextIdle();
  expect(handlers.every(x => x && x === handlers[0])).toBeTruthy();
  render(App({ count: 2 }), host);
  waitNextIdle();
  expect(handlers.every(x => x && x === handlers[0])).toBeFalsy();
});

test('use-callback returns function', () => {
  let handler: () => void;
  const App = createComponent(() => {
    handler = useCallback(() => {}, []);

    return null;
  });

  render(App({ count: 1 }), host);
  waitNextIdle();
  expect(typeof handler).toBe('function');
});
