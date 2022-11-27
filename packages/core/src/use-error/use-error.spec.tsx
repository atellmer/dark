/** @jsx h */
import { dom } from '@test-utils';
import { render } from '@dark-engine/platform-browser';
import { h } from '../element';
import { createComponent } from '../component';
import { useError } from './use-error';

let host: HTMLElement = null;

jest.useFakeTimers();

beforeEach(() => {
  host = document.createElement('div');
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('[use-error]', () => {
  test('use-error works correctly', () => {
    const content = () => dom`
      <div>child</div>
    `;

    const errorContent = () => dom`
      <div>error</div>
    `;

    type ChildProps = {
      hasError: boolean;
    };

    const Chlld = createComponent<ChildProps>(({ hasError }) => {
      if (hasError) {
        throw new Error();
      }

      return <div>child</div>;
    });

    type AppProps = {
      hasError?: boolean;
    };

    const App = createComponent<AppProps>(({ hasError }) => {
      const error = useError();

      if (error) {
        return <div>error</div>;
      }

      return <Chlld hasError={hasError} />;
    });

    render(<App />, host);
    expect(host.innerHTML).toBe(content());

    render(<App hasError />, host);
    jest.runAllTimers();
    expect(host.innerHTML).toBe(errorContent());

    render(<App />, host);
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content());
  });

  test('use-error works correctly with deeply children', () => {
    const content = () => dom`
      <div>header</div>
      <div>
        <div>
          <div>
            <div>child</div>
          </div>
        </div>
      </div>
      <div>footer</div>
    `;

    const errorContent = () => dom`
      <div>error</div>
    `;

    type ChildProps = {
      hasError: boolean;
    };

    const Chlld = createComponent<ChildProps>(({ hasError }) => {
      if (hasError) {
        throw new Error();
      }

      return <div>child</div>;
    });

    type AppProps = {
      hasError?: boolean;
    };

    const App = createComponent<AppProps>(({ hasError }) => {
      const error = useError();

      if (error) {
        return <div>error</div>;
      }

      return [
        <div>header</div>,
        <div>
          <div>
            <div>
              <Chlld hasError={hasError} />
            </div>
          </div>
        </div>,
        <div>footer</div>,
      ];
    });

    render(<App />, host);
    expect(host.innerHTML).toBe(content());

    render(<App hasError />, host);
    jest.runAllTimers();
    expect(host.innerHTML).toBe(errorContent());

    render(<App />, host);
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content());
  });
});
