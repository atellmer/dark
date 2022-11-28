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
  test('returns some value', () => {
    let value: number = null;
    const App = createComponent(() => {
      value = useMemo(() => 1, []);

      return null;
    });

    render(App(), host);
    expect(value).toBeTruthy();
    render(App(), host);
    expect(value).toBeTruthy();
  });

  test('works correctly with deps', () => {
    const mockFn = jest.fn();
    const App = createComponent<{ x: number }>(({ x }) => {
      useMemo(() => mockFn(), [x]);

      return null;
    });

    render(App({ x: 1 }), host);
    expect(mockFn).toBeCalledTimes(1);
    render(App({ x: 1 }), host);
    expect(mockFn).toBeCalledTimes(1);
    render(App({ x: 2 }), host);
    expect(mockFn).toBeCalledTimes(2);
  });

  test('returns a memoized template correctly', () => {
    const content = (value: number) => dom`
      <div>
        <div>Item: ${value}</div>
      </div>
    `;
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

    render(App({ x: 1 }), host);
    expect(host.innerHTML).toBe(content(1));
    render(App({ x: 1 }), host);
    expect(host.innerHTML).toBe(content(1));
    render(App({ x: 2 }), host);
    expect(host.innerHTML).toBe(content(2));
  });
});
