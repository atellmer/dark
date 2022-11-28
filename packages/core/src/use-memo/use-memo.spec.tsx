/** @jsx h */
import { dom } from '@test-utils';
import { render } from '@dark-engine/platform-browser';
import { h } from '../element';
import { createComponent } from '../component';
import { useMemo } from './use-memo';
import { DarkElement } from '../shared';

let host: HTMLElement = null;

beforeEach(() => {
  host = document.createElement('div');
});

describe('[use-memo]', () => {
  test('returns correct value', () => {
    const value = 1;
    let memoValue: number = null;

    const render$ = (props = {}) => {
      render(App(props), host);
    };

    const App = createComponent(() => {
      memoValue = useMemo(() => value, []);

      return null;
    });

    render$();
    expect(memoValue).toBe(value);
    render$();
    expect(memoValue).toBe(value);
  });

  test('works correctly with deps', () => {
    type AppProps = {
      x: number;
    };
    const mockFn = jest.fn();

    const render$ = (props: AppProps) => {
      render(App(props), host);
    };

    const App = createComponent<{ x: number }>(({ x }) => {
      useMemo(() => mockFn(), [x]);

      return null;
    });

    render$({ x: 1 });
    expect(mockFn).toBeCalledTimes(1);

    render$({ x: 1 });
    expect(mockFn).toBeCalledTimes(1);

    render$({ x: 2 });
    expect(mockFn).toBeCalledTimes(2);
  });

  test('returns a memoized template correctly', () => {
    type AppProps = {
      x: number;
    };
    const content = (value: number) => dom`
      <div>
        <div>Item: ${value}</div>
      </div>
    `;

    const render$ = (props: AppProps) => {
      render(App(props), host);
    };

    const Item = createComponent<{ slot: DarkElement }>(({ slot }) => <div>Item: {slot}</div>);
    const App = createComponent<{ x: number }>(({ x }) => {
      const value = useMemo(
        () => (
          <div>
            <Item>{x}</Item>
          </div>
        ),
        [x],
      );

      return value;
    });

    render$({ x: 1 });
    expect(host.innerHTML).toBe(content(1));

    render$({ x: 1 });
    expect(host.innerHTML).toBe(content(1));

    render$({ x: 2 });
    expect(host.innerHTML).toBe(content(2));
  });
});
