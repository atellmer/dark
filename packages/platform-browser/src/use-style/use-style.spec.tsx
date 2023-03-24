/** @jsx h */
import { h, component } from '@dark-engine/core';

import { render } from '../render';
import { useStyle } from './use-style';

let host: HTMLElement = null;

beforeEach(() => {
  host = document.createElement('div');
});

describe('[use-style]', () => {
  test('useStyle works correctly', () => {
    let style: { root: string; button: string };

    const App = component(() => {
      style = useStyle(styled => ({
        root: styled`
          position: absolute;
          transform: translate(10px, 10px);
          text-transform: uppercase;
        `,
        button: styled`
          color: pink;
        `,
      }));

      return null;
    });

    render(<App />, host);
    expect(style.root).toBe('position:absolute;transform:translate(10px, 10px);text-transform:uppercase;');
    expect(style.button).toBe('color:pink;');
  });
});
