import { createBrowserEnv, dom } from '@test-utils';

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
    const spy = jest.fn();
    const Child = component(() => {
      spy();
      return (
        <>
          <div>1</div>
          <div>2</div>
          <div>3</div>
        </>
      );
    });
    const App = component<{ isOpen?: boolean }>(({ isOpen }) => {
      return (
        <div>
          <Shadow isOpen={isOpen}>
            <>
              <Child />
            </>
          </Shadow>
        </div>
      );
    });

    render(<App />);
    expect(host.innerHTML).toBe(content());
    expect(spy).toHaveBeenCalled();

    render(<App isOpen />);
    expect(host.innerHTML).toBe(content(true));

    render(<App isOpen />);
    expect(host.innerHTML).toBe(content(true));

    render(<App />);
    expect(host.innerHTML).toBe(content());
  });
});
