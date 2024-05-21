import { createBrowserEnv } from '@test-utils';

import { component } from '../component';
import { Fragment } from './fragment';

let { host, render } = createBrowserEnv();

beforeEach(() => {
  ({ host, render } = createBrowserEnv());
});

describe('@core/fragment', () => {
  test('can render children correctly', () => {
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
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>1</div><div>2</div><div>3</div>"`);
  });
});
