/** @jsx h */
import { createBrowserEnv, dom } from '@test-utils';

import { h } from '../element';
import { component } from '../component';
import { Shadow } from './shadow';

let { host, render } = createBrowserEnv();

beforeEach(() => {
  ({ host, render } = createBrowserEnv());
});

describe('@core/shadow', () => {
  test('works correctly', () => {
    const content = (isVisible = false) => dom`
      ${
        !isVisible
          ? '<div></div>'
          : `
            <div>
              <div>1</div>
              <div>2</div>
              <div>3</div>
            </div>
          `
      }
    `;
    const App = component<{ isInserted?: boolean }>(({ isInserted }) => {
      return (
        <div>
          <Shadow isInserted={isInserted}>
            <div>1</div>
            <div>2</div>
            <div>3</div>
          </Shadow>
        </div>
      );
    });

    render(<App />);
    expect(host.innerHTML).toBe(content());

    render(<App isInserted />);
    expect(host.innerHTML).toBe(content(true));

    render(<App isInserted />);
    expect(host.innerHTML).toBe(content(true));

    render(<App />);
    expect(host.innerHTML).toBe(content(true));
  });
});
