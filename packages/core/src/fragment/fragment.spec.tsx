/** @jsx h */
import { createBrowserEnv, dom } from '@test-utils';

import { h } from '../element';
import { component } from '../component';
import { Fragment } from './fragment';

let { host, render } = createBrowserEnv();

beforeEach(() => {
  ({ host, render } = createBrowserEnv());
});

describe('@core/fragment', () => {
  test('can render children correctly', () => {
    const content = () => dom`
      <div>1</div>
      <div>2</div>
      <div>3</div>
    `;
    const App = component(() => {
      return (
        <Fragment>
          <div>1</div>
          <div>2</div>
          <div>3</div>
        </Fragment>
      );
    });

    render(<App />);
    expect(host.innerHTML).toBe(content());
  });
});
