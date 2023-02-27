import { render } from '@dark-engine/platform-browser';

import { createComponent } from '../component';
import { useEvent } from './use-event';

let host: HTMLElement = null;

beforeEach(() => {
  host = document.createElement('div');
});

describe('[use-event]', () => {
  test('works correctly', () => {
    const handlers: Array<() => number> = [];

    const render$ = (props: AppProps) => {
      render(App(props), host);
    };

    type AppProps = {
      x: number;
    };

    const App = createComponent<AppProps>(({ x }) => {
      const handler = useEvent(() => x);

      handlers.push(handler);

      return null;
    });

    render$({ x: 1 });
    render$({ x: 2 });
    render$({ x: 3 });
    expect(handlers.every(x => x === handlers[0])).toBeTruthy();
    expect(handlers.every(x => x() === 3)).toBeTruthy();
  });
});
