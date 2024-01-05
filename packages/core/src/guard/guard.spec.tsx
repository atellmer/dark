/** @jsx h */
import { createBrowserEnv } from '@test-utils';

import { h } from '../element';
import { component } from '../component';
import { Guard } from './guard';

let { render } = createBrowserEnv();

beforeEach(() => {
  ({ render } = createBrowserEnv());
});

describe('@core/guard', () => {
  test('skips renders correctly', () => {
    const spy = jest.fn();
    const Child = component(() => {
      spy();
      return null;
    });
    const App = component(() => {
      return (
        <Guard>
          <Child />
        </Guard>
      );
    });

    render(<App />);
    expect(spy).toHaveBeenCalledTimes(1);

    render(<App />);
    expect(spy).toHaveBeenCalledTimes(1);

    render(<App />);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
