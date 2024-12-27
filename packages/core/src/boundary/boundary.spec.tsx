import { createBrowserEnv } from '@test-utils';

import { component } from '../component';
import { useError } from './boundary';

let { host, render } = createBrowserEnv();
let reset: () => void = null;

beforeEach(() => {
  ({ host, render } = createBrowserEnv());
  reset = null;
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('@core/boundary', () => {
  type Props = {
    hasError?: boolean;
  };

  const Chlld = component<Props>(({ hasError }) => {
    if (hasError) {
      throw new Error();
    }

    return <div>child</div>;
  });

  test('catches error correctly', () => {
    const App = component<Props>(({ hasError }) => {
      const [error, _reset] = useError();

      reset = _reset;

      if (error) return <div>error</div>;

      return <Chlld hasError={hasError} />;
    });

    render(<App />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>child</div>"`);

    render(<App hasError />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>error</div>"`);

    render(<App />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>error</div>"`);
    reset();
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>child</div>"`);
  });

  test('works correctly with deeply children', () => {
    const App = component<Props>(({ hasError }) => {
      const [error, _reset] = useError();

      reset = _reset;

      if (error) return <div>error</div>;

      return (
        <>
          <div>header</div>
          <div>
            <div>
              <div>
                <Chlld hasError={hasError} />
              </div>
            </div>
          </div>
          <div>footer</div>
        </>
      );
    });

    render(<App />);
    expect(host.innerHTML).toMatchInlineSnapshot(
      `"<div>header</div><div><div><div><div>child</div></div></div></div><div>footer</div>"`,
    );

    render(<App hasError />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>error</div>"`);

    render(<App />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>error</div>"`);

    reset();
    expect(host.innerHTML).toMatchInlineSnapshot(
      `"<div>header</div><div><div><div><div>child</div></div></div></div><div>footer</div>"`,
    );
  });
});
