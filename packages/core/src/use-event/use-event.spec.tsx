import { render } from '@dark-engine/platform-browser';
import { h } from '../element';
import { createComponent } from '../component';
import { useEvent } from './use-event';

let host: HTMLElement = null;

beforeEach(() => {
  host = document.createElement('div');
});

describe('[use-event]', () => {
  test('use-event works correctly', () => {
    const handlers: Array<() => number> = [];

    type AppProps = {
      x: number;
    };

    const App = createComponent<AppProps>(({ x }) => {
      const handler = useEvent(() => x);

      handlers.push(handler);

      return null;
    });

    render(<App x={1} />, host);
    render(<App x={2} />, host);
    render(<App x={3} />, host);
    expect(handlers.every(x => x === handlers[0])).toBeTruthy();
    expect(handlers.every(x => x() === 3)).toBeTruthy();
  });
});
