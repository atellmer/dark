import { createBrowserEnv } from '@test-utils';

import { component } from '../component';
import { Shadow } from './shadow';

let { host, render } = createBrowserEnv();

beforeEach(() => {
  ({ host, render } = createBrowserEnv());
});

describe('@core/shadow', () => {
  test('works correctly', () => {
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
    const App = component<{ isOpen: boolean }>(({ isOpen }) => {
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

    render(<App isOpen={false} />);
    expect(host.innerHTML).toMatchInlineSnapshot(
      `"<div><div style="display: none;">1</div><div style="display: none;">2</div><div style="display: none;">3</div></div>"`,
    );
    expect(spy).toHaveBeenCalled();

    render(<App isOpen={true} />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div><div>1</div><div>2</div><div>3</div></div>"`);

    render(<App isOpen={true} />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div><div>1</div><div>2</div><div>3</div></div>"`);

    render(<App isOpen={false} />);
    expect(host.innerHTML).toMatchInlineSnapshot(
      `"<div><div style="display: none;">1</div><div style="display: none;">2</div><div style="display: none;">3</div></div>"`,
    );
  });
});
